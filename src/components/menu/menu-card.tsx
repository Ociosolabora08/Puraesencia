"use client";

import { useState } from "react";
import { Heart, Bookmark, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageCarousel } from "./image-carousel";

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

interface MenuCardProps {
  item: MenuItem;
  categoryImage?: string;
  categoryName?: string;
  whatsapp?: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function MenuCard({ item, categoryImage, categoryName, whatsapp }: MenuCardProps) {
  const [likes, setLikes] = useState(item.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleWhatsAppOrder = () => {
    if (!whatsapp) return;
    const message = `¡Hola Pura Esencia! 💕 Me encantaría ordenar: ${item.name} (${formatPrice(item.price)}). ¿Lo tienes disponible?`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const maxDescLength = 120;
  const shouldTruncate = item.description.length > maxDescLength;

  return (
    <article
      id={`menu-item-${item.id}`}
      className="rounded-2xl bg-card overflow-hidden scroll-mt-20 shadow-soft hover:shadow-soft-lg transition-shadow border border-rosa-suave/50"
    >
      {/* Item Header: Avatar + Name */}
      <div className="flex items-center gap-2 py-3 px-4">
        <div className="w-9 h-9 rounded-full bg-rosa-suave overflow-hidden flex-shrink-0 border-2 border-rosa-suave">
          {categoryImage ? (
            <img
              src={categoryImage}
              alt={categoryName || ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-rosa-suave flex items-center justify-center text-sm">
              🌿
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="font-semibold text-base text-marron block truncate"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            {item.name}
          </span>
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
      <ImageCarousel images={item.images} alt={item.name} />

      {/* Action Bar */}
      <div className="py-3 px-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`hover:text-primary transition-colors flex items-center gap-1.5 ${
              isLiked ? "text-primary" : "text-marron"
            }`}
            aria-label={isLiked ? "Quitar like" : "Dar like"}
          >
            <Heart
              className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
            />
            <span className="text-sm font-medium">{likes}</span>
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`hover:text-primary transition-colors ${
              isBookmarked ? "text-primary" : "text-marron"
            }`}
            aria-label={isBookmarked ? "Quitar guardado" : "Guardar"}
          >
            <Bookmark
              className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Price & Description */}
      <div className="px-4 pb-3">
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

        {/* WhatsApp Order Button */}
        {whatsapp && (
          <button
            onClick={handleWhatsAppOrder}
            className="mt-3 w-full py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-soft hover:shadow-soft-lg"
            style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
          >
            <MessageCircle className="h-4 w-4" />
            Ordenar por WhatsApp
          </button>
        )}
      </div>
    </article>
  );
}
