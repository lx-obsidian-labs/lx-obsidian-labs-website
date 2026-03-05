import { NextResponse } from "next/server";
import { creatorErrorResponse, requireCreatorDatabase, requireCreatorUser } from "@/lib/creator-api";
import { requireOwnedProject } from "@/lib/creator-db";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

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

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        artifacts: { orderBy: { createdAt: "desc" }, take: 20 },
        messages: { orderBy: { createdAt: "asc" }, take: 50 },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    return creatorErrorResponse(error, "Unable to fetch project");
  }
}

export async function PATCH(request: Request, { params }: Params) {
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

    const body = (await request.json()) as { title?: string; description?: string; status?: string };

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(body.title ? { title: body.title.trim() } : {}),
        ...(body.description !== undefined ? { description: body.description?.trim() || null } : {}),
        ...(body.status ? { status: body.status } : {}),
      },
    });

    return NextResponse.json({ project: updated });
  } catch (error) {
    return creatorErrorResponse(error, "Unable to update project");
  }
}
