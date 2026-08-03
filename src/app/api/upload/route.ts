import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import sharp from "sharp";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB (el resize alivia el peso despues)
const TARGET_WIDTH = 800; // ancho maximo para el catalogo
const WEBP_QUALITY = 80; // balance calidad/peso

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const purpose = (formData.get("purpose") as string) || "misc";

    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo no permitido. Usa JPEG, PNG o WebP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Archivo muy grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo: 5MB` },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const originalSize = file.size;
    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    // Convertir a WebP y redimensionar al ancho objetivo (mantiene proporcion).
    // Esto adapta cualquier foto del usuario al formato/calidad del catalogo.
    const webpBuffer = await sharp(inputBuffer)
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    await writeFile(path.join(uploadsDir, safeName), webpBuffer);

    const optimizedSize = webpBuffer.length;
    const reduction = originalSize > 0
      ? `${Math.max(0, Math.round((1 - optimizedSize / originalSize) * 100))}%`
      : "0%";

    const url = `/api/uploads/${safeName}`;
    return NextResponse.json({
      url,
      optimization: {
        originalSize: `${(originalSize / 1024).toFixed(0)}KB`,
        optimizedSize: `${(optimizedSize / 1024).toFixed(0)}KB`,
        reduction,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Error interno al subir imagen" }, { status: 500 });
  }
}
