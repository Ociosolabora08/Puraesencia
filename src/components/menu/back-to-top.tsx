"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 z-30 p-3 rounded-full btn-rosa shadow-soft-lg hover:shadow-lg transition-opacity touch-manipulation ${
        isVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      aria-label="Volver arriba"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
