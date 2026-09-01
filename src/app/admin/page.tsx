// FASE 3.1 — Admin en ruta separada. Ya no viaja en el bundle de la home.
"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// ssr:false: el panel solo existe en cliente (usa drawer, forms, fetch con cookie)
const AdminPanel = dynamic(
  () => import("@/components/admin/admin-panel").then((m) => m.AdminPanel),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-crema-texture">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Cargando panel" />
      </div>
    ),
  }
);

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-crema-texture">
      <AdminPanel isOpen onClose={() => router.push("/")} onDataChange={() => {}} />
    </div>
  );
}
