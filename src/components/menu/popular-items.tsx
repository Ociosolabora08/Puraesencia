"use client";

import { Heart, Trophy } from "lucide-react";

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

interface PopularItemsProps {
  items: MenuItem[];
  onItemClick: (categoryId: string, itemId: string) => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function PopularItems({ items, onItemClick }: PopularItemsProps) {
  // Filter items with likes > 0, sort by likes descending, take top 3
  const popularItems = items
    .filter((item) => item.likes > 0 && item.images.length > 0)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  if (popularItems.length === 0) return null;

  // Arrange for podium: 2nd place (left), 1st place (center, taller), 3rd place (right)
  const podiumOrder = popularItems.length >= 3
    ? [popularItems[1], popularItems[0], popularItems[2]]
    : popularItems.length === 2
    ? [popularItems[1], popularItems[0]]
    : [popularItems[0]];

  const medalColors = [
    { border: "var(--theme-podium-silver)", bg: "var(--theme-podium-silver)", label: "2do" },
    { border: "var(--theme-podium-gold)", bg: "var(--theme-podium-gold)", label: "1ro" },
    { border: "var(--theme-podium-bronze)", bg: "var(--theme-podium-bronze)", label: "3ro" },
  ];

  const podiumHeights = ["h-28", "h-36", "h-24"];

  return (
    <div className="py-4 px-4">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Los Más Gustados</h2>
      </div>

      {/* Podium layout */}
      <div className="flex items-end justify-center gap-2">
        {podiumOrder.map((item, index) => {
          const medal = medalColors[index] || medalColors[2];
          const height = podiumHeights[index] || "h-24";
          const isFirst = index === 1 && popularItems.length >= 2;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.categoryId, item.id)}
              className="flex flex-col items-center flex-1 max-w-[120px] group"
            >
              {/* Image with medal badge */}
              <div className={`relative ${isFirst ? "w-24 h-24" : "w-20 h-20"} rounded-full overflow-hidden border-3 shadow-lg group-hover:scale-105 transition-transform`}
                style={{ borderColor: medal.border, borderWidth: "3px" }}
              >
                <img
                  src={item.images[0] || "/placeholder.png"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Medal badge */}
                <div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-white text-[10px] font-bold shadow-md"
                  style={{ backgroundColor: medal.bg }}
                >
                  {medal.label}
                </div>
              </div>

              {/* Item info */}
              <div className="mt-3 text-center">
                <p className="text-xs font-semibold truncate w-full max-w-[100px]">
                  {item.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {formatPrice(item.price)}
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {item.likes}
                  </span>
                </div>
              </div>

              {/* Podium step */}
              <div
                className={`w-full ${height} rounded-t-lg mt-2 transition-colors`}
                style={{
                  background: `linear-gradient(to top, ${medal.bg}20, ${medal.bg}10)`,
                  borderTop: `3px solid ${medal.bg}`,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
