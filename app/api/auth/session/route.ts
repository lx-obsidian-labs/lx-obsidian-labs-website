import { NextResponse } from "next/server";
import { createSessionToken, getSessionCookieName, hasAuthSecret, readSessionFromRequest } from "@/lib/auth-session";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { createRequestContext, logError, logInfo, withRequestId } from "@/lib/server-observability";
import { authSignInSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

type AuthBody = {
  email?: string;
  name?: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET(request: Request) {
  const ctx = createRequestContext(request, "/api/auth/session:get");
  if (!hasAuthSecret()) {
    return withRequestId(NextResponse.json({ authenticated: false, error: "Auth is not configured." }, { status: 503 }), ctx);
  }

  const session = readSessionFromRequest(request);
  if (!session) {
    return withRequestId(NextResponse.json({ authenticated: false }), ctx);
  }

  const user = await prisma.user.findUnique({ where: { email: session.email } });
  if (!user) {
    return withRequestId(NextResponse.json({ authenticated: false }), ctx);
  }

  return withRequestId(NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  }), ctx);
}

export async function POST(request: Request) {
  const ctx = createRequestContext(request, "/api/auth/session:post");
  try {
    if (!hasAuthSecret()) {
      return withRequestId(NextResponse.json({ error: "AUTH_SECRET is missing. Configure authentication first." }, { status: 503 }), ctx);
    }

    const ip = getClientIp(request);
    const limiter = await rateLimit({
      namespace: "auth_session",
      identifier: ip,
      limit: 8,
      windowSec: 900,
    });

    if (!limiter.success) {
      return withRequestId(NextResponse.json({ error: "Too many sign-in attempts. Please try later." }, { status: 429 }), ctx);
    }

    const body = (await request.json()) as AuthBody;
    const parsed = authSignInSchema.safeParse({ email: body.email || "", name: body.name || "" });
    if (!parsed.success) {
      return withRequestId(NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 }), ctx);
    }

    const email = normalizeEmail(parsed.data.email);
    const name = parsed.data.name?.trim() || null;

    if (!validEmail(email)) {
      return withRequestId(NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 }), ctx);
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: { name: name || undefined },
      create: { email, name },
    });

    const token = createSessionToken({ email: user.email, name: user.name || undefined });
    const response = NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    response.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });

    logInfo(ctx, "auth_signin_success", { email });
    return withRequestId(response, ctx);
  } catch (error) {
    logError(ctx, "auth_signin_error", error);
    return withRequestId(NextResponse.json({ error: "Unable to sign in." }, { status: 500 }), ctx);
  }
}

export async function DELETE(request: Request) {
  const ctx = createRequestContext(request, "/api/auth/session:delete");
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return withRequestId(response, ctx);
}
