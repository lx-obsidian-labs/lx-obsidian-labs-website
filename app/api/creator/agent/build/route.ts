import { NextResponse } from "next/server";
import { z } from "zod";
import { creatorAgentBuildSchema } from "@/lib/validation";
import { creatorErrorResponse, requireCreatorDatabase, requireCreatorUser } from "@/lib/creator-api";
import { prisma } from "@/lib/prisma";
import { fetchJsonWithRetry } from "@/lib/http-client";

type Input = {
  objective?: string;
  workspaceType?: "web" | "docs" | "consult" | "mixed";
  companyName?: string;
  audience?: string;
  depth?: "quick" | "standard" | "deep";
  forcedModes?: Array<"web" | "docs" | "consult">;
};

type Plan = {
  summary: string;
  steps: string[];
  suggestedMode: "web" | "docs" | "consult" | "mixed";
};

type AgentMode = "web" | "docs" | "consult";
type OutputResult = { mode: AgentMode; projectId?: string; title?: string };
type FailureResult = { mode: AgentMode; error: string };

const planSchema = z.object({
  summary: z.string().min(1).max(240).optional(),
  steps: z.array(z.string().min(1).max(220)).max(8).optional(),
  suggestedMode: z.enum(["web", "docs", "consult", "mixed"]).optional(),
});

function fallbackPlan(objective: string, workspaceType: Plan["suggestedMode"]): Plan {
  return {
    summary: `Agent plan for ${workspaceType}: ${objective}`,
    steps: [
      "Clarify target user, main outcome, and delivery constraints.",
      "Generate initial artifact plan with smallest useful scope.",
      "Create versioned output and review for quality + conversion.",
      "Iterate by instruction and finalize handoff-ready package.",
    ],
    suggestedMode: workspaceType,
  };
}

function parseJsonSafe(raw: string) {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function getBaseUrl(request: Request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "http";
  if (!host) return null;
  return `${proto}://${host}`;
}

async function callJson(request: Request, path: string, payload: Record<string, unknown>) {
  const baseUrl = getBaseUrl(request);
  if (!baseUrl) throw new Error("Unable to resolve API base URL.");

  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: request.headers.get("cookie") || "",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (!res.ok) {
    throw new Error((data?.error as string | undefined) || `Failed while calling ${path}`);
  }
  if (!data) {
    throw new Error(`Empty response from ${path}`);
  }
  return data;
}

export async function POST(request: Request) {
  try {
    const hasDatabase = Boolean(process.env.DATABASE_URL);
    if (hasDatabase) {
      const unavailable = requireCreatorDatabase();
      if (unavailable) return unavailable;

      const auth = await requireCreatorUser(request);
      if (auth.response) return auth.response;
    }

    const body = (await request.json()) as Input;
    const parsedInput = creatorAgentBuildSchema.safeParse(body);
    if (!parsedInput.success) {
      return NextResponse.json({ error: "Invalid agent build payload." }, { status: 400 });
    }

    const objective = parsedInput.data.objective;
    const workspaceType = parsedInput.data.workspaceType;
    const companyName = (parsedInput.data.companyName || "LX Obsidian Labs Client").trim();
    const audience = (parsedInput.data.audience || "business decision makers").trim();
    const depth = parsedInput.data.depth;
    const forcedModes = parsedInput.data.forcedModes as AgentMode[];

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL_PLAN || process.env.OPENROUTER_MODEL || "stepfun/step-3.5-flash:free";

    let plan = fallbackPlan(objective, workspaceType);

    if (apiKey) {
      const prompt = `Create a concise execution plan for an AI builder agent.
Objective: ${objective}
Workspace type: ${workspaceType}
Audience: ${audience}
Depth: ${depth}

Return strict JSON with keys:
summary (string),
steps (string[] max 8),
suggestedMode ("web"|"docs"|"consult"|"mixed").`;

      try {
        const { data } = await fetchJsonWithRetry("https://openrouter.ai/api/v1/chat/completions", {
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

        const typed = data as { choices?: Array<{ message?: { content?: string } }> };
        const raw = typed.choices?.[0]?.message?.content || "{}";
        const parsed = planSchema.safeParse(parseJsonSafe(raw));
        if (parsed.success) {
          plan = {
            summary: parsed.data.summary || plan.summary,
            steps: parsed.data.steps?.length ? parsed.data.steps : plan.steps,
            suggestedMode: parsed.data.suggestedMode || plan.suggestedMode,
          };
        }
      } catch {
        // keep fallback plan when provider fails
      }
    }

    const outputs: OutputResult[] = [];
    const failures: FailureResult[] = [];
    const logs: string[] = [];

    const executeMode: AgentMode[] =
      forcedModes.length > 0
        ? forcedModes
        : plan.suggestedMode === "mixed"
          ? ["web", "docs"]
          : [plan.suggestedMode];

    logs.push(`Planned mode: ${plan.suggestedMode}`);
    logs.push(`Execution depth: ${depth}`);
    logs.push(`Execution targets: ${executeMode.join(", ")}`);

    for (const mode of executeMode) {
      if (mode === "web") {
        try {
          logs.push("Generating web project...");
          const data = await callJson(request, "/api/creator/web/generate", {
            prompt: `${objective}\nTarget audience: ${audience}`,
            style: depth === "deep" ? "premium, detailed, conversion-focused" : "clean and conversion-focused",
            pages: ["home", "services", "about", "contact"],
            primaryCta: depth === "quick" ? "Book a Call" : "Start Your Project",
          });
          outputs.push({ mode: "web", projectId: data.projectId as string | undefined, title: (data.output as { projectName?: string } | undefined)?.projectName });
          if (typeof data.projectId === "string") {
            await prisma.run.create({
              data: {
                projectId: data.projectId,
                mode: "agent:web",
                status: "completed",
                logs: { objective, audience, depth },
              },
            });
          }
          logs.push("Web project generated.");
        } catch (error) {
          const message = error instanceof Error ? error.message : "Web generation failed.";
          failures.push({ mode: "web", error: message });
          logs.push(`Web generation failed: ${message}`);
        }
      }

      if (mode === "docs") {
        try {
          logs.push("Generating document project...");
          const data = await callJson(request, "/api/creator/docs/generate", {
            documentType: depth === "deep" ? "business-plan" : "proposal",
            companyName,
            industry: audience,
            tone: depth === "quick" ? "direct" : "professional",
            goal: `${objective} (Target audience: ${audience})`,
            keyPoints: ["Business outcome", "Execution scope", "Delivery timeline", "Expected ROI"],
          });
          outputs.push({ mode: "docs", projectId: data.projectId as string | undefined, title: (data.output as { title?: string } | undefined)?.title });
          if (typeof data.projectId === "string") {
            await prisma.run.create({
              data: {
                projectId: data.projectId,
                mode: "agent:docs",
                status: "completed",
                logs: { objective, audience, depth },
              },
            });
          }
          logs.push("Document project generated.");
        } catch (error) {
          const message = error instanceof Error ? error.message : "Document generation failed.";
          failures.push({ mode: "docs", error: message });
          logs.push(`Document generation failed: ${message}`);
        }
      }

      if (mode === "consult") {
        if (!hasDatabase) {
          failures.push({ mode: "consult", error: "Consult persistence requires DATABASE_URL." });
          logs.push("Consult generation skipped: persistence disabled.");
          continue;
        }

        try {
          logs.push("Generating consulting project...");
          const data = await callJson(request, "/api/creator/projects", {
            title: `Consult Plan: ${objective.slice(0, 60)}`,
            type: "consult",
            description: "Generated by Agent Build",
            payload: {
              objective,
              audience,
              depth,
              plan,
            },
          });
          const project = data.project as { id?: string; title?: string } | undefined;
          outputs.push({ mode: "consult", projectId: project?.id, title: project?.title });
          if (project?.id) {
            await prisma.run.create({
              data: {
                projectId: project.id,
                mode: "agent:consult",
                status: "completed",
                logs: { objective, audience, depth },
              },
            });
          }
          logs.push("Consulting project generated.");
        } catch (error) {
          const message = error instanceof Error ? error.message : "Consult project generation failed.";
          failures.push({ mode: "consult", error: message });
          logs.push(`Consult project generation failed: ${message}`);
        }
      }
    }

    logs.push(`Completed with ${outputs.length} output(s).`);

    if (!outputs.length && failures.length) {
      return NextResponse.json(
        {
          error: "Agent build could not create outputs.",
          plan,
          outputs,
          failures,
          logs,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      plan,
      outputs,
      failures,
      ok: failures.length === 0,
      logs,
      message: "Agent run completed and outputs were created.",
    });
  } catch (error) {
    return creatorErrorResponse(error, error instanceof Error ? error.message : "Unexpected agent build error.");
  }
}
