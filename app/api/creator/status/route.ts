import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    persistenceEnabled: Boolean(process.env.DATABASE_URL),
    authRequired: process.env.CREATOR_REQUIRE_AUTH === "true",
  });
}
