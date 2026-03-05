import { NextResponse } from "next/server";
import { createSessionToken, getSessionCookieName, readSessionFromRequest } from "@/lib/auth-session";
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
  const session = readSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  const user = await prisma.user.findUnique({ where: { email: session.email } });
  if (!user) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AuthBody;
    const email = normalizeEmail(body.email || "");
    const name = body.name?.trim() || null;

    if (!validEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
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

    return response;
  } catch {
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
