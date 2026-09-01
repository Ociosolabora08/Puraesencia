// FASE 2 — Sesión admin con JWT firmado (HS256, jose).
// El token anterior (base64 sin firma) era falsificable por cualquiera.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE_S = 7 * 24 * 60 * 60; // 7 días (plan Fase 2.1)

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET no configurada o demasiado corta (mínimo 16 chars).");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_S}s`)
    .sign(getSecretKey());
}

// Verificación tolerante a fallos: retorna boolean, nunca lanza.
export async function isValidAdminSession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}
