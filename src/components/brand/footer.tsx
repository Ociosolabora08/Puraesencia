"use client";

import Link from "next/link";

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-border/40 bg-cream-texture/40 mt-12">
            <div className="container mx-auto max-w-xl px-4 py-10">
                {/* Logo + tagline */}
                <div className="text-center mb-8">
                    <h2 className="font-serif text-2xl text-foreground mb-2">
                        Pura Esencia
                    </h2>
                    <p className="text-sm text-muted-foreground italic">
                        Hecho a mano, en pequeños lotes, con ingredientes reales.
                    </p>
                </div>

                {/* Redes sociales */}
                <nav
                    className="flex flex-wrap items-center justify-center gap-3 mb-8"
                    aria-label="Redes sociales"
                >
                    <a
                        href="https://instagram.com/puraesencia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-11 min-w-11 inline-flex items-center justify-center px-4 py-2 rounded-md border border-border/60 bg-background hover:bg-accent transition-colors text-sm font-medium"
                    >
                        Instagram
                    </a>
                    <a
                        href="https://tiktok.com/@puraesencia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-11 min-w-11 inline-flex items-center justify-center px-4 py-2 rounded-md border border-border/60 bg-background hover:bg-accent transition-colors text-sm font-medium"
                    >
                        TikTok
                    </a>
                    <a
                        href="https://wa.me/573023087321"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-11 min-w-11 inline-flex items-center justify-center px-4 py-2 rounded-md border border-border/60 bg-background hover:bg-accent transition-colors text-sm font-medium"
                    >
                        WhatsApp
                    </a>
                </nav>

                {/* Contacto */}
                <div className="text-center text-sm text-muted-foreground mb-6">
                    <a
                        href="mailto:hola@puraesencia.co"
                        className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
                    >
                        hola@puraesencia.co
                    </a>
                </div>

                {/* Copyright */}
                <div className="text-center text-xs text-muted-foreground border-t border-border/40 pt-6">
                    <p>
                        © {year} Pura Esencia · Hecho en Colombia con amor
                    </p>
                </div>
            </div>
        </footer>
    );
}
