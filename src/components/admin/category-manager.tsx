"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Check,
  X,
  Loader2,
  UtensilsCrossed,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageUploader } from "./image-uploader";

interface CategoryWithCount {
  id: string;
  name: string;
  image: string;
  isHidden: boolean;
  sortOrder: number;
  _count: { menuItems: number };
}

interface CategoryManagerProps {
  onDataChange: () => void;
}

export function CategoryManager({ onDataChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", image: "" });
  const [newForm, setNewForm] = useState({ name: "", image: "" });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      console.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async () => {
    if (!newForm.name.trim()) return;
    try {
      const maxSort = categories.reduce(
        (max, c) => Math.max(max, c.sortOrder),
        0
      );
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newForm.name,
          image: newForm.image,
          sortOrder: maxSort + 1,
        }),
      });
      setNewForm({ name: "", image: "" });
      setIsCreating(false);
      fetchCategories();
      onDataChange();
    } catch {
      console.error("Failed to create category");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const cat = categories.find((c) => c.id === id);
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: editForm.name,
          image: editForm.image,
          sortOrder: cat?.sortOrder || 0,
        }),
      });
      setEditingId(null);
      fetchCategories();
      onDataChange();
    } catch {
      console.error("Failed to update category");
    }
  };

  const handleDelete = async (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (
      !confirm(
        `¿Eliminar la categoría "${cat?.name}" y todos sus productos?`
      )
    )
      return;

    try {
      await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      fetchCategories();
      onDataChange();
    } catch {
      console.error("Failed to delete category");
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
        <h3 className="font-semibold text-lg">Categorías</h3>
        <Button
          size="sm"
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
        >
          <Plus className="h-4 w-4 mr-1" />
          Agregar
        </Button>
      </div>

      {/* New category form */}
      {isCreating && (
        <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
          <Input
            placeholder="Nombre de la categoría"
            value={newForm.name}
            onChange={(e) =>
              setNewForm({ ...newForm, name: e.target.value })
            }
            autoFocus
          />
          <ImageUploader
            purpose="category"
            currentImage={newForm.image}
            onUploadComplete={(url) =>
              setNewForm({ ...newForm, image: url })
            }
            onRemove={() => setNewForm({ ...newForm, image: "" })}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={!newForm.name.trim()}
            >
              <Check className="h-4 w-4 mr-1" />
              Crear
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsCreating(false);
                setNewForm({ name: "", image: "" });
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Categories list */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0 cursor-grab" />

            {/* Image thumbnail */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>

            {editingId === cat.id ? (
              <div className="flex-1 space-y-2">
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="h-8 text-sm"
                  autoFocus
                />
                <ImageUploader
                  purpose="category"
                  currentImage={editForm.image}
                  onUploadComplete={(url) =>
                    setEditForm({ ...editForm, image: url })
                  }
                  onRemove={() =>
                    setEditForm({ ...editForm, image: "" })
                  }
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2"
                    onClick={() => handleUpdate(cat.id)}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2"
                    onClick={() => setEditingId(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {cat.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {cat._count.menuItems} producto
                    {cat._count.menuItems !== 1 ? "s" : ""}
                    {cat.isHidden && " · Oculta"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    title={cat.isHidden ? "Mostrar" : "Ocultar"}
                    onClick={async () => {
                      await fetch("/api/categories", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          id: cat.id,
                          name: cat.name,
                          image: cat.image,
                          sortOrder: cat.sortOrder,
                          isHidden: !cat.isHidden,
                        }),
                      });
                      fetchCategories();
                      onDataChange();
                    }}
                  >
                    {cat.isHidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditForm({ name: cat.name, image: cat.image });
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
