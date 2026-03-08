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
  acceptanceCriteria?: string[];
  launchChecklist?: string[];
};

type WebQuality = {
  score: number;
  strengths: string[];
  recommendations: string[];
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
  acceptanceCriteria: z.array(z.string().min(1).max(180)).max(8).optional(),
  launchChecklist: z.array(z.string().min(1).max(180)).max(10).optional(),
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
    acceptanceCriteria: [
      "Landing page communicates value proposition within first viewport",
      "Primary call-to-action is visible above the fold",
      "Contact route and conversion path are present",
    ],
    launchChecklist: [
      "Validate metadata title and description",
      "Check mobile spacing and CTA visibility",
      "Connect lead capture endpoint",
      "Run build and publish",
    ],
  };
}

function normalizeWebOutput(output: WebOutput, input: Input, prompt: string): WebOutput {
  const requestedPages = (input.pages || []).filter(Boolean).map((page) => (page.startsWith("/") ? page : `/${page}`));
  const baseSitemap = requestedPages.length ? requestedPages : output.sitemap;
  const uniqueSitemap = Array.from(new Set(baseSitemap)).slice(0, 20);

  const sectionsByPage: Record<string, string[]> = { ...output.sectionsByPage };
  for (const page of uniqueSitemap) {
    if (!sectionsByPage[page] || !sectionsByPage[page].length) {
      sectionsByPage[page] = page === "/"
        ? ["Hero", "Value Proposition", "Primary CTA", "Trust Section"]
        : ["Overview", "Details", "Conversion CTA"];
    }
  }

  const title = (output.metadata.title || output.projectName || "Generated Website").slice(0, 80);
  const descriptionBase = output.metadata.description || prompt;
  const description = descriptionBase.slice(0, 220);

  return {
    ...output,
    sitemap: uniqueSitemap.length ? uniqueSitemap : ["/", "/services", "/contact"],
    sectionsByPage,
    metadata: { title, description },
    acceptanceCriteria: (output.acceptanceCriteria || []).slice(0, 8),
    launchChecklist: (output.launchChecklist || []).slice(0, 10),
  };
}

function evaluateWebOutput(output: WebOutput): WebQuality {
  let score = 100;
  const strengths: string[] = [];
  const recommendations: string[] = [];

  if (output.sitemap.length >= 3) strengths.push("Sitemap covers key pages");
  else {
    score -= 15;
    recommendations.push("Add at least 3 key pages (home/services/contact)");
  }

  if (output.metadata.title.length >= 20 && output.metadata.title.length <= 70) strengths.push("Metadata title length is healthy");
  else {
    score -= 10;
    recommendations.push("Adjust title length to 20-70 characters");
  }

  if (output.metadata.description.length >= 70 && output.metadata.description.length <= 170) strengths.push("Metadata description supports SEO previews");
  else {
    score -= 10;
    recommendations.push("Adjust description length to 70-170 characters");
  }

  if (output.components.length >= 4) strengths.push("Component map is sufficiently detailed");
  else {
    score -= 8;
    recommendations.push("Expand component map with conversion and trust sections");
  }

  if (!output.acceptanceCriteria?.length) {
    score -= 8;
    recommendations.push("Define acceptance criteria for QA and handoff");
  }

  if (!output.launchChecklist?.length) {
    score -= 8;
    recommendations.push("Add launch checklist before publishing");
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
                  "You are a website generator focused on conversion and implementation quality. Output strict JSON with keys: projectName, sitemap, sectionsByPage, components, metadata, codeDraft, acceptanceCriteria, launchChecklist.",
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
            acceptanceCriteria: parsed.data.acceptanceCriteria || output.acceptanceCriteria,
            launchChecklist: parsed.data.launchChecklist || output.launchChecklist,
          };
        }
      } catch {
        // Keep fallback output when provider fails
      }
    }

    output = normalizeWebOutput(output, input, prompt);
    const quality = evaluateWebOutput(output);

    if (!hasDatabase || !authUserId) {
      return NextResponse.json({
        projectId: null,
        persistence: "disabled",
        output,
        quality,
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
      quality,
      preview: {
        mode: "structured",
        content: output,
      },
    });
  } catch (error) {
    return creatorErrorResponse(error, "Unexpected web generation error.");
  }
}
