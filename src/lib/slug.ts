// Slug URL-friendly para /producto/[slug]: quita acentos, minúsculas, guiones.
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

// Genera un slug único contra la DB: colisión → sufijo -2, -3...
import { db } from "@/lib/db";

export async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || `producto-${Date.now().toString(36)}`;
  let candidate = base;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await db.menuItem.findFirst({
      where: { slug: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${base}-${n++}`;
  }
}
