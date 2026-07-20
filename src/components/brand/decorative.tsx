import { Heart, Star, Sparkles, Droplet } from "lucide-react";

/**
 * Decorative elements from Pura Esencia brand brief:
 * - Watercolor stains (manchas de acuarela)
 * - Hearts (corazones) - always rosa or rojo
 * - Stars (estrellas) - verde, púrpura, amarillo
 * - Water drop (gota de agua) - turquesa or menta
 *
 * Brief rule: max 2 hearts and 3 stars per piece, max 15% of visual area
 */

export function WatercolorBlob({
  color = "#FF5A8F",
  className = "",
  size = 200,
  opacity = 0.25,
}: {
  color?: string;
  className?: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <div
      className={`watercolor-blob ${className}`}
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        opacity,
      }}
      aria-hidden="true"
    />
  );
}

export function DecorativeHeart({
  className = "",
  color = "#FF5A8F",
  size = 18,
  filled = true,
}: {
  className?: string;
  color?: string;
  size?: number;
  filled?: boolean;
}) {
  return (
    <Heart
      className={className}
      size={size}
      color={color}
      fill={filled ? color : "transparent"}
      strokeWidth={filled ? 0 : 2}
      aria-hidden="true"
    />
  );
}

export function DecorativeStar({
  className = "",
  color = "#FFD93D",
  size = 14,
  filled = true,
}: {
  className?: string;
  color?: string;
  size?: number;
  filled?: boolean;
}) {
  return (
    <Star
      className={className}
      size={size}
      color={color}
      fill={filled ? color : "transparent"}
      strokeWidth={filled ? 0 : 2}
      aria-hidden="true"
    />
  );
}

export function DecorativeDrop({
  className = "",
  size = 18,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Droplet
      className={className}
      size={size}
      color="#45B7D1"
      fill="#45B7D1"
      strokeWidth={0}
      aria-hidden="true"
    />
  );
}

export function Sparkle({
  className = "",
  size = 14,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Sparkles
      className={className}
      size={size}
      color="#FFD93D"
      aria-hidden="true"
    />
  );
}

/**
 * Brand logo - text-based, "Pura" over "Esencia" with the brand handwriting font
 * Brief: Letra P con bucle grande y redondeado, conexión fluida entre Pura y Esencia
 */
export function BrandLogo({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: "text-2xl leading-tight",
    md: "text-3xl leading-tight",
    lg: "text-5xl leading-tight",
    xl: "text-7xl leading-tight",
  };

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div className="relative">
        <span
          className={`font-display font-bold text-primary ${sizeClasses[size]}`}
          style={{ fontFamily: "var(--font-dancing), cursive" }}
        >
          Pura
        </span>
        <DecorativeHeart
          className="absolute -top-1 -right-3"
          size={size === "xl" ? 22 : size === "lg" ? 16 : 12}
          color="#FF5A8F"
        />
      </div>
      <span
        className={`font-display font-bold text-primary -mt-2 ${sizeClasses[size]}`}
        style={{ fontFamily: "var(--font-dancing), cursive" }}
      >
        Esencia
      </span>
    </div>
  );
}

/**
 * Set of decorative watercolor blobs for backgrounds
 * Used on hero sections or behind important content
 */
export function WatercolorBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <WatercolorBlob color="#FF5A8F" size={300} opacity={0.12} className="-top-20 -left-20" />
      <WatercolorBlob color="#4ECDC4" size={250} opacity={0.10} className="top-20 -right-16" />
      <WatercolorBlob color="#FFD93D" size={200} opacity={0.08} className="bottom-10 left-1/4" />
    </div>
  );
}
