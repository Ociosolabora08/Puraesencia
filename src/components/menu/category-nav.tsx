"use client";

import { useRef, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Leaf } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image: string;
  sortOrder: number;
}

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

export function CategoryNav({ categories, activeCategory, onCategoryClick }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeEl = document.getElementById(`cat-nav-${activeCategory}`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeCategory]);

  return (
    <div className="border-b border-rosa-suave/60 bg-crema/50">
      <ScrollArea className="w-full">
        <div className="flex gap-4 px-4 py-4" ref={scrollRef}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-nav-${cat.id}`}
                onClick={() => onCategoryClick(cat.id)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0"
              >
                <div
                  className={`w-16 h-16 rounded-full border-2 p-[2px] hover:scale-105 transition-all ${
                    isActive
                      ? "border-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                      : "border-rosa-suave"
                  }`}
                >
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-rosa-suave/40 flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs max-w-[68px] text-center leading-tight ${
                    isActive
                      ? "font-semibold text-primary"
                      : "text-marron/70"
                  }`}
                  style={isActive ? { fontFamily: "var(--font-caveat), cursive", fontSize: "0.95rem" } : {}}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
