import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { creatorErrorResponse, requireCreatorDatabase } from "@/lib/creator-api";
import { prisma } from "@/lib/prisma";
import { ensureDemoUser } from "@/lib/creator-db";

function toProjectType(value: string | undefined) {
  if (value === "web" || value === "docs" || value === "image" || value === "consult") return value;
  return "consult";
}

export async function GET() {
  const unavailable = requireCreatorDatabase();
  if (unavailable) return unavailable;

  try {
    const user = await ensureDemoUser();
    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      include: {
        artifacts: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ projects });
  } catch (error) {
    return creatorErrorResponse(error, "Unable to fetch projects");
  }
}

export async function POST(request: Request) {
  const unavailable = requireCreatorDatabase();
  if (unavailable) return unavailable;

  try {
    const body = (await request.json()) as {
      title?: string;
      type?: string;
      description?: string;
      payload?: unknown;
    };

    if (!body.title || body.title.trim().length < 2) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 });
    }

    const user = await ensureDemoUser();

    const created = await prisma.project.create({
      data: {
        userId: user.id,
        title: body.title.trim(),
        type: toProjectType(body.type),
        description: body.description?.trim(),
      },
    });

    if (body.payload && typeof body.payload === "object" && Object.keys(body.payload as Record<string, unknown>).length > 0) {
      await prisma.artifact.create({
        data: {
          projectId: created.id,
          type: "metadata",
          title: "Initial Payload",
          content: body.payload as Prisma.InputJsonValue,
          version: 1,
        },
      });
    }

    return NextResponse.json({ project: created }, { status: 201 });
  } catch (error) {
    return creatorErrorResponse(error, "Unable to create project");
  }
}
