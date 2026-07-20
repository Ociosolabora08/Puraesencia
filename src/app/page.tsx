"use client";

import { useState, useCallback, useEffect } from "react";
import { Settings, Heart, Sparkles } from "lucide-react";
import { StickyHeader } from "@/components/menu/sticky-header";
import { CategoryNav } from "@/components/menu/category-nav";
import { FeaturedItems } from "@/components/menu/featured-items";
import { MenuSection } from "@/components/menu/menu-section";
import { BackToTop } from "@/components/menu/back-to-top";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
  BrandLogo,
  DecorativeHeart,
  DecorativeStar,
  DecorativeDrop,
  WatercolorBackground,
} from "@/components/brand/decorative";

interface Category {
  id: string;
  name: string;
  image: string;
  sortOrder: number;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  likes: number;
  isFeatured: boolean;
  categoryId: string;
}

interface StoreInfo {
  name: string;
  phone: string;
  whatsapp: string;
  logo: string;
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();

      setCategories(data.categories);
      setMenuItems(data.items);
      setStoreInfo(data.restaurant);
      if (data.categories.length > 0 && !activeCategory) {
        setActiveCategory(data.categories[0].id);
      }
    } catch {
      // Error handled by loading state
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleScroll = () => {
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

  const handleCategoryClick = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    const el = document.getElementById(`category-${categoryId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleFeaturedClick = useCallback(
    (categoryId: string, itemId: string) => {
      setActiveCategory(categoryId);
      const el = document.getElementById(`menu-item-${itemId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    []
  );

  const handleNextCategory = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    const el = document.getElementById(`category-${categoryId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleAdminDataChange = useCallback(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crema-texture">
        <div className="text-center space-y-4">
          <BrandLogo size="lg" />
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p
            className="text-base text-muted-foreground font-script"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            Cargando nuestras esencias...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-crema-texture">
      {/* Admin toggle button */}
      <button
        onClick={() => setIsAdminOpen(true)}
        className="fixed top-1/2 -translate-y-1/2 right-0 z-40 btn-rosa p-2 rounded-l-lg shadow-soft-lg hover:shadow-lg transition-all"
        aria-label="Abrir administración"
      >
        <Settings className="h-4 w-4" />
      </button>

      <StickyHeader restaurantInfo={storeInfo} />

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

        {/* Category Navigation (Instagram Stories style) */}
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />

        {/* Featured Items */}
        <FeaturedItems
          items={menuItems.filter((item) => item.isFeatured)}
          onItemClick={handleFeaturedClick}
        />

        {/* Menu Sections */}
        <div className="p-4">
          {categories.map((cat) => {
            const catItems = menuItems.filter(
              (item) => item.categoryId === cat.id
            );
            return (
              <MenuSection
                key={cat.id}
                category={cat}
                items={catItems}
                onNextCategory={handleNextCategory}
                categories={categories}
                whatsapp={storeInfo?.whatsapp}
              />
            );
          })}
        </div>

        {/* Brand Story Section */}
        <section className="px-6 py-10 text-center space-y-4 bg-rosa-suave/30">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-amarillo" />
            <h3
              className="text-2xl font-bold text-primary"
              style={{ fontFamily: "var(--font-dancing), cursive" }}
            >
              Nuestra Esencia
            </h3>
            <Sparkles className="h-4 w-4 text-amarillo" />
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
            <Heart className="h-3 w-3 fill-current" />
            <span className="font-script" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.1rem" }}>
              Gracias por estar, de verdad
            </span>
            <Heart className="h-3 w-3 fill-current" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 text-center bg-crema-calido">
        <BrandLogo size="md" className="mb-3" />
        <p
          className="text-sm text-muted-foreground font-script mb-2"
          style={{ fontFamily: "var(--font-caveat), cursive" }}
        >
          La esencia no se fabrica, se cuida.
        </p>
        <p className="text-xs text-muted-foreground/80">
          © {new Date().getFullYear()} Pura Esencia · Cosmética natural artesanal
        </p>
      </footer>

      {/* Back to Top */}
      <BackToTop />

      {/* Admin Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChange={handleAdminDataChange}
      />
    </div>
  );
}
