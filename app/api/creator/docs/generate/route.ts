import { NextResponse } from "next/server";

type Input = {
  documentType?: "company-profile" | "business-plan" | "proposal" | "policy";
  companyName?: string;
  industry?: string;
  tone?: string;
  goal?: string;
  keyPoints?: string[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Input;

    if (!body.documentType || !body.companyName) {
      return NextResponse.json({ error: "Document type and company name are required." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "stepfun/step-3.5-flash:free";

    if (!apiKey) {
      return NextResponse.json(
        {
          title: `${body.companyName} ${body.documentType}`,
          outline: ["Executive Summary", "Business Context", "Recommendations", "Next Steps"],
          contentMarkdown: `# ${body.companyName}\n\n## Executive Summary\nDraft placeholder. Configure OPENROUTER_API_KEY for full generation.`,
          mode: "fallback",
        },
        { status: 200 },
      );
    }

    const prompt = `Generate a professional ${body.documentType} in markdown.
Company: ${body.companyName}
Industry: ${body.industry || "General"}
Tone: ${body.tone || "Corporate"}
Goal: ${body.goal || "Not provided"}
Key points: ${(body.keyPoints || []).join(", ") || "Not provided"}

Return strict JSON with keys: title (string), outline (string[]), contentMarkdown (string).`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 1200,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You output valid compact JSON only." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Provider error while generating document." }, { status: 502 });
    }

    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Unexpected document generation error." }, { status: 500 });
  }
}
