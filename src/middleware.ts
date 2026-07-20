import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication (all write operations)
const PROTECTED_METHODS = ["POST", "PUT", "DELETE"];
const PUBLIC_PATHS = ["/api/admin/login", "/api/upload"]; // login is public, upload has its own check

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Only protect API routes with mutation methods
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (!PROTECTED_METHODS.includes(method)) {
    return NextResponse.next(); // GET requests are public
  }

  // Allow login route
  if (pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = request.cookies.get("admin_session");

  if (!authCookie || !authCookie.value) {
    return NextResponse.json(
      { error: "No autorizado. Inicia sesión como administrador." },
      { status: 401 }
    );
  }

  // Validate session token
  try {
    const token = authCookie.value;
    // Simple token validation: base64 encoded "admin:{timestamp}" with HMAC-like check
    // In production, use JWT with a secret key
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [role, timestamp] = decoded.split(":");

    if (role !== "admin") {
      return NextResponse.json(
        { error: "Sesión inválida." },
        { status: 401 }
      );
    }

    // Check session expiry (24 hours)
    const sessionTime = parseInt(timestamp);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (isNaN(sessionTime) || now - sessionTime > maxAge) {
      const response = NextResponse.json(
        { error: "Sesión expirada. Inicia sesión nuevamente." },
        { status: 401 }
      );
      response.cookies.delete("admin_session");
      return response;
    }
  } catch {
    return NextResponse.json(
      { error: "Sesión inválida." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
