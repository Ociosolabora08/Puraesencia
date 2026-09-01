import Link from "next/link";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-crema-texture px-4">
      <div className="text-center space-y-4 max-w-sm">
        <Leaf className="h-10 w-10 text-primary/60 mx-auto" aria-hidden="true" />
        <h1
          className="text-3xl font-bold text-marron"
          style={{ fontFamily: "var(--font-dancing), cursive" }}
        >
          Esta esencia no existe
        </h1>
        <p className="text-sm text-muted-foreground">
          El producto que buscas ya no está disponible o la dirección es incorrecta.
        </p>
        <Link
          href="/"
          className="inline-flex px-5 py-3 rounded-xl text-white font-semibold text-sm min-h-11 shadow-soft hover:shadow-soft-lg transition-all"
          style={{ background: "linear-gradient(135deg, #FF5A8F 0%, #e14a80 100%)" }}
        >
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}
