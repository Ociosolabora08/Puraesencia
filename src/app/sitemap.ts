// FASE 3.6 — Sitemap dinámico: home + todos los productos con slug.
import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

  const items = await db.menuItem.findMany({
    where: { isHidden: false, slug: { not: null } },
    select: { slug: true, updatedAt: true },
  });

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...items
      .filter((i): i is { slug: string; updatedAt: Date } => Boolean(i.slug))
      .map((i) => ({
        url: `${base}/producto/${i.slug}`,
        lastModified: i.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
  ];
}
