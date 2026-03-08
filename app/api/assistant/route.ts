import { NextResponse } from "next/server";
import { companyContent } from "@/content/site";
import { industrySolutions, processSteps, services } from "@/lib/data";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { fetchJsonWithRetry } from "@/lib/http-client";

type AssistantMessage = {
  role: "user" | "assistant";
  text: string;
};

function toOpenRouterMessages(messages: AssistantMessage[]) {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.text,
  }));
}

function fallbackReply(messages: AssistantMessage[]) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.text.toLowerCase() || "";

  if (lastUser.includes("hello") || lastUser.includes("hi")) {
    return `Hello. I am the ${companyContent.name} assistant. We provide software development, graphic design, and business consultancy. What are you planning to build?`;
  }

  if (lastUser.includes("price") || lastUser.includes("estimate") || lastUser.includes("cost")) {
    return "I can provide a rough estimate range based on project type, complexity, and timeline. Please share those details and I will guide you.";
  }

  if (lastUser.includes("service") || lastUser.includes("what do you do") || lastUser.includes("company")) {
    return `${companyContent.shortDescription} Key services include web apps, CMS systems, automation, brand identity, and business systems consulting.`;
  }

  if (lastUser.includes("contact") || lastUser.includes("whatsapp") || lastUser.includes("call")) {
    return "You can reach us on WhatsApp at +27 76 298 2399 or submit the smart lead form on the Contact page for a scoped follow-up.";
  }

  return "I can help scope your project and suggest the best next step. Share your goal, preferred timeline, and budget range.";
}

function buildKnowledgePrompt() {
  const serviceLines = services
    .map((service) => `${service.title}: ${service.items.slice(0, 5).join(", ")}`)
    .join(" | ");

  const processLine = processSteps.map((step) => step.title).join(" -> ");

  const industryLine = industrySolutions
    .map((industry) => `${industry.industry}: ${industry.solutions.join(", ")}`)
    .join(" | ");

  return [
    `Company: ${companyContent.name}`,
    `Positioning: ${companyContent.oneLiner}`,
    `Overview: ${companyContent.intro}`,
    `Services: ${serviceLines}`,
    `Build process: ${processLine}`,
    `Industries: ${industryLine}`,
    "Contact: Phone/WhatsApp +27 76 298 2399, Email vilanenathan@gmail.com",
    "Rules: Never promise exact final pricing. Offer estimate ranges only. Keep response concise and business-focused.",
    "CTA Rule: End answers with one clear next step: Contact form, WhatsApp, or consultation booking.",
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limiter = await rateLimit({
      namespace: "assistant",
      identifier: ip,
      limit: 25,
      windowSec: 60,
    });

    if (!limiter.success) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    const body = (await request.json()) as { messages?: AssistantMessage[] };
    const incoming = body.messages ?? [];

    if (!Array.isArray(incoming) || incoming.length === 0) {
      return NextResponse.json({ error: "Missing assistant messages" }, { status: 400 });
    }

    const safeMessages = incoming
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.text === "string")
      .map((m) => ({ role: m.role, text: m.text.trim().slice(0, 1200) }))
      .filter((m) => m.text.length > 0)
      .slice(-8);

    if (!safeMessages.length) {
      return NextResponse.json({ error: "No valid messages provided" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "stepfun/step-3.5-flash:free";

    if (!apiKey) {
      return NextResponse.json({ reply: fallbackReply(safeMessages), mode: "fallback" });
    }

    const systemPrompt = `You are the official ${companyContent.name} AI Business Assistant.
Use only company context below when describing capabilities.
Be practical, concise, and conversion-focused.
${buildKnowledgePrompt()}`;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const { data } = await fetchJsonWithRetry("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          timeoutMs: 18000,
          retries: 0,
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "https://lxobsidianlabs.com",
            "X-Title": "LX Obsidian Labs Website",
          },
          body: {
            model,
            temperature: 0.4,
            max_tokens: 220,
            messages: [
              { role: "system", content: systemPrompt },
              ...toOpenRouterMessages(safeMessages),
            ],
          },
        });

        const typed = data as {
          choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }>;
        };

        const content = typed.choices?.[0]?.message?.content;
        const reply =
          typeof content === "string"
            ? content
            : Array.isArray(content)
              ? content.map((part) => part.text || "").join(" ").trim()
              : "";

        if (reply) {
          return NextResponse.json({ reply });
        }
      } catch {
        continue;
      }
    }

    return NextResponse.json({ reply: fallbackReply(safeMessages), mode: "fallback" });
  } catch {
    return NextResponse.json({ reply: "I am temporarily unavailable. Please continue with your project details and I will still guide your next step.", mode: "fallback" });
  }
}
