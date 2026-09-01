// FASE 3.4 — Página pública por producto: /producto/[slug]
// ISR (revalidate 60) + generateMetadata (OG por producto) + JSON-LD Product.
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, MessageCircle, Leaf } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const revalidate = 60;

// Nota: Next.js sirve el not-found de rutas dinámicas con status 200 cuando la
// respuesta va pre-renderizada/streamed (issue conocido #76474). Por eso la
// variante "no encontrado" se marca noindex en generateMetadata.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getProduct(slug: string) {
  const [item, restaurant] = await Promise.all([
    db.menuItem.findFirst({
      where: { slug, isHidden: false },
      include: { category: { select: { id: true, name: true, image: true } } },
    }),
    db.restaurant.findFirst({ select: { whatsapp: true } }),
  ]);
  return { item, whatsapp: restaurant?.whatsapp || "573023087321" };
}

export async function generateStaticParams() {
  const items = await db.menuItem.findMany({
    where: { isHidden: false, slug: { not: null } },
    select: { slug: true },
  });
  return items
    .filter((i): i is { slug: string } => Boolean(i.slug))
    .map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { item } = await getProduct(slug);
  if (!item) {
    // Soft-404 de rutas dinámicas streamed en Next: noindex para SEO
    return {
      title: "Producto no encontrado",
      robots: { index: false, follow: false },
    };
  }

  let images: string[] = [];
  try {
    images = JSON.parse(item.images || "[]");
  } catch {
    images = [];
  }

  return {
    title: item.name,
    description:
      item.description.slice(0, 155) ||
      `${item.name} — cosmética natural artesanal hecha a mano en pequeños lotes.`,
    alternates: { canonical: `/producto/${slug}` },
    openGraph: {
      title: item.name,
      description: item.description.slice(0, 155),
      type: "website",
      locale: "es_ES",
      url: `${SITE_URL}/producto/${slug}`,
      images: images[0] ? [{ url: images[0], alt: item.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: item.name,
      description: item.description.slice(0, 155),
      images: images[0] ? [images[0]] : undefined,
    },
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { item, whatsapp } = await getProduct(slug);
  if (!item) notFound();

  let images: string[] = [];
  try {
    images = JSON.parse(item.images || "[]");
  } catch {
    images = [];
  }

  const message = encodeURIComponent(
    `¡Hola Pura Esencia! 💕 Me encantaría ordenar: ${item.name} (${formatPrice(item.price)}). ¿Lo tienes disponible?`
  );

  // JSON-LD Product (resultado enriquecido en Google)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.description,
    image: images[0] ? [images[0]] : undefined,
    category: item.category?.name,
    brand: { "@type": "Brand", name: "Pura Esencia" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/producto/${slug}`,
      priceCurrency: "COP",
      price: String(item.price),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-crema-texture">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="sticky top-0 z-50 bg-crema/95 backdrop-blur-sm border-b border-rosa-suave/60 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link
            href={`/#category-${item.categoryId}`}
            className="flex items-center gap-1 text-sm text-primary min-h-11"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al catálogo
          </Link>
          <span
            className="text-lg text-marron"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            Pura Esencia
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full pb-10">
        <div className="relative w-full aspect-square bg-rosa-suave/30 overflow-hidden">
          {images[0] ? (
            <Image
              src={images[0]}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, 560px"
              className="object-cover"
              priority
              placeholder={item.imageBlur ? "blur" : "empty"}
              blurDataURL={item.imageBlur}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-marron/60">
              <Leaf className="h-12 w-12 text-primary/50" aria-hidden="true" />
              <span
                className="text-xl"
                style={{ fontFamily: "var(--font-caveat), cursive" }}
              >
                Foto próximamente
              </span>
            </div>
          )}
        </div>

        <div className="px-5 pt-5 space-y-3">
          {item.category && (
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {item.category.name}
            </p>
          )}
          <h1
            className="text-3xl font-bold text-marron"
            style={{ fontFamily: "var(--font-dancing), cursive" }}
          >
            {item.name}
          </h1>
          <p
            className="text-2xl font-bold text-primary"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            {formatPrice(item.price)}
          </p>
          {item.description && (
            <p className="text-sm text-marron/80 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          )}

          <a
            href={`https://wa.me/${whatsapp}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full min-h-12 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-soft hover:shadow-soft-lg"
            style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Ordenar por WhatsApp
          </a>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Hecho a mano en pequeños lotes — puede variar ligeramente en color y forma.
          </p>
        </div>
      </main>
    </div>
  );
}
