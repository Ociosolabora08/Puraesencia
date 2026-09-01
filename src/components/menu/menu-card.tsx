"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ShoppingBag, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageCarousel } from "./image-carousel";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import type { CatalogItem } from "@/lib/types";

interface MenuCardProps {
  item: CatalogItem;
  categoryImage?: string;
  categoryName?: string;
  priority?: boolean;
}

const maxDescLength = 120;

export function MenuCard({ item, categoryImage, categoryName, priority = false }: MenuCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addToCart = useCart((s) => s.add);

  const shouldTruncate = item.description.length > maxDescLength;

  const handleAddToCart = () => {
    addToCart({ itemId: item.id, name: item.name, price: item.price });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const nameContent = (
    <span
      className="font-semibold text-base text-marron block truncate"
      style={{ fontFamily: "var(--font-caveat), cursive" }}
    >
      {item.name}
    </span>
  );

  return (
    <article
      id={`menu-item-${item.id}`}
      className="rounded-2xl bg-card overflow-hidden scroll-mt-20 shadow-soft hover:shadow-soft-lg transition-shadow border border-rosa-suave/50"
    >
      {/* Item Header: Avatar + Name */}
      <div className="flex items-center gap-2 py-3 px-4">
        <div className="w-9 h-9 rounded-full bg-rosa-suave overflow-hidden flex-shrink-0 border-2 border-rosa-suave relative">
          {categoryImage ? (
            <Image
              src={categoryImage}
              alt={categoryName || ""}
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-rosa-suave flex items-center justify-center text-sm">
              🌿
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {item.slug ? (
            <Link href={`/producto/${item.slug}`} className="hover:text-primary transition-colors">
              {nameContent}
            </Link>
          ) : (
            nameContent
          )}
          {categoryName && (
            <span className="text-xs text-muted-foreground">{categoryName}</span>
          )}
        </div>
        {item.isFeatured && (
          <Badge
            variant="secondary"
            className="text-[10px] px-2 py-0.5 h-auto btn-rosa border-0 font-semibold"
          >
            Favorito
          </Badge>
        )}
      </div>

      {/* Image / Carousel */}
      {item.slug ? (
        <Link
          href={`/producto/${item.slug}`}
          aria-label={`Ver detalle de ${item.name}`}
          className="block"
        >
          <ImageCarousel
            images={item.images}
            alt={item.name}
            blurDataURL={item.imageBlur || undefined}
            priority={priority}
          />
        </Link>
      ) : (
        <ImageCarousel
          images={item.images}
          alt={item.name}
          blurDataURL={item.imageBlur || undefined}
          priority={priority}
        />
      )}

      {/* Price & Description */}
      <div className="px-4 pb-4 pt-3">
        <p
          className="font-bold text-lg text-primary"
          style={{ fontFamily: "var(--font-caveat), cursive" }}
        >
          {formatPrice(item.price)}
        </p>
        <div className="mt-1 space-y-1">
          <div className="text-sm text-marron/80 leading-relaxed">
            <p className="my-1">
              {shouldTruncate && !isExpanded
                ? `${item.description.slice(0, maxDescLength)}...`
                : item.description}
            </p>
          </div>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-medium text-primary underline hover:text-primary/80"
            >
              {isExpanded ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>

        {/* CTA único: agregar al pedido → el carrito flotante envía TODO por WhatsApp */}
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full min-h-11 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-soft hover:shadow-soft-lg"
          style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Agregado al pedido
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Agregar al pedido
            </>
          )}
        </button>
      </div>
    </article>
  );
}
