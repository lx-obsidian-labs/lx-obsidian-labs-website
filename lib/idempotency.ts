type Entry = {
  expiresAt: number;
};

const memoryStore = new Map<string, Entry>();

async function upstashSetNx(key: string, ttlSec: number) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify([
      { command: ["SET", key, "1", "EX", String(ttlSec), "NX"] },
    ]),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const json = (await res.json()) as Array<{ result?: unknown }>;
  const result = json?.[0]?.result;
  return result === "OK";
}

function memorySetNx(key: string, ttlSec: number) {
  const now = Date.now();
  const existing = memoryStore.get(key);
  if (existing && existing.expiresAt > now) {
    return false;
  }
  memoryStore.set(key, { expiresAt: now + ttlSec * 1000 });
  return true;
}

export async function claimIdempotencyKey({
  namespace,
  key,
  identifier,
  ttlSec = 300,
}: {
  namespace: string;
  key?: string | null;
  identifier: string;
  ttlSec?: number;
}) {
  const normalized = key?.trim();
  if (!normalized) return { accepted: true, active: false };

  const redisKey = `idem:${namespace}:${identifier}:${normalized}`;
  const persistent = await upstashSetNx(redisKey, ttlSec);
  if (persistent !== null) {
    return { accepted: persistent, active: true };
  }

  return { accepted: memorySetNx(redisKey, ttlSec), active: false };
}
