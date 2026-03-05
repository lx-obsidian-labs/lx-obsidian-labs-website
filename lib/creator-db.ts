import { prisma } from "@/lib/prisma";

export async function nextArtifactVersion(projectId: string) {
  const lastArtifact = await prisma.artifact.findFirst({
    where: { projectId },
    orderBy: { version: "desc" },
  });

  return (lastArtifact?.version || 0) + 1;
}

export async function requireOwnedProject(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== userId) return null;
  return project;
}
