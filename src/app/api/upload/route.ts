import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB (el resize alivia el peso después)
const TARGET_WIDTH = 800; // ancho máximo para el catálogo
const WEBP_QUALITY = 80; // balance calidad/peso
const BLUR_WIDTH = 16; // miniatura para placeholder blur-up

export async function POST(req: NextRequest) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error:
            "BLOB_READ_WRITE_TOKEN no configurado. Créalo en Vercel → Storage → Blob y añádelo a las variables de entorno.",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

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
        {
          error: `Archivo muy grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo: 5MB`,
        },
        { status: 400 }
      );
    }

    const originalSize = file.size;
    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    // Optimizar: WebP 800px + miniatura 16px para blurDataURL
    const webpBuffer = await sharp(inputBuffer)
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const blurBuffer = await sharp(inputBuffer)
      .resize({ width: BLUR_WIDTH, withoutEnlargement: true })
      .webp({ quality: 30 })
      .toBuffer();
    const blurDataURL = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    const blob = await put(`products/${safeName}`, webpBuffer, {
      access: "public",
      contentType: "image/webp",
    });

    const optimizedSize = webpBuffer.length;
    const reduction =
      originalSize > 0
        ? `${Math.max(0, Math.round((1 - optimizedSize / originalSize) * 100))}%`
        : "0%";

    return NextResponse.json({
      url: blob.url,
      blurDataURL,
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
