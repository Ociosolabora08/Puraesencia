"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  Star,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "./image-uploader";

interface MenuItemWithCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  likes: number;
  isFeatured: boolean;
  categoryId: string;
  category: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

interface MenuItemManagerProps {
  onDataChange: () => void;
}

const emptyForm = {
  name: "",
  price: 0,
  description: "",
  images: [] as string[],
  isFeatured: false,
  categoryId: "",
};

export function MenuItemManager({ onDataChange }: MenuItemManagerProps) {
  const [items, setItems] = useState<MenuItemWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const fetchData = useCallback(async () => {
    try {
      const [itemsRes, catsRes] = await Promise.all([
        fetch("/api/menu-items"),
        fetch("/api/categories"),
      ]);
      const itemsData = await itemsRes.json();
      const catsData = await catsRes.json();
      setItems(itemsData);
      setCategories(catsData);
    } catch {
      console.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.categoryId) return;
    try {
      await fetch("/api/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm(emptyForm);
      setIsCreating(false);
      fetchData();
      onDataChange();
    } catch {
      console.error("Failed to create item");
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !form.name.trim()) return;
    try {
      await fetch("/api/menu-items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...form }),
      });
      setEditingId(null);
      setForm(emptyForm);
      fetchData();
      onDataChange();
    } catch {
      console.error("Failed to update item");
    }
  };

  const handleDelete = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!confirm(`¿Eliminar "${item?.name}"?`)) return;
    try {
      await fetch(`/api/menu-items?id=${id}`, { method: "DELETE" });
      fetchData();
      onDataChange();
    } catch {
      console.error("Failed to delete item");
    }
  };

  const startEdit = (item: MenuItemWithCategory) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      price: item.price,
      description: item.description,
      images: item.images,
      isFeatured: item.isFeatured,
      categoryId: item.categoryId,
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);

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
        <h3 className="font-semibold text-lg">Productos del Catálogo</h3>
        <Button size="sm" onClick={startCreate} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-1" />
          Agregar
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background"
        >
          <option value="all">Todas</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
          <h4 className="font-medium text-sm">
            {editingId ? "Editar producto" : "Nuevo producto"}
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Nombre del producto"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              autoFocus
              className="col-span-2"
            />
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                placeholder="Precio"
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: parseInt(e.target.value) || 0 })
                }
                className="pl-7"
              />
            </div>
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
              className="h-9 px-3 text-sm border rounded-md bg-background"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <Textarea
            placeholder="Descripción del producto: ingredientes, lote, proceso artesanal..."
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={3}
            className="text-sm"
          />

          {/* Featured toggle */}
          <div className="flex items-center gap-2">
            <Switch
              checked={form.isFeatured}
              onCheckedChange={(checked) =>
                setForm({ ...form, isFeatured: checked })
              }
            />
            <span className="text-sm">Marcar como destacado</span>
            {form.isFeatured && (
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Destacado
              </Badge>
            )}
          </div>

          {/* Images */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Imágenes</p>
            {form.images.map((img, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 border rounded-md"
              >
                <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={img}
                    alt={`Imagen ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-muted-foreground flex-1 truncate">
                  {img}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-destructive"
                  onClick={() =>
                    setForm({
                      ...form,
                      images: form.images.filter((_, i) => i !== idx),
                    })
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}

            {form.images.length < 5 && (
              <ImageUploader
                purpose="menuItem"
                onUploadComplete={(url) =>
                  setForm({
                    ...form,
                    images: [...form.images, url],
                  })
                }
              />
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={editingId ? handleUpdate : handleCreate}
              disabled={!form.name.trim() || !form.categoryId}
            >
              <Check className="h-4 w-4 mr-1" />
              {editingId ? "Guardar" : "Crear"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditingId(null);
                setIsCreating(false);
                setForm(emptyForm);
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
          >
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
              {item.images[0] ? (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  Sin img
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-medium text-sm truncate">{item.name}</p>
                {item.isFeatured && (
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatPrice(item.price)}</span>
                <span>·</span>
                <span>{item.category.name}</span>
                <span>·</span>
                <span>{item.images.length} img</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => startEdit(item)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No se encontraron productos
          </p>
        )}
      </div>
    </div>
  );
}
