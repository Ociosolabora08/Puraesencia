// FASE 1 — Migración única de imágenes locales (public/uploads/*) a Vercel Blob.
// Requiere BLOB_READ_WRITE_TOKEN en .env.local (funciona también desde local).
// Uso: set -a; . ./.env.local; set +a; npx tsx scripts/migrate-images-to-blob.ts
import { db } from "../src/lib/db";
import { put } from "@vercel/blob";
import { readFile, stat } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

const BLUR_WIDTH = 16;

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("Falta BLOB_READ_WRITE_TOKEN. Créalo en Vercel → Storage → Blob.");
    process.exit(1);
  }

  const items = await db.menuItem.findMany();
  let migrated = 0;
  let alreadyDone = 0;

  for (const item of items) {
    let images: string[] = [];
    try {
      images = JSON.parse(item.images || "[]");
    } catch {
      images = [];
    }

    const needsMigration = images.some((u) => u.startsWith("/api/uploads/") || u.startsWith("/uploads/"));
    const isBlob = images.length > 0 && images.every((u) => u.startsWith("http"));
    if (!needsMigration) {
      if (isBlob) alreadyDone++;
      continue;
    }

    const newUrls: string[] = [];
    let firstBlur = item.imageBlur;

    for (const url of images) {
      if (!url.startsWith("/api/uploads/") && !url.startsWith("/uploads/")) {
        newUrls.push(url);
        continue;
      }
      const fileName = url.split("/").pop()!;
      const localPath = join(process.cwd(), "public", "uploads", fileName);
      try {
        await stat(localPath);
      } catch {
        console.warn(`  ⚠️ archivo local no encontrado, se descarta: ${fileName} (${item.name})`);
        continue;
      }
      const raw = await readFile(localPath);
      const optimized = await sharp(raw)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      const blob = await put(`products/${Date.now()}-${fileName.replace(/\.[^.]+$/, "")}.webp`, optimized, {
        access: "public",
        contentType: "image/webp",
      });
      newUrls.push(blob.url);

      if (firstBlur === "" || !firstBlur) {
        const blur = await sharp(raw)
          .resize({ width: BLUR_WIDTH, withoutEnlargement: true })
          .webp({ quality: 30 })
          .toBuffer();
        firstBlur = `data:image/webp;base64,${blur.toString("base64")}`;
      }
      migrated++;
    }

    await db.menuItem.update({
      where: { id: item.id },
      data: { images: JSON.stringify(newUrls), imageBlur: firstBlur || "" },
    });
    console.log(`✅ ${item.name}: ${newUrls.length} imagen(es) → blob`);
  }

  console.log(`\nListo. Subidas: ${migrated}. Ya en blob: ${alreadyDone}.`);
  await db.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
