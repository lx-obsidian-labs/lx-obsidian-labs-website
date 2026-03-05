import { prisma } from "@/lib/prisma";

export const DEMO_USER_EMAIL = "demo@lxobsidianlabs.local";

export async function ensureDemoUser() {
  return prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: {
      email: DEMO_USER_EMAIL,
      name: "Obsidian Creator Demo",
    },
  });
}

export async function nextArtifactVersion(projectId: string) {
  const lastArtifact = await prisma.artifact.findFirst({
    where: { projectId },
    orderBy: { version: "desc" },
  });

  return (lastArtifact?.version || 0) + 1;
}
