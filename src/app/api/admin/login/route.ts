import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { compare, hash } from "bcryptjs";

// Simple session token generator
function generateSessionToken(): string {
  const payload = `admin:${Date.now()}`;
  return Buffer.from(payload, "utf-8").toString("base64");
}

// Rate limiting: simple in-memory store
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
  try {
    // Rate limiting by IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const attempt = loginAttempts.get(ip);
    const now = Date.now();

    if (attempt && attempt.count >= MAX_ATTEMPTS) {
      const timeSinceLastAttempt = now - attempt.lastAttempt;
      if (timeSinceLastAttempt < LOCKOUT_MS) {
        const remainingMin = Math.ceil((LOCKOUT_MS - timeSinceLastAttempt) / 60000);
        return NextResponse.json(
          { error: `Demasiados intentos. Intenta de nuevo en ${remainingMin} minutos.` },
          { status: 429 }
        );
      } else {
        // Reset after lockout period
        loginAttempts.delete(ip);
      }
    }

    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Contraseña requerida." },
        { status: 400 }
      );
    }

    const restaurant = await db.restaurant.findFirst();
    if (!restaurant) {
      return NextResponse.json({ error: "No hay tienda configurada. Ejecuta el script de inicialización de la base de datos." }, { status: 404 });
    }

    // Compare with hashed password
    const isValid = await compare(password, restaurant.password);

    if (!isValid) {
      // Track failed attempt
      const current = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
      loginAttempts.set(ip, { count: current.count + 1, lastAttempt: now });

      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Reset attempts on successful login
    loginAttempts.delete(ip);

    // Generate session token
    const token = generateSessionToken();

    const { password: _, ...safe } = restaurant;
    const response = NextResponse.json({
      success: true,
      restaurant: safe,
    });

    // Set secure HTTP-only cookie
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 });
  }
}

// Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_session");
  return response;
}
