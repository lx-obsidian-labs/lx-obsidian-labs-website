import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "lx_creator_session";

type SessionPayload = {
  email: string;
  name?: string;
  iat: number;
};

function base64UrlEncode(input: string) {
  return Buffer.from(input, "utf8").toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function getAuthSecret() {
  return process.env.AUTH_SECRET || "lx-obsidian-dev-auth-secret";
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

function parseCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";");
  for (const item of cookies) {
    const [rawKey, ...rawValue] = item.trim().split("=");
    if (rawKey === name) {
      return decodeURIComponent(rawValue.join("="));
    }
  }

  return null;
}

export function createSessionToken(payload: Omit<SessionPayload, "iat">) {
  const body = base64UrlEncode(JSON.stringify({ ...payload, iat: Date.now() }));
  const signature = sign(body);
  return `${body}.${signature}`;
}

export function readSessionFromRequest(request: Request) {
  const token = parseCookie(request.headers.get("cookie"), SESSION_COOKIE);
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(base64UrlDecode(body)) as SessionPayload;
    if (!parsed.email || typeof parsed.email !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}
