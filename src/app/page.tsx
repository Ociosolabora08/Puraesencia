// FASE 3.2 — Home como Server Component: datos directos de Prisma, ISR 60s.
// El HTML inicial contiene el catálogo completo (SEO + LCP sin cascada cliente-API-DB).
import { Heart, Sparkles } from "lucide-react";
import { StickyHeader } from "@/components/menu/sticky-header";
import { CatalogShell } from "@/components/menu/catalog-shell";
import { BrandLogo, DecorativeHeart, DecorativeStar, DecorativeDrop, WatercolorBackground } from "@/components/brand/decorative";
import { db } from "@/lib/db";
import { SOCIAL_LINKS, type CatalogCategory, type CatalogItem } from "@/lib/types";

export const revalidate = 60; // ISR: re-render cada 60s o tras revalidación

async function getCatalogData() {
  const [categories, items, restaurant] = await Promise.all([
    db.category.findMany({
      where: { isHidden: false },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, image: true, sortOrder: true },
    }),
    db.menuItem.findMany({
      where: { isHidden: false },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        description: true,
        images: true,
        imageBlur: true,
        isFeatured: true,
        categoryId: true,
      },
    }),
    db.restaurant.findFirst({
      select: { name: true, whatsapp: true, phone: true, logo: true },
    }),
  ]);

  const parsedItems: CatalogItem[] = items.map((item) => {
    let images: string[] = [];
    try {
      images = JSON.parse(item.images || "[]");
    } catch {
      images = [];
    }
    return { ...item, images };
  });

  return {
    categories: categories as CatalogCategory[],
    items: parsedItems,
    restaurant,
  };
}

// JSON-LD: Organization + WebSite (datos estructurados para buscadores)
function OrganizationJsonLd({ name, whatsapp }: { name: string; whatsapp: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    description:
      "Cosmética natural artesanal: jabones, velas, cremas y aceites en pequeños lotes hechos a mano.",
    contactPoint: whatsapp
      ? [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: `+${whatsapp.replace(/^(\d{2})/, "$1")}`,
            availableLanguage: "Spanish",
          },
        ]
      : undefined,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function MenuPage() {
  const { categories, items, restaurant } = await getCatalogData();

  return (
    <div className="min-h-screen flex flex-col bg-crema-texture">
      <OrganizationJsonLd name={restaurant?.name || "Pura Esencia"} whatsapp={restaurant?.whatsapp || ""} />

      <StickyHeader restaurantInfo={restaurant} />

      <main className="flex-1 max-w-xl mx-auto w-full">
        {/* Hero Section - Pura Esencia brand intro */}
        <section className="relative px-4 py-8 text-center overflow-hidden">
          <WatercolorBackground />
          <div className="relative z-10 space-y-3">
            <BrandLogo size="xl" className="mb-2" />
            <p
              className="text-xl text-marron font-script"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              Cosmética natural, hecha a mano con cariño
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Pequeños lotes con ingredientes honestos, para cuidarte sin sacrificar
              la belleza, ni el planeta, ni tu bolsillo.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <DecorativeHeart size={12} color="#FF5A8F" />
              <DecorativeStar size={10} color="#9B59B6" />
              <DecorativeDrop size={12} />
              <DecorativeStar size={10} color="#FFD93D" />
              <DecorativeHeart size={12} color="#FF3B30" />
            </div>
          </div>
        </section>

        {/* Catálogo interactivo (isla cliente) */}
        <CatalogShell
          categories={categories}
          items={items}
          whatsapp={restaurant?.whatsapp}
          storeName={restaurant?.name || "Pura Esencia"}
        />

        {/* Brand Story Section */}
        <section className="px-6 py-10 text-center space-y-4 bg-rosa-suave/30">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-amarillo" aria-hidden="true" />
            <h3
              className="text-2xl font-bold text-primary"
              style={{ fontFamily: "var(--font-dancing), cursive" }}
            >
              Nuestra Esencia
            </h3>
            <Sparkles className="h-4 w-4 text-amarillo" aria-hidden="true" />
          </div>
          <p
            className="text-base text-marron font-serif-italic leading-relaxed max-w-md mx-auto"
            style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}
          >
            &ldquo;No fabricamos productos en serie. Creamos pequeños lotes que cargan
            con la energía, la intención y el cuidado de quien los hizo.&rdquo;
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Cada producto es único — puede variar ligeramente en color y forma porque
            es hecho a mano, con ingredientes que conocemos por nombre.
          </p>
          <div className="flex items-center justify-center gap-1.5 pt-2 text-sm text-primary">
            <Heart className="h-3 w-3 fill-current" aria-hidden="true" />
            <span
              className="font-script"
              style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.1rem" }}
            >
              Gracias por estar, de verdad
            </span>
            <Heart className="h-3 w-3 fill-current" aria-hidden="true" />
          </div>
        </section>
      </main>

      {/* Footer con redes sociales */}
      <footer className="mt-auto py-8 px-4 text-center bg-crema-calido">
        <BrandLogo size="md" className="mb-3" />
        <p
          className="text-sm text-muted-foreground font-script mb-3"
          style={{ fontFamily: "var(--font-caveat), cursive" }}
        >
          La esencia no se fabrica, se cuida.
        </p>
        <div className="flex items-center justify-center gap-4 mb-3">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Pura Esencia"
            className="text-sm text-primary hover:underline min-h-11 flex items-center"
          >
            Instagram
          </a>
          <a
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok de Pura Esencia"
            className="text-sm text-primary hover:underline min-h-11 flex items-center"
          >
            TikTok
          </a>
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp de Pura Esencia"
            className="text-sm text-primary hover:underline min-h-11 flex items-center"
          >
            WhatsApp
          </a>
        </div>
        <p className="text-xs text-muted-foreground/80">
          © {new Date().getFullYear()} Pura Esencia · Cosmética natural artesanal
        </p>
      </footer>
    </div>
  );
}
