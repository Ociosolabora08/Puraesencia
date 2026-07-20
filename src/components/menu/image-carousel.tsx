"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
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

  if (images.length === 1) {
    return (
      <div className="relative w-full overflow-hidden bg-rosa-suave/30 aspect-square">
        <img
          src={images[0]}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="aspect-square relative overflow-hidden">
      <div className="overflow-hidden h-full">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%] h-full">
              <img
                src={img}
                alt={`${alt} - ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-lg backdrop-blur-sm hover:bg-white transition-colors"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-lg backdrop-blur-sm hover:bg-white transition-colors"
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current
                ? "w-4 bg-white"
                : "w-1.5 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Ir a imagen ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
