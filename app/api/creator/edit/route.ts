import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { creatorErrorResponse, requireCreatorDatabase, requireCreatorUser } from "@/lib/creator-api";
import { prisma } from "@/lib/prisma";
import { nextArtifactVersion, requireOwnedProject } from "@/lib/creator-db";
import { claimIdempotencyKey } from "@/lib/idempotency";
import { fetchJsonWithRetry } from "@/lib/http-client";

type Input = {
  projectId?: string;
  artifactId?: string;
  instruction?: string;
  mode?: "web" | "docs";
};

const editResponseSchema = z.object({
  updatedArtifact: z.unknown().optional(),
  changes: z.array(z.string().min(1).max(180)).max(8).optional(),
});

function parseJsonSafe(raw: string) {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function fallbackEdit(content: unknown, instruction: string, mode: "web" | "docs") {
  if (mode === "docs" && typeof content === "object" && content !== null) {
    const doc = content as { contentMarkdown?: string };
    return {
      ...content,
      contentMarkdown: `${doc.contentMarkdown || ""}\n\n## Edit Notes\n${instruction}`,
    };
  }

  if (mode === "web" && typeof content === "object" && content !== null) {
    const web = content as { metadata?: { title?: string; description?: string } };
    return {
      ...content,
      metadata: {
        title: web.metadata?.title || "Generated Website",
        description: `${web.metadata?.description || ""} | Edited: ${instruction}`.slice(0, 180),
      },
    };
  }

  return content;
}

export async function POST(request: Request) {
  const unavailable = requireCreatorDatabase();
  if (unavailable) return unavailable;

  try {
    const auth = await requireCreatorUser(request);
    if (auth.response) return auth.response;

    const idem = await claimIdempotencyKey({
      namespace: "creator_edit",
      key: request.headers.get("x-idempotency-key"),
      identifier: auth.user.id,
      ttlSec: 180,
    });
    if (!idem.accepted) {
      return NextResponse.json({ error: "Duplicate edit request detected. Please wait before retrying." }, { status: 409 });
    }

    const body = (await request.json()) as Input;

    if (!body.projectId || !body.instruction || body.instruction.trim().length < 4) {
      return NextResponse.json({ error: "projectId and instruction are required" }, { status: 400 });
    }

    const ownedProject = await requireOwnedProject(body.projectId, auth.user.id);
    if (!ownedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const sourceArtifact = body.artifactId
      ? await prisma.artifact.findUnique({ where: { id: body.artifactId } })
      : await prisma.artifact.findFirst({ where: { projectId: body.projectId }, orderBy: { version: "desc" } });

    if (!sourceArtifact) {
      return NextResponse.json({ error: "No source artifact found" }, { status: 404 });
    }

    if (sourceArtifact.projectId !== body.projectId) {
      return NextResponse.json({ error: "Artifact does not belong to project" }, { status: 400 });
    }

    const mode: "web" | "docs" = body.mode || (sourceArtifact.type === "document" ? "docs" : "web");
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model =
      mode === "web"
        ? process.env.OPENROUTER_MODEL_CODE || process.env.OPENROUTER_MODEL || "qwen/qwen3-coder:free"
        : process.env.OPENROUTER_MODEL_DOCS || process.env.OPENROUTER_MODEL || "openai/gpt-oss-20b:free";

    let nextContent: unknown = fallbackEdit(sourceArtifact.content, body.instruction, mode);
    const changes: string[] = [`Applied instruction: ${body.instruction}`];

    if (apiKey) {
      try {
        const { data } = await fetchJsonWithRetry("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          timeoutMs: 20000,
          retries: 1,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: {
            model,
            temperature: 0.2,
            max_tokens: 900,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: "Edit artifacts safely. Return strict JSON with keys updatedArtifact and changes (string[])." },
              {
                role: "user",
                content: `Mode: ${mode}\nInstruction: ${body.instruction}\nCurrent artifact JSON:\n${JSON.stringify(sourceArtifact.content)}`,
              },
            ],
          },
        });
        const typed = data as { choices?: Array<{ message?: { content?: string } }> };
        const raw = typed.choices?.[0]?.message?.content || "{}";
        const parsed = editResponseSchema.safeParse(parseJsonSafe(raw));
        if (parsed.success) {
          if (parsed.data.updatedArtifact) {
            nextContent = parsed.data.updatedArtifact;
          }
          if (parsed.data.changes?.length) {
            changes.splice(0, changes.length, ...parsed.data.changes);
          }
        }
      } catch {
        // keep fallback edit when provider fails
      }
    }

    const version = await nextArtifactVersion(body.projectId);
    const content = (nextContent ?? {}) as Prisma.InputJsonValue;
    const artifact = await prisma.artifact.create({
      data: {
        projectId: body.projectId,
        type: sourceArtifact.type,
        title: `${sourceArtifact.title.split(" v")[0]} v${version}`,
        content,
        version,
      },
    });

    await prisma.project.update({ where: { id: body.projectId }, data: { updatedAt: new Date() } });

    return NextResponse.json({
      projectId: body.projectId,
      sourceArtifactId: sourceArtifact.id,
      newArtifact: {
        id: artifact.id,
        version: artifact.version,
        title: artifact.title,
      },
      changes,
      preview: {
        mode: "structured",
        content: nextContent,
      },
    });
  } catch (error) {
    return creatorErrorResponse(error, "Unexpected edit error");
  }
}
