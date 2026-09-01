"use client";

// FASE 3.7 — Error boundary global: antes los fallos se tragaban en un catch vacío
// y el usuario veía el catálogo vacío para siempre.
import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error de aplicación:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-crema-texture px-4">
      <div className="text-center space-y-4 max-w-sm">
        <AlertCircle className="h-10 w-10 text-primary mx-auto" aria-hidden="true" />
        <h1
          className="text-2xl font-bold text-marron"
          style={{ fontFamily: "var(--font-dancing), cursive" }}
        >
          Algo se derramó por aquí
        </h1>
        <p className="text-sm text-muted-foreground">
          No pudimos cargar el catálogo en este momento. Reintenta — si sigue fallando,
          escríbenos por WhatsApp.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm min-h-11 shadow-soft hover:shadow-soft-lg transition-all active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #FF5A8F 0%, #e14a80 100%)" }}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
