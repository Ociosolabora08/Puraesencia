"use client";

import Link from "next/link";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { CatalogItem } from "@/lib/types";

interface FeaturedItemsProps {
  items: CatalogItem[];
}

export function FeaturedItems({ items }: FeaturedItemsProps) {
  if (items.length === 0) return null;

  return (
    <div className="py-4">
      <div className="flex items-center gap-2 px-4 mb-3">
        <Sparkles className="h-4 w-4 text-amarillo" />
        <h2
          className="text-2xl font-bold text-primary"
          style={{ fontFamily: "var(--font-dancing), cursive" }}
        >
          Nuestras Favoritas
        </h2>
      </div>
      <p
        className="px-4 mb-3 text-sm text-muted-foreground font-script"
        style={{ fontFamily: "var(--font-caveat), cursive" }}
      >
        Hechas a mano con cariño, en pequeños lotes
      </p>
      <ScrollArea className="w-full">
        <div className="flex gap-3 px-4 pb-4">
          {items.map((item, idx) => (
            <Link
              key={item.id}
              href={item.slug ? `/producto/${item.slug}` : "#"}
              className="w-36 h-52 relative rounded-2xl overflow-hidden border-2 border-rosa-suave hover:border-primary hover:scale-105 transition-all flex-shrink-0 focus:ring-2 focus:ring-primary shadow-soft hover:shadow-soft-lg bg-rosa-suave/30"
              aria-label={`${item.name} — ${formatPrice(item.price)}`}
            >
              {item.images[0] ? (
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  fill
                  sizes="144px"
                  className="object-cover"
                  priority={idx === 0}
                  placeholder={item.imageBlur && idx === 0 ? "blur" : "empty"}
                  blurDataURL={item.imageBlur}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-primary/40">
                  <Sparkles className="h-8 w-8" aria-hidden="true" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-marron/85 via-marron/40 to-transparent p-3">
                <p
                  className="text-white text-base font-semibold truncate leading-tight"
                  style={{ fontFamily: "var(--font-caveat), cursive" }}
                >
                  {item.name}
                </p>
                <p className="text-white/95 text-xs font-medium mt-0.5">
                  {formatPrice(item.price)}
                </p>
              </div>
              <Badge className="absolute top-2 left-2 text-[10px] px-2 py-0.5 h-auto btn-rosa border-0 font-semibold flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5" />
                Favorito
              </Badge>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
