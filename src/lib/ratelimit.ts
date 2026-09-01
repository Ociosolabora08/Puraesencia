// FASE 2 — Rate limiting del login.
// Producción: Upstash Redis (@upstash/ratelimit, sliding window 5 intentos / 15 min).
// Dev sin Upstash: fallback en memoria (válido solo en local, 1 instancia).
// Producción sin Upstash: FAIL-CLOSED — el login se rechaza hasta configurar Redis,
// porque un Map() en memoria NO protege nada en serverless.
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

let upstashLimiter: Ratelimit | null = null;
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function getUpstashLimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!upstashLimiter) {
    upstashLimiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(MAX_ATTEMPTS, "15 m"),
      prefix: "pe_login",
    });
  }
  return upstashLimiter;
}

export interface LimitResult {
  blocked: boolean;
  remainingMs: number; // 0 si no bloqueado
  mode: "upstash" | "memory" | "fail-closed";
}

export async function checkLoginRateLimit(req: NextRequest | Request): Promise<LimitResult> {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "local";

  const limiter = getUpstashLimiter();
  if (limiter) {
    const { success, reset } = await limiter.limit(ip);
    return { blocked: !success, remainingMs: reset - Date.now(), mode: "upstash" };
  }

  if (process.env.NODE_ENV === "production") {
    // Sin Redis en producción no hay protección real → no permitir login.
    console.error(
      "Login bloqueado: UPSTASH_REDIS_REST_URL/TOKEN no configurados en producción."
    );
    return { blocked: true, remainingMs: 0, mode: "fail-closed" };
  }

  // Fallback dev en memoria
  const now = Date.now();
  const entry = memoryStore.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= MAX_ATTEMPTS) {
      return { blocked: true, remainingMs: entry.resetAt - now, mode: "memory" };
    }
    entry.count++;
  } else {
    memoryStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }
  return { blocked: false, remainingMs: 0, mode: "memory" };
}

export function resetLoginLimit(): void {
  // Con Upstash el sliding window se consume solo; con memoria limpiamos todo (dev).
  memoryStore.clear();
}
