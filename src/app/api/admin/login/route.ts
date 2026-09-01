import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { compare } from "bcryptjs";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_S,
  createAdminSessionToken,
} from "@/lib/auth";
import { checkLoginRateLimit } from "@/lib/ratelimit";

export async function POST(request: Request) {
  try {
    // Rate limiting (Upstash en producción, fail-closed si falta)
    const limit = await checkLoginRateLimit(request);
    if (limit.blocked) {
      if (limit.mode === "fail-closed") {
        return NextResponse.json(
          {
            error:
              "Servidor sin rate limiting configurado (UPSTASH_REDIS_REST_URL/TOKEN). Login deshabilitado por seguridad.",
          },
          { status: 503 }
        );
      }
      const remainingMin = Math.max(1, Math.ceil(limit.remainingMs / 60000));
      return NextResponse.json(
        { error: `Demasiados intentos. Intenta de nuevo en ${remainingMin} minutos.` },
        { status: 429 }
      );
    }

    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Contraseña requerida." }, { status: 400 });
    }

    const restaurant = await db.restaurant.findFirst();
    if (!restaurant) {
      return NextResponse.json(
        { error: "No hay tienda configurada. Ejecuta el seed de la base de datos." },
        { status: 404 }
      );
    }

    // bcrypt: el seed guarda hash de 12 rounds (SEED_ADMIN_PASSWORD o aleatoria)
    const isValid = await compare(password, restaurant.password);

    if (!isValid) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    // JWT firmado HS256 — ya no es base64 falsificable
    const token = await createAdminSessionToken();

    const { password: _, ...safe } = restaurant;
    const response = NextResponse.json({ success: true, restaurant: safe });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_S,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
