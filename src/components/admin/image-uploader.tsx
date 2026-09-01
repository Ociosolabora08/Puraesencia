"use client";

import { useState, useCallback } from "react";
import { Upload, X, CheckCircle, AlertCircle, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ImageUploaderProps {
  purpose: "category" | "menuItem" | "logo";
  currentImage?: string;
  // url + blurDataURL (placeholder blur-up generado con sharp en el upload)
  onUploadComplete: (url: string, blurDataURL?: string) => void;
  onRemove?: () => void;
}

export function ImageUploader({
  purpose,
  currentImage,
  onUploadComplete,
  onRemove,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<{
    originalSize: string;
    optimizedSize: string;
    reduction: string;
  } | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      setOptimizationResult(null);

      // Validate type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(`Tipo no permitido. Usa JPEG, PNG o WebP.`);
        return;
      }

      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        setError(`Archivo muy grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo: 2MB`);
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("purpose", purpose);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Error al subir imagen");
          return;
        }

        setOptimizationResult(data.optimization);
        onUploadComplete(data.url, data.blurDataURL);
      } catch {
        setError("Error de conexión al subir imagen");
      } finally {
        setIsUploading(false);
      }
    },
    [purpose, onUploadComplete]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="space-y-2">
      {currentImage && (
        <div className="relative w-full aspect-square max-w-[200px] rounded-lg overflow-hidden border bg-muted">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {onRemove && (
            <button
              onClick={onRemove}
              className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Optimizando imagen...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Arrastra una imagen o haz clic para seleccionar
            </p>
            <p className="text-xs text-muted-foreground">
              JPEG, PNG o WebP · Máximo 2MB · Se convierte a WebP
            </p>
          </div>
        )}
      </div>

      {/* Optimization stats */}
      {optimizationResult && (
        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-950/20 rounded-md p-2">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>
            {optimizationResult.originalSize} → {optimizationResult.optimizedSize}{" "}
            ({optimizationResult.reduction} reducción)
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-md p-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
