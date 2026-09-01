import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, isValidAdminSession } from "@/lib/auth";

// Mutaciones de /api/* requieren sesión admin válida (JWT firmado).
// Los GET siguen públicos: el catálogo no necesita login.
// La página /admin es solo código de UI (sin datos); el gate real de datos
// está aquí y la UI consulta /api/admin/session para saber si hay sesión.
const PROTECTED_METHODS = ["POST", "PUT", "DELETE", "PATCH"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (!PROTECTED_METHODS.includes(method)) {
    return NextResponse.next();
  }

  // Login es público (gestiona su propio rate limit); session es GET.
  if (pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  // Verificación criptográfica del JWT — un base64 forjado ya no pasa.
  if (!(await isValidAdminSession(token))) {
    return NextResponse.json(
      { error: "No autorizado. Inicia sesión como administrador." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
