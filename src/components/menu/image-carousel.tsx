"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  blurDataURL?: string;
  priority?: boolean;
}

const SIZES = "(max-width: 640px) 100vw, 560px";

// Estado "sin foto" con placeholder de marca (no un <img> roto)
function EmptyPhoto({ alt }: { alt: string }) {
  return (
    <div
      className="aspect-square w-full bg-rosa-suave/30 flex flex-col items-center justify-center gap-2 text-marron/60"
      role="img"
      aria-label={`${alt} — foto próximamente`}
    >
      <Leaf className="h-10 w-10 text-primary/50" aria-hidden="true" />
      <span
        className="text-lg"
        style={{ fontFamily: "var(--font-caveat), cursive" }}
      >
        Foto próximamente
      </span>
    </div>
  );
}

export function ImageCarousel({ images, alt, blurDataURL, priority = false }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setCurrent((prev) => {
        if (index < 0) return images.length - 1;
        if (index >= images.length) return 0;
        return index;
      });
    },
    [images.length]
  );

  if (images.length === 0) {
    return <EmptyPhoto alt={alt} />;
  }

  if (images.length === 1) {
    return (
      <div className="relative w-full overflow-hidden bg-rosa-suave/30 aspect-square">
        <Image
          src={images[0]}
          alt={alt}
          fill
          sizes={SIZES}
          className="object-cover"
          priority={priority}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
        />
      </div>
    );
  }

  return (
    <div className="aspect-square relative overflow-hidden bg-rosa-suave/30">
      <div className="overflow-hidden h-full">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%] h-full relative">
              <Image
                src={img}
                alt={`${alt} - ${i + 1}`}
                fill
                sizes={SIZES}
                className="object-cover"
                priority={priority && i === 0}
                placeholder={blurDataURL && i === 0 ? "blur" : "empty"}
                blurDataURL={blurDataURL}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Flechas ≥44px de target táctil (WCAG 2.5.8) */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 min-w-11 min-h-11 flex items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm hover:bg-white transition-colors"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 min-w-11 min-h-11 flex items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm hover:bg-white transition-colors"
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Dots con área táctil ampliada */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="p-3 flex items-center justify-center min-w-11 min-h-11"
            aria-label={`Ir a imagen ${i + 1}`}
            aria-current={i === current}
          >
            <span
               className={`h-2 rounded-full transition-all ${
                i === current ? "w-4 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
