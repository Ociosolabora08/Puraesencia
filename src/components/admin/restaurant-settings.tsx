"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "./image-uploader";

interface Restaurant {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  logo: string;
}

interface RestaurantSettingsProps {
  onDataChange: () => void;
}

export function RestaurantSettings({ onDataChange }: RestaurantSettingsProps) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    logo: "",
  });
  const [saved, setSaved] = useState(false);

  const fetchRestaurant = useCallback(async () => {
    try {
      const res = await fetch("/api/restaurant");
      const data = await res.json();
      setRestaurant(data);
      setForm({
        name: data.name,
        phone: data.phone,
        whatsapp: data.whatsapp,
        logo: data.logo,
      });
    } catch {
      console.error("Failed to fetch restaurant");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      await fetch("/api/restaurant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaved(true);
      onDataChange();
      setTimeout(() => setSaved(false), 2000);
    } catch {
      console.error("Failed to save restaurant");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Configuración</h3>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          {saved ? "¡Guardado!" : "Guardar"}
        </Button>
      </div>

      <div className="space-y-4">
        {/* Logo */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Logo de la tienda</label>
          <ImageUploader
            purpose="logo"
            currentImage={form.logo}
            onUploadComplete={(url) => setForm({ ...form, logo: url })}
            onRemove={() => setForm({ ...form, logo: "" })}
          />
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre de la tienda</label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nombre de la tienda"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Teléfono</label>
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+573001234567"
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-2">
          <label className="text-sm font-medium">WhatsApp</label>
          <Input
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="+573001234567"
          />
          <p className="text-xs text-muted-foreground">
            Número de WhatsApp para el botón de contacto (incluir código de país)
          </p>
        </div>
      </div>
    </div>
  );
}
