import { createHmac } from "node:crypto";
const entries = new Map<string, { count: number; resetTime: number }>();
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}
interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfter: number;
}
const SCRIPT =
  "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]) end; return {n,redis.call('PTTL',KEYS[1])}";
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 3600000 },
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url || token) {
    if (!url || !token) throw new Error("Incomplete rate limit configuration");
    const key =
      "contact:" + createHmac("sha256", token).update(identifier).digest("hex");
    const res = await fetch(url.replace(/\/$/, ""), {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["EVAL", SCRIPT, "1", key, String(config.windowMs)]),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Rate limit unavailable");
    const payload = (await res.json()) as {
      result?: [number, number];
      error?: string;
    };
    if (
      payload.error ||
      !Array.isArray(payload.result) ||
      payload.result.length !== 2 ||
      !payload.result.every(Number.isFinite)
    )
      throw new Error("Invalid rate limit response");
    const [count, ttl] = payload.result;
    return {
      success: count <= config.maxRequests,
      remaining: Math.max(0, config.maxRequests - count),
      retryAfter: Math.max(1, Math.ceil(ttl / 1000)),
    };
  }
  const now = Date.now();
  if (entries.size >= 1000)
    for (const [key, value] of entries)
      if (value.resetTime <= now) entries.delete(key);
  let record = entries.get(identifier);
  if (!record || record.resetTime <= now) {
    if (entries.size >= 10000)
      return { success: false, remaining: 0, retryAfter: 60 };
    record = { count: 0, resetTime: now + config.windowMs };
    entries.set(identifier, record);
  }
  record.count++;
  return {
    success: record.count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - record.count),
    retryAfter: Math.max(1, Math.ceil((record.resetTime - now) / 1000)),
  };
}
