// FASE 1.3 — Seed para PostgreSQL a partir del export de SQLite (prisma/seed-data.json).
// La contraseña admin NUNCA es "admin123": usa SEED_ADMIN_PASSWORD de .env.local
// o genera una aleatoria que se imprime UNA vez por consola.
import { db } from "../src/lib/db";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";

interface SeedData {
  restaurant: {
    name: string;
    phone: string;
    whatsapp: string;
    logo: string;
  } | null;
  categories: {
    id: string;
    name: string;
    image: string;
    sortOrder: number;
    isHidden: boolean;
  }[];
  items: {
    id: string;
    categoryId: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    isFeatured: boolean;
    isHidden: boolean;
  }[];
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

async function seed() {
  console.log("🌱 Seeding Pura Esencia (PostgreSQL)...");

  const seedPath = join(process.cwd(), "prisma", "seed-data.json");
  const data: SeedData = JSON.parse(readFileSync(seedPath, "utf-8"));

  // Contraseña admin: de env o aleatoria (impresa una sola vez)
  const password = process.env.SEED_ADMIN_PASSWORD || randomBytes(9).toString("base64url");
  const hashedPassword = await hash(password, 12);

  await db.menuItem.deleteMany();
  await db.category.deleteMany();
  await db.restaurant.deleteMany();

  const store = await db.restaurant.create({
    data: {
      name: data.restaurant?.name || "Pura Esencia",
      phone: data.restaurant?.phone || "+573023087321",
      whatsapp: data.restaurant?.whatsapp || "+573023087321",
      logo: data.restaurant?.logo || "",
      password: hashedPassword,
    },
  });
  console.log(`✅ Tienda: ${store.name} (whatsapp: ${store.whatsapp})`);

  // Preservar los IDs originales para que categoryId del export siga resolviendo
  for (const c of data.categories) {
    await db.category.create({
      data: {
        id: c.id,
        name: c.name,
        image: c.image,
        sortOrder: c.sortOrder,
        isHidden: c.isHidden,
      },
    });
  }
  console.log(`✅ ${data.categories.length} categorías`);

  // Slugs únicos: colisión → sufijo -2, -3...
  const usedSlugs = new Set<string>();
  for (const i of data.items) {
    let slug = slugify(i.name) || `producto-${i.id.slice(0, 6)}`;
    let n = 2;
    while (usedSlugs.has(slug)) slug = `${slugify(i.name)}-${n++}`;
    usedSlugs.add(slug);

    await db.menuItem.create({
      data: {
        id: i.id,
        name: i.name,
        slug,
        price: i.price,
        description: i.description,
        images: JSON.stringify(i.images),
        isFeatured: i.isFeatured,
        isHidden: i.isHidden,
        categoryId: i.categoryId,
      },
    });
  }
  console.log(`✅ ${data.items.length} productos (con slug único)`);

  console.log("\n🔐 CONTRASEÑA ADMIN (guardar AHORA, no se vuelve a mostrar):");
  console.log(`   >>> ${password} <<<\n`);

  await db.$disconnect();
}

seed().catch(async (e) => {
  console.error("Seed error:", e);
  await db.$disconnect();
  process.exit(1);
});
