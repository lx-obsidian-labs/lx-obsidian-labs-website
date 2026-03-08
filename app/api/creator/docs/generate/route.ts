import { NextResponse } from "next/server";
import { z } from "zod";
import { creatorErrorResponse, requireCreatorDatabase, requireCreatorUser } from "@/lib/creator-api";
import { prisma } from "@/lib/prisma";
import { nextArtifactVersion, requireOwnedProject } from "@/lib/creator-db";
import { claimIdempotencyKey } from "@/lib/idempotency";
import { fetchJsonWithRetry } from "@/lib/http-client";
import { creatorDocsGenerateSchema } from "@/lib/validation";

type Input = {
  projectId?: string;
  documentType?: "company-profile" | "business-plan" | "proposal" | "policy";
  companyName?: string;
  industry?: string;
  tone?: string;
  goal?: string;
  keyPoints?: string[];
};

type DocOutput = {
  title: string;
  outline: string[];
  contentMarkdown: string;
};

type DocQuality = {
  score: number;
  strengths: string[];
  recommendations: string[];
};

const docOutputSchema = z.object({
  title: z.string().min(1).max(140).optional(),
  outline: z.array(z.string().min(1).max(140)).max(24).optional(),
  contentMarkdown: z.string().min(1).optional(),
});

function parseJsonSafe(raw: string) {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function fallback(body: Input): DocOutput {
  return {
    title: `${body.companyName || "Company"} ${body.documentType || "document"}`,
    outline: ["Executive Summary", "Business Context", "Recommendations", "Next Steps"],
    contentMarkdown: `# ${body.companyName || "Company"}\n\n## Executive Summary\nDraft placeholder. Configure OPENROUTER_API_KEY for full generation.`,
  };
}

function normalizeDocOutput(output: DocOutput): DocOutput {
  const title = output.title.trim().slice(0, 140) || "Generated Document";
  const outline = (output.outline || []).filter(Boolean).slice(0, 24);
  const contentMarkdown = output.contentMarkdown.trim();

  return {
    title,
    outline: outline.length ? outline : ["Executive Summary", "Scope", "Plan", "Next Steps"],
    contentMarkdown: contentMarkdown || `# ${title}\n\n## Executive Summary\nDraft content generated.`,
  };
}

function evaluateDocOutput(output: DocOutput): DocQuality {
  let score = 100;
  const strengths: string[] = [];
  const recommendations: string[] = [];

  if (output.outline.length >= 4) strengths.push("Outline provides clear structure");
  else {
    score -= 15;
    recommendations.push("Expand outline to at least 4 sections");
  }

  if (output.contentMarkdown.length >= 600) strengths.push("Content has workable depth");
  else {
    score -= 15;
    recommendations.push("Increase document depth with examples and implementation detail");
  }

  if (output.contentMarkdown.includes("##")) strengths.push("Document uses sectional headings for readability");
  else {
    score -= 10;
    recommendations.push("Use markdown headings to improve scannability");
  }

  if (!output.contentMarkdown.toLowerCase().includes("next steps")) {
    score -= 8;
    recommendations.push("Add a clear Next Steps section");
  }

  return {
    score: Math.max(40, score),
    strengths: strengths.slice(0, 4),
    recommendations: recommendations.slice(0, 5),
  };
}

export async function POST(request: Request) {
  try {
    const hasDatabase = Boolean(process.env.DATABASE_URL);

    let authUserId: string | null = null;
    if (hasDatabase) {
      const unavailable = requireCreatorDatabase();
      if (unavailable) return unavailable;

      const auth = await requireCreatorUser(request);
      if (auth.response) return auth.response;
      authUserId = auth.user.id;
    }

    const idem = await claimIdempotencyKey({
      namespace: "creator_docs_generate",
      key: request.headers.get("x-idempotency-key"),
      identifier: hasDatabase ? "db" : "transient",
      ttlSec: 300,
    });
    if (!idem.accepted) {
      return NextResponse.json({ error: "Duplicate generation request detected. Please wait before retrying." }, { status: 409 });
    }

    const body = (await request.json()) as Input;
    const parsedInput = creatorDocsGenerateSchema.safeParse(body);
    if (!parsedInput.success) {
      return NextResponse.json({ error: "Invalid document generation payload." }, { status: 400 });
    }
    const input = parsedInput.data;

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL_DOCS || process.env.OPENROUTER_MODEL || "openai/gpt-oss-120b:free";

    let output = fallback(input);

    if (apiKey) {
      const prompt = `Generate a professional ${input.documentType} in markdown.
Company: ${input.companyName}
Industry: ${input.industry || "General"}
Tone: ${input.tone || "Corporate"}
Goal: ${input.goal || "Not provided"}
Key points: ${(input.keyPoints || []).join(", ") || "Not provided"}

Return strict JSON with keys: title (string), outline (string[]), contentMarkdown (string).`;

      try {
        const { data } = await fetchJsonWithRetry("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          timeoutMs: 22000,
          retries: 1,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: {
            model,
            temperature: 0.3,
            max_tokens: 1200,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: "You output valid compact JSON only." },
              { role: "user", content: prompt },
            ],
          },
        });
        const typed = data as { choices?: Array<{ message?: { content?: string } }> };
        const raw = typed.choices?.[0]?.message?.content || "{}";
        const candidate = parseJsonSafe(raw);
        const parsed = docOutputSchema.safeParse(candidate);
        if (parsed.success) {
          output = {
            title: parsed.data.title || output.title,
            outline: parsed.data.outline || output.outline,
            contentMarkdown: parsed.data.contentMarkdown || output.contentMarkdown,
          };
        }
      } catch {
        // Keep fallback output when provider fails
      }
    }

    output = normalizeDocOutput(output);
    const quality = evaluateDocOutput(output);

    if (!hasDatabase || !authUserId) {
      return NextResponse.json({
        projectId: null,
        persistence: "disabled",
        output,
        quality,
      });
    }

    const project = input.projectId
      ? await (async () => {
          const owned = await requireOwnedProject(input.projectId!, authUserId);
          if (!owned) {
            return null;
          }
          return prisma.project.update({ where: { id: input.projectId }, data: { updatedAt: new Date() } });
        })()
      : await prisma.project.create({
          data: {
            userId: authUserId,
            type: "docs",
            title: output.title,
            description: `Generated ${input.documentType} for ${input.companyName}`,
          },
        });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const version = await nextArtifactVersion(project.id);

    const artifact = await prisma.artifact.create({
      data: {
        projectId: project.id,
        type: "document",
        title: `${output.title} v${version}`,
        content: output,
        version,
      },
    });

    return NextResponse.json({
      projectId: project.id,
      artifact: {
        id: artifact.id,
        type: artifact.type,
        version: artifact.version,
        title: artifact.title,
      },
      output,
      quality,
    });
  } catch (error) {
    return creatorErrorResponse(error, "Unexpected document generation error.");
  }
}
