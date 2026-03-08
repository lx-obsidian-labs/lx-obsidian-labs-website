import { Prisma, type User } from "@prisma/client";
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { readSessionFromRequest } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/rate-limit";

export function requireCreatorDatabase() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Creator persistence is not configured. Set DATABASE_URL to enable this feature." },
      { status: 503 },
    );
  }

  return null;
}

export function creatorErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return NextResponse.json(
      { error: "Creator database connection failed. Check DATABASE_URL and database availability." },
      { status: 503 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
    return NextResponse.json(
      { error: "Creator database schema is not ready. Run Prisma migrations/db push." },
      { status: 503 },
    );
  }

  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}

export async function requireCreatorUser(request: Request): Promise<{ user: User; response: null } | { user: null; response: NextResponse }> {
  const enforceAuth = process.env.CREATOR_REQUIRE_AUTH === "true";
  const session = readSessionFromRequest(request);

  if (session) {
    const user = await prisma.user.findUnique({ where: { email: session.email } });
    if (user) {
      return { user, response: null };
    }

    if (enforceAuth) {
      return {
        user: null,
        response: NextResponse.json({ error: "Session expired. Please sign in again." }, { status: 401 }),
      };
    }
  }

  if (enforceAuth) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized. Please sign in at /auth." }, { status: 401 }),
    };
  }

  const ip = getClientIp(request);
  const ua = request.headers.get("user-agent") || "unknown";
  const fingerprint = createHash("sha256").update(`${ip}:${ua}`).digest("hex").slice(0, 16);
  const email = `guest-${fingerprint}@anon.lxobsidianlabs.local`;

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: "Creator Guest" },
    create: { email, name: "Creator Guest" },
  });

  return { user, response: null };
}
