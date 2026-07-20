"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  image: string;
  sortOrder: number;
}

interface NextCategoryButtonProps {
  currentCategoryId: string;
  onNextCategory: (categoryId: string) => void;
  categories: Category[];
}

export function NextCategoryButton({
  currentCategoryId,
  onNextCategory,
  categories,
}: NextCategoryButtonProps) {
  const currentIndex = categories.findIndex((c) => c.id === currentCategoryId);
  const nextCategory = categories[currentIndex + 1];

  if (!nextCategory) return null;

  return (
    <div className="px-1 py-4">
      <button
        onClick={() => onNextCategory(nextCategory.id)}
        className="w-full min-h-[56px] px-5 py-4 rounded-2xl btn-rosa font-semibold flex items-center justify-between gap-3 shadow-soft hover:shadow-soft-lg active:scale-[0.98] transition-all touch-manipulation"
      >
        <span className="text-sm opacity-90 font-script" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.05rem" }}>
          Siguiente
        </span>
        <span className="flex items-center gap-2 min-w-0">
          <span
            className="truncate text-lg"
            style={{ fontFamily: "var(--font-dancing), cursive" }}
          >
            {nextCategory.name}
          </span>
          <ArrowRight className="h-5 w-5 flex-shrink-0" />
        </span>
      </button>
    </div>
  );
}
