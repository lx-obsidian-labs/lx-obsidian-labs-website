type InMemoryEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

const memoryStore = new Map<string, InMemoryEntry>();

async function upstashCommand(command: string[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify([{ command }]),
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const json = (await res.json()) as Array<{ result?: unknown }>;
  return json?.[0]?.result ?? null;
}

async function withUpstash(key: string, limit: number, windowSec: number): Promise<RateLimitResult | null> {
  const incrementedRaw = await upstashCommand(["INCR", key]);
  if (incrementedRaw === null) return null;

  const incremented = Number(incrementedRaw);
  if (Number.isNaN(incremented)) return null;

  if (incremented === 1) {
    await upstashCommand(["EXPIRE", key, String(windowSec)]);
  }

  const ttlRaw = await upstashCommand(["TTL", key]);
  const ttl = Math.max(0, Number(ttlRaw));
  const resetAt = Date.now() + ttl * 1000;
  const remaining = Math.max(0, limit - incremented);

  return {
    success: incremented <= limit,
    remaining,
    resetAt,
  };
}

function withMemory(key: string, limit: number, windowSec: number): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const current = memoryStore.get(key);

  if (!current || now > current.resetAt) {
    const next = { count: 1, resetAt: now + windowMs };
    memoryStore.set(key, next);
    return {
      success: true,
      remaining: Math.max(0, limit - 1),
      resetAt: next.resetAt,
    };
  }

  current.count += 1;
  memoryStore.set(key, current);

  return {
    success: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
    resetAt: current.resetAt,
  };
}

export async function rateLimit({
  namespace,
  identifier,
  limit,
  windowSec,
}: {
  namespace: string;
  identifier: string;
  limit: number;
  windowSec: number;
}): Promise<RateLimitResult> {
  const key = `ratelimit:${namespace}:${identifier}`;
  const persistent = await withUpstash(key, limit, windowSec);
  if (persistent) return persistent;
  return withMemory(key, limit, windowSec);
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
