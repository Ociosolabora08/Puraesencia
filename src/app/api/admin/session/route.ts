import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, isValidAdminSession } from "@/lib/auth";

// GET público: la UI de /admin pregunta aquí si hay sesión válida.
// No expone datos, solo { authenticated }.
export async function GET() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const authenticated = await isValidAdminSession(token);
  return NextResponse.json({ authenticated });
}
