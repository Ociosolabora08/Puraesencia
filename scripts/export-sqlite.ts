// FASE 1.3 — Exporta los datos de la SQLite local (dev.db) a prisma/seed-data.json
// Correr ANTES de cambiar el provider del schema: DATABASE_URL="file:./dev.db" npx tsx scripts/export-sqlite.ts
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";

const db = new PrismaClient();

async function main() {
  const [categories, items, restaurant] = await Promise.all([
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.menuItem.findMany({ orderBy: { createdAt: "asc" } }),
    db.restaurant.findFirst(),
  ]);

  const data = {
    exportedAt: new Date().toISOString(),
    restaurant: restaurant
      ? {
          name: restaurant.name,
          phone: restaurant.phone,
          whatsapp: restaurant.whatsapp,
          logo: restaurant.logo,
        }
      : null,
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      sortOrder: c.sortOrder,
      isHidden: c.isHidden,
    })),
    items: items.map((i) => ({
      id: i.id,
      categoryId: i.categoryId,
      name: i.name,
      price: i.price,
      description: i.description,
      images: JSON.parse(i.images || "[]"),
      isFeatured: i.isFeatured,
      isHidden: i.isHidden,
    })),
  };

  writeFileSync("prisma/seed-data.json", JSON.stringify(data, null, 2));

  // Precios sospechosos: moneda mezclada detectada en auditoría (valores tipo USD en campo COP)
  const suspicious = items.filter((i) => i.price < 1000).map((i) => `${i.name}: ${i.price}`);
  console.log(
    `Export OK → prisma/seed-data.json (${data.categories.length} categorías, ${data.items.length} productos)`
  );
  if (suspicious.length) {
    console.log("\n⚠️  PRECIOS SOSPECHOSOS (<1000, parecen USD en campo COP) — corregir vía admin:");
    suspicious.forEach((s) => console.log(`   - ${s}`));
  }
  await db.$disconnect();
}

main();
