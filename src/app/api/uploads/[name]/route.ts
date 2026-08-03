import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

// Servimos las imagenes subidas en runtime (no desde public/ congelado en build).
// Esto permite que las fotos aparezcan de inmediato y funciona en produccion
// donde el filesystem de 'public' es efimero.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  // Evitar path traversal
  const safeName = path.basename(name);
  const filePath = path.join(process.cwd(), "public", "uploads", safeName);

  try {
    const info = await stat(filePath);
    if (!info.isFile()) {
      return new NextResponse("Not found", { status: 404 });
    }
    const data = await readFile(filePath);
    const ext = path.extname(safeName).toLowerCase();
    const contentType =
      ext === ".webp" ? "image/webp" : ext === ".png" ? "image/png" : "image/jpeg";
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
