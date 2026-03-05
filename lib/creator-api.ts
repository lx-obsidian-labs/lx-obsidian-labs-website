import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

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
