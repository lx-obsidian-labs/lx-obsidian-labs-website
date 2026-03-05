import { NextResponse } from "next/server";

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

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 450,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are an execution planner for an app-building agent. Output valid compact JSON only." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ ...fallback(objective, workspaceType), mode: "fallback" });
    }

    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw) as {
      summary?: string;
      steps?: string[];
      suggestedMode?: "web" | "docs" | "consult" | "mixed";
    };

    return NextResponse.json({
      summary: parsed.summary || fallback(objective, workspaceType).summary,
      steps: Array.isArray(parsed.steps) && parsed.steps.length ? parsed.steps.slice(0, 8) : fallback(objective, workspaceType).steps,
      suggestedMode: parsed.suggestedMode || workspaceType,
    });
  } catch {
    return NextResponse.json({ error: "Unexpected agent run error." }, { status: 500 });
  }
}
