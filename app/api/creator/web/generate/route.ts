import { NextResponse } from "next/server";
import { z } from "zod";
import { creatorErrorResponse, requireCreatorDatabase, requireCreatorUser } from "@/lib/creator-api";
import { prisma } from "@/lib/prisma";
import { nextArtifactVersion, requireOwnedProject } from "@/lib/creator-db";
import { claimIdempotencyKey } from "@/lib/idempotency";
import { fetchJsonWithRetry } from "@/lib/http-client";
import { creatorWebGenerateSchema } from "@/lib/validation";

type Input = {
  projectId?: string;
  prompt?: string;
  industry?: string;
  style?: string;
  pages?: string[];
  primaryCta?: string;
};

type WebOutput = {
  projectName: string;
  sitemap: string[];
  sectionsByPage: Record<string, string[]>;
  components: string[];
  metadata: { title: string; description: string };
  codeDraft: Record<string, string>;
};

const webOutputSchema = z.object({
  projectName: z.string().min(1).max(120).optional(),
  sitemap: z.array(z.string().min(1).max(120)).max(20).optional(),
  sectionsByPage: z.record(z.string(), z.array(z.string())).optional(),
  components: z.array(z.string().min(1).max(80)).max(40).optional(),
  metadata: z
    .object({
      title: z.string().min(1).max(80).optional(),
      description: z.string().min(1).max(220).optional(),
    })
    .optional(),
  codeDraft: z.record(z.string(), z.string()).optional(),
});

function parseJsonSafe(raw: string) {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function fallback(prompt: string): WebOutput {
  return {
    projectName: "Obsidian Generated Website",
    sitemap: ["/", "/about", "/services", "/contact"],
    sectionsByPage: {
      "/": ["Hero", "Services", "Call To Action", "Contact"],
      "/about": ["Company Story", "Mission", "Roadmap"],
      "/services": ["Service Grid", "Packages", "FAQ"],
      "/contact": ["Lead Form", "Contact Channels"],
    },
    components: ["Navbar", "Hero", "ServiceCard", "Footer", "ContactForm"],
    metadata: {
      title: "Generated Website",
      description: prompt.slice(0, 150),
    },
    codeDraft: {
      "app/page.tsx": `export default function Page(){return <main><h1>${prompt.replaceAll("`", "")}</h1></main>}`,
    },
  };
}

export async function POST(request: Request) {
  try {
    const hasDatabase = Boolean(process.env.DATABASE_URL);

    const idem = await claimIdempotencyKey({
      namespace: "creator_web_generate",
      key: request.headers.get("x-idempotency-key"),
      identifier: hasDatabase ? "db" : "transient",
      ttlSec: 300,
    });
    if (!idem.accepted) {
      return NextResponse.json({ error: "Duplicate generation request detected. Please wait before retrying." }, { status: 409 });
    }

    let authUserId: string | null = null;
    if (hasDatabase) {
      const unavailable = requireCreatorDatabase();
      if (unavailable) return unavailable;

      const auth = await requireCreatorUser(request);
      if (auth.response) return auth.response;
      authUserId = auth.user.id;
    }

    const body = (await request.json()) as Input;
    const parsedInput = creatorWebGenerateSchema.safeParse(body);
    if (!parsedInput.success) {
      return NextResponse.json({ error: "Invalid website generation payload." }, { status: 400 });
    }
    const input = parsedInput.data;
    const prompt = input.prompt;

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL_CODE || process.env.OPENROUTER_MODEL || "qwen/qwen3-coder:free";

    let output: WebOutput = fallback(prompt);

    if (apiKey) {
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
            temperature: 0.2,
            max_tokens: 1200,
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content:
                  "You are a website generator. Output strict JSON with keys: projectName, sitemap, sectionsByPage, components, metadata, codeDraft.",
              },
              {
                role: "user",
                content: `Prompt: ${prompt}\nIndustry: ${input.industry || "General"}\nStyle: ${input.style || "Modern"}\nPages: ${(input.pages || ["home", "services", "contact"]).join(", ")}\nCTA: ${input.primaryCta || "Start Your Project"}`,
              },
            ],
          },
        });

        const typed = data as { choices?: Array<{ message?: { content?: string } }> };
        const raw = typed.choices?.[0]?.message?.content || "{}";
        const candidate = parseJsonSafe(raw);
        const parsed = webOutputSchema.safeParse(candidate);
        if (parsed.success) {
          output = {
            projectName: parsed.data.projectName || output.projectName,
            sitemap: parsed.data.sitemap || output.sitemap,
            sectionsByPage: parsed.data.sectionsByPage || output.sectionsByPage,
            components: parsed.data.components || output.components,
            metadata: {
              title: parsed.data.metadata?.title || output.metadata.title,
              description: parsed.data.metadata?.description || output.metadata.description,
            },
            codeDraft: parsed.data.codeDraft || output.codeDraft,
          };
        }
      } catch {
        // Keep fallback output when provider fails
      }
    }

    if (!hasDatabase || !authUserId) {
      return NextResponse.json({
        projectId: null,
        persistence: "disabled",
        output,
        preview: {
          mode: "structured",
          content: output,
        },
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
            type: "web",
            title: output.projectName,
            description: prompt,
          },
        });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const version = await nextArtifactVersion(project.id);

    const artifact = await prisma.artifact.create({
      data: {
        projectId: project.id,
        type: "plan",
        title: `Website v${version}`,
        content: output,
        version,
      },
    });

    return NextResponse.json({
      projectId: project.id,
      plan: {
        sitemap: output.sitemap,
        sectionsByPage: output.sectionsByPage,
        components: output.components,
      },
      artifact: {
        id: artifact.id,
        type: artifact.type,
        version: artifact.version,
        title: artifact.title,
      },
      output,
      preview: {
        mode: "structured",
        content: output,
      },
    });
  } catch (error) {
    return creatorErrorResponse(error, "Unexpected web generation error.");
  }
}
