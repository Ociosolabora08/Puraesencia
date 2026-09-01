"use client";

import { useState } from "react";
import {
  Phone,
  Share2,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BrandLogo, DecorativeHeart, DecorativeStar } from "@/components/brand/decorative";

const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

interface StoreInfo {
  name: string;
  phone: string;
  whatsapp: string;
  logo: string;
}

interface StickyHeaderProps {
  restaurantInfo: StoreInfo | null;
}

export function StickyHeader({ restaurantInfo }: StickyHeaderProps) {
  const [selectedLang, setSelectedLang] = useState(languages[0]); // Español default

  const info = restaurantInfo || { name: "Pura Esencia", phone: "", whatsapp: "", logo: "" };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: info.name,
          text: `Mira los productos artesanales de ${info.name} — hechos a mano con cariño`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-crema/95 backdrop-blur-sm border-b border-rosa-suave/60 px-4 py-3">
      <div className="flex justify-between items-center max-w-xl mx-auto gap-2">
        {/* Brand Logo - Pura Esencia handwritten */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative">
            <BrandLogo size="sm" />
            <DecorativeStar
              className="absolute -top-1 -left-3"
              size={10}
              color="#9B59B6"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Language Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-rosa-suave/60 rounded-full gap-1 h-auto"
              >
                <span className="text-base">{selectedLang.flag}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-2 bg-crema border-rosa-suave">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-rosa-suave/40 transition-colors ${
                    selectedLang.code === lang.code
                      ? "font-semibold bg-rosa-suave/40 text-primary"
                      : ""
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {/* WhatsApp */}
          {info.whatsapp && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-menta-suave/60 rounded-full text-menta h-auto"
              asChild
            >
              <a
                href={`https://wa.me/${info.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </Button>
          )}

          {/* Phone */}
          {info.phone && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-rosa-suave/60 rounded-full h-auto"
              asChild
            >
              <a href={`tel:${info.phone}`} aria-label="Llamar">
                <Phone className="h-5 w-5" />
              </a>
            </Button>
          )}

          {/* Share */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-rosa-suave/60 rounded-full h-auto"
            onClick={handleShare}
            aria-label="Compartir"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
