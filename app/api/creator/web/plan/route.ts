import { NextResponse } from "next/server";

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
    if (!body.prompt || body.prompt.trim().length < 8) {
      return NextResponse.json({ error: "Please provide a clear project prompt." }, { status: 400 });
    }

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
Prompt: ${body.prompt}
Industry: ${body.industry || "General"}
Style: ${body.style || "Modern"}
Pages: ${(body.pages || ["home", "services", "contact"]).join(", ")}
Primary CTA: ${body.primaryCta || "Start Your Project"}

Return strict JSON with keys:
projectName (string), sitemap (string[]), sectionsByPage (record<string,string[]>), components (string[])`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 500,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You output valid compact JSON only." },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Provider error while generating plan." }, { status: 502 });
    }

    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Unexpected planning error." }, { status: 500 });
  }
}
