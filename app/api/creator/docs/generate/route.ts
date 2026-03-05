import { NextResponse } from "next/server";
import { creatorErrorResponse, requireCreatorDatabase, requireCreatorUser } from "@/lib/creator-api";
import { prisma } from "@/lib/prisma";
import { nextArtifactVersion, requireOwnedProject } from "@/lib/creator-db";

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

function fallback(body: Input): DocOutput {
  return {
    title: `${body.companyName || "Company"} ${body.documentType || "document"}`,
    outline: ["Executive Summary", "Business Context", "Recommendations", "Next Steps"],
    contentMarkdown: `# ${body.companyName || "Company"}\n\n## Executive Summary\nDraft placeholder. Configure OPENROUTER_API_KEY for full generation.`,
  };
}

export async function POST(request: Request) {
  const unavailable = requireCreatorDatabase();
  if (unavailable) return unavailable;

  try {
    const auth = await requireCreatorUser(request);
    if (auth.response) return auth.response;

    const body = (await request.json()) as Input;

    if (!body.documentType || !body.companyName) {
      return NextResponse.json({ error: "Document type and company name are required." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL_DOCS || process.env.OPENROUTER_MODEL || "openai/gpt-oss-120b:free";

    let output = fallback(body);

    if (apiKey) {
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

      if (res.ok) {
        const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
        const raw = data.choices?.[0]?.message?.content || "{}";
        const parsed = JSON.parse(raw) as Partial<DocOutput>;
        output = {
          title: parsed.title || output.title,
          outline: Array.isArray(parsed.outline) ? parsed.outline : output.outline,
          contentMarkdown: parsed.contentMarkdown || output.contentMarkdown,
        };
      }
    }

    const project = body.projectId
      ? await (async () => {
          const owned = await requireOwnedProject(body.projectId!, auth.user.id);
          if (!owned) {
            return null;
          }
          return prisma.project.update({ where: { id: body.projectId }, data: { updatedAt: new Date() } });
        })()
      : await prisma.project.create({
          data: {
            userId: auth.user.id,
            type: "docs",
            title: output.title,
            description: `Generated ${body.documentType} for ${body.companyName}`,
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
    });
  } catch (error) {
    return creatorErrorResponse(error, "Unexpected document generation error.");
  }
}
