"use client";

// Isla cliente del catálogo: scroll-spy de categorías, destacados y secciones.
// Los DATOS vienen como props del Server Component (page.tsx) — no hay fetch en cliente.
import { useState, useCallback, useEffect, useRef } from "react";
import { CategoryNav } from "./category-nav";
import { FeaturedItems } from "./featured-items";
import { MenuSection } from "./menu-section";
import { BackToTop } from "./back-to-top";
import { WhatsAppOrderButton } from "./whatsapp-order-button";
import type { CatalogCategory, CatalogItem } from "@/lib/types";

interface CatalogShellProps {
  categories: CatalogCategory[];
  items: CatalogItem[];
  whatsapp?: string;
  storeName: string;
}

export function CatalogShell({ categories, items, whatsapp, storeName }: CatalogShellProps) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id ?? "");
  const isProgrammaticScroll = useRef(false);
  const programmaticTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Si el scroll lo provocó un clic en una categoría, ignoramos este ciclo
      // para no auto-alimentar el cambio de categoría activa (evita rebote/bucle).
      if (isProgrammaticScroll.current) return;
      for (let i = categories.length - 1; i >= 0; i--) {
        const el = document.getElementById(`category-${categories[i].id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveCategory(categories[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const scrollToCategory = useCallback((categoryId: string) => {
    const el = document.getElementById(`category-${categoryId}`);
    if (el) {
      // Marcamos el scroll como programático para que el listener no reaccione
      // durante este desplazamiento y no se genere el bucle de rebote.
      isProgrammaticScroll.current = true;
      if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
      programmaticTimer.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 600);
      el.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId);
      scrollToCategory(categoryId);
    },
    [scrollToCategory]
  );

  const handleNextCategory = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId);
      scrollToCategory(categoryId);
    },
    [scrollToCategory]
  );

  const featured = items.filter((item) => item.isFeatured);

  return (
    <>
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />

      <FeaturedItems items={featured} />

      <div className="p-4">
        {categories.map((cat) => {
          const catItems = items.filter((item) => item.categoryId === cat.id);
          return (
            <MenuSection
              key={cat.id}
              category={cat}
              items={catItems}
              onNextCategory={handleNextCategory}
              categories={categories}
            />
          );
        })}
      </div>

      {whatsapp && (
        <WhatsAppOrderButton whatsapp={whatsapp} restaurantName={storeName} />
      )}
      <BackToTop />
    </>
  );
}
