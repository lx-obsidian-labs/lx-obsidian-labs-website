import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { creatorErrorResponse, requireCreatorDatabase, requireCreatorUser } from "@/lib/creator-api";
import { requireOwnedProject } from "@/lib/creator-db";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

function toArtifactType(value: string | undefined) {
  if (value === "plan" || value === "document" || value === "image" || value === "checkpoint" || value === "metadata") {
    return value;
  }
  return "metadata";
}

export async function GET(_: Request, { params }: Params) {
  const unavailable = requireCreatorDatabase();
  if (unavailable) return unavailable;

  try {
    const auth = await requireCreatorUser(_);
    if (auth.response) return auth.response;

    const { id } = await params;
    const owned = await requireOwnedProject(id, auth.user.id);
    if (!owned) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const artifacts = await prisma.artifact.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ artifacts });
  } catch (error) {
    return creatorErrorResponse(error, "Unable to fetch artifacts");
  }
}

export async function POST(request: Request, { params }: Params) {
  const unavailable = requireCreatorDatabase();
  if (unavailable) return unavailable;

  try {
    const auth = await requireCreatorUser(request);
    if (auth.response) return auth.response;

    const { id } = await params;
    const owned = await requireOwnedProject(id, auth.user.id);
    if (!owned) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      type?: string;
      title?: string;
      content?: unknown;
    };

    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Artifact title and content are required" }, { status: 400 });
    }

    const lastArtifact = await prisma.artifact.findFirst({
      where: { projectId: id },
      orderBy: { version: "desc" },
    });

    const artifact = await prisma.artifact.create({
      data: {
        projectId: id,
        type: toArtifactType(body.type),
        title: body.title,
        content: body.content as Prisma.InputJsonValue,
        version: (lastArtifact?.version || 0) + 1,
      },
    });

    return NextResponse.json({ artifact }, { status: 201 });
  } catch (error) {
    return creatorErrorResponse(error, "Unable to create artifact");
  }
}
