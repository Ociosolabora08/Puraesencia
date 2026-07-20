"use client";

import { useState } from "react";
import {
  X,
  LayoutDashboard,
  FolderOpen,
  Package,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { AdminLogin } from "./admin-login";
import { CategoryManager } from "./category-manager";
import { MenuItemManager } from "./menu-item-manager";
import { RestaurantSettings } from "./restaurant-settings";
import { BrandLogo } from "@/components/brand/decorative";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChange: () => void;
}

type AdminTab = "dashboard" | "categories" | "items" | "settings";

export function AdminPanel({ isOpen, onClose, onDataChange }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  if (!isOpen) return null;

  const tabs = [
    { id: "dashboard" as const, label: "Inicio", icon: LayoutDashboard },
    { id: "categories" as const, label: "Categorías", icon: FolderOpen },
    { id: "items" as const, label: "Productos", icon: Package },
    { id: "settings" as const, label: "Ajustes", icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-crema-texture">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-crema border-b border-rosa-suave/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" />
          <span className="text-xs text-muted-foreground hidden sm:inline">Panel</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-rosa-suave/40 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {!isAuthenticated ? (
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <div className="flex h-[calc(100vh-65px)]">
          {/* Sidebar - Desktop */}
          <nav className="hidden md:flex flex-col w-56 border-r border-rosa-suave/60 bg-crema-calido/40">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "btn-rosa"
                      : "text-marron/70 hover:text-primary hover:bg-rosa-suave/30"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
            <div className="mt-auto border-t border-rosa-suave/60">
              <button
                onClick={async () => {
                  await fetch("/api/admin/login", { method: "DELETE" });
                  setIsAuthenticated(false);
                  onClose();
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-marron/70 hover:text-foreground hover:bg-rosa-suave/30 w-full transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </nav>

          {/* Bottom nav - Mobile */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-crema border-t border-rosa-suave/60 flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-marron/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
            {activeTab === "dashboard" && (
              <DashboardContent
                onNavigate={setActiveTab}
                onLogout={async () => {
                  await fetch("/api/admin/login", { method: "DELETE" });
                  setIsAuthenticated(false);
                  onClose();
                }}
              />
            )}
            {activeTab === "categories" && (
              <CategoryManager onDataChange={onDataChange} />
            )}
            {activeTab === "items" && (
              <MenuItemManager onDataChange={onDataChange} />
            )}
            {activeTab === "settings" && (
              <RestaurantSettings onDataChange={onDataChange} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardContent({
  onNavigate,
  onLogout,
}: {
  onNavigate: (tab: AdminTab) => void;
  onLogout: () => void;
}) {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-3 py-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-rosa-suave/40 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3
          className="text-2xl font-semibold text-primary"
          style={{ fontFamily: "var(--font-dancing), cursive" }}
        >
          ¡Hola, bienvenida!
        </h3>
        <p
          className="text-base text-muted-foreground font-script"
          style={{ fontFamily: "var(--font-caveat), cursive" }}
        >
          Administra tu catálogo artesanal con cariño
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate("categories")}
          className="flex flex-col items-center gap-2 p-4 border border-rosa-suave rounded-2xl hover:bg-rosa-suave/20 transition-colors"
        >
          <FolderOpen className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium">Categorías</span>
          <span className="text-xs text-muted-foreground">Agregar o editar</span>
        </button>
        <button
          onClick={() => onNavigate("items")}
          className="flex flex-col items-center gap-2 p-4 border border-rosa-suave rounded-2xl hover:bg-rosa-suave/20 transition-colors"
        >
          <Package className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium">Productos</span>
          <span className="text-xs text-muted-foreground">Administrar catálogo</span>
        </button>
        <button
          onClick={() => onNavigate("settings")}
          className="flex flex-col items-center gap-2 p-4 border border-rosa-suave rounded-2xl hover:bg-rosa-suave/20 transition-colors"
        >
          <Settings className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium">Ajustes</span>
          <span className="text-xs text-muted-foreground">Configuración</span>
        </button>
        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-2 p-4 border border-rosa-suave rounded-2xl hover:bg-red-50 hover:border-red-200 transition-colors text-destructive"
        >
          <LogOut className="h-6 w-6" />
          <span className="text-sm font-medium">Salir</span>
          <span className="text-xs opacity-70">Cerrar sesión</span>
        </button>
      </div>

      {/* Tips */}
      <div className="border border-rosa-suave rounded-2xl p-4 space-y-3 bg-rosa-suave/15">
        <h4
          className="font-medium text-base text-primary"
          style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.15rem" }}
        >
          Consejos para tu catálogo
        </h4>
        <ul className="space-y-2 text-sm text-marron/80">
          <li className="flex gap-2">
            <span className="text-primary font-bold">1.</span>
            Usa fotos bien iluminadas, sin filtros pesados. El sistema las convierte a WebP automáticamente.
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">2.</span>
            Máximo 5 fotos por producto. La primera imagen es la principal.
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">3.</span>
            Marca tus productos estrella como &quot;Favorito&quot; para que aparezcan primero.
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">4.</span>
            Imágenes máximo 2MB. Se optimizan automáticamente para carga rápida.
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-bold">5.</span>
            Cuenta la historia de cada producto en la descripción: ingredientes, lote, proceso.
          </li>
        </ul>
      </div>
    </div>
  );
}
