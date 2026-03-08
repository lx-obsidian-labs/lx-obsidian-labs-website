import { NextResponse } from "next/server";
import { fetchJsonWithRetry } from "@/lib/http-client";
import { creatorWebGenerateSchema } from "@/lib/validation";

type Input = {
  prompt?: string;
  industry?: string;
  style?: string;
  pages?: string[];
  primaryCta?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Input;
    const parsedInput = creatorWebGenerateSchema.safeParse(body);
    if (!parsedInput.success) {
      return NextResponse.json({ error: "Please provide a clear project prompt." }, { status: 400 });
    }
    const input = parsedInput.data;

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "stepfun/step-3.5-flash:free";

    if (!apiKey) {
      return NextResponse.json(
        {
          projectName: "Generated Project",
          sitemap: ["/", "/services", "/contact"],
          sectionsByPage: {
            "/": ["Hero", "Features", "CTA"],
            "/services": ["Service Grid", "Packages", "FAQ"],
            "/contact": ["Lead Form", "Contact Details"],
          },
          components: ["Navbar", "Footer", "Hero", "Cards", "ContactForm"],
          mode: "fallback",
        },
        { status: 200 },
      );
    }

    const userPrompt = `Create a compact JSON build plan for a website/web app.
Prompt: ${input.prompt}
Industry: ${input.industry || "General"}
Style: ${input.style || "Modern"}
Pages: ${(input.pages || ["home", "services", "contact"]).join(", ")}
Primary CTA: ${input.primaryCta || "Start Your Project"}

Return strict JSON with keys:
projectName (string), sitemap (string[]), sectionsByPage (record<string,string[]>), components (string[])`;

    let data: { choices?: Array<{ message?: { content?: string } }> } | null = null;
    try {
      const response = await fetchJsonWithRetry("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        timeoutMs: 18000,
        retries: 1,
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: {
          model,
          temperature: 0.2,
          max_tokens: 500,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "You output valid compact JSON only." },
            { role: "user", content: userPrompt },
          ],
        },
      });
      data = response.data as { choices?: Array<{ message?: { content?: string } }> };
    } catch {
      return NextResponse.json({ error: "Provider error while generating plan." }, { status: 502 });
    }

    const raw = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Unexpected planning error." }, { status: 500 });
  }
}
