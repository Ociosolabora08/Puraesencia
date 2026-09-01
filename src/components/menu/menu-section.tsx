"use client";

import { MenuCard } from "./menu-card";
import { NextCategoryButton } from "./next-category-button";
import { DecorativeHeart } from "@/components/brand/decorative";
import type { CatalogCategory, CatalogItem } from "@/lib/types";

interface MenuSectionProps {
  category: CatalogCategory;
  items: CatalogItem[];
  onNextCategory: (categoryId: string) => void;
  categories: CatalogCategory[];
}

export function MenuSection({
  category,
  items,
  onNextCategory,
  categories,
}: MenuSectionProps) {
  if (items.length === 0) return null;

  return (
    <section id={`category-${category.id}`} className="mb-10 scroll-mt-20">
      <div className="flex items-center gap-2 mb-4 px-1">
        <DecorativeHeart size={14} color="#FF5A8F" />
        <h2
          className="text-3xl font-bold text-primary"
          style={{ fontFamily: "var(--font-dancing), cursive" }}
        >
          {category.name}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-5">
        {items.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            categoryImage={category.image}
            categoryName={category.name}
          />
        ))}
      </div>
      <NextCategoryButton
        currentCategoryId={category.id}
        onNextCategory={onNextCategory}
        categories={categories}
      />
    </section>
  );
}
