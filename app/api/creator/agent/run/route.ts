import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchJsonWithRetry } from "@/lib/http-client";

type Input = {
  objective?: string;
  workspaceType?: "web" | "docs" | "consult" | "mixed";
};

function fallback(objective: string, workspaceType: string) {
  const baseSteps = [
    "Clarify target user, main outcome, and delivery constraints.",
    "Generate initial artifact plan with smallest useful scope.",
    "Create versioned output and review for quality + conversion.",
    "Iterate by instruction and finalize handoff-ready package.",
  ];

  return {
    summary: `Agent plan for ${workspaceType}: ${objective}`,
    steps: baseSteps,
    suggestedMode: workspaceType,
  };
}

const planSchema = z.object({
  summary: z.string().min(1).max(240).optional(),
  steps: z.array(z.string().min(1).max(220)).max(8).optional(),
  suggestedMode: z.enum(["web", "docs", "consult", "mixed"]).optional(),
});

function parseJsonSafe(raw: string) {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Input;
    const objective = (body.objective || "").trim();
    const workspaceType = body.workspaceType || "mixed";

    if (objective.length < 8) {
      return NextResponse.json({ error: "Objective must be at least 8 characters." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL_PLAN || process.env.OPENROUTER_MODEL || "stepfun/step-3.5-flash:free";

    if (!apiKey) {
      return NextResponse.json({ ...fallback(objective, workspaceType), mode: "fallback" });
    }

    const prompt = `Create a concise execution plan for an AI builder agent.
Objective: ${objective}
Workspace type: ${workspaceType}

Return strict JSON with keys:
summary (string),
steps (string[] max 8),
suggestedMode ("web"|"docs"|"consult"|"mixed").`;

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
          max_tokens: 450,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "You are an execution planner for an app-building agent. Output valid compact JSON only." },
            { role: "user", content: prompt },
          ],
        },
      });
      data = response.data as { choices?: Array<{ message?: { content?: string } }> };
    } catch {
      return NextResponse.json({ ...fallback(objective, workspaceType), mode: "fallback" });
    }

    const raw = data.choices?.[0]?.message?.content || "{}";
    const parsed = planSchema.safeParse(parseJsonSafe(raw));
    const base = fallback(objective, workspaceType);

    return NextResponse.json({
      summary: parsed.success ? parsed.data.summary || base.summary : base.summary,
      steps: parsed.success && parsed.data.steps?.length ? parsed.data.steps : base.steps,
      suggestedMode: parsed.success ? parsed.data.suggestedMode || workspaceType : workspaceType,
    });
  } catch {
    return NextResponse.json({ error: "Unexpected agent run error." }, { status: 500 });
  }
}
