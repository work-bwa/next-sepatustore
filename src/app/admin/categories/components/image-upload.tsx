"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ImageFile {
  file: File | null;
  preview: string;
  isExisting: boolean;
}

interface ImageUploadProps {
  value: ImageFile;
  onChange: (value: ImageFile) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Please upload an image file (PNG, JPG, GIF, WebP)";
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    return null;
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      setError(null);

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      if (value.preview && !value.isExisting) {
        URL.revokeObjectURL(value.preview);
      }

      const preview = URL.createObjectURL(file);

      onChange({
        file,
        preview,
        isExisting: false,
      });
    },
    [onChange, value],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleRemove = useCallback(() => {
    if (value.preview && !value.isExisting) {
      URL.revokeObjectURL(value.preview);
    }

    onChange({
      file: null,
      preview: "",
      isExisting: false,
    });
    setError(null);
  }, [onChange, value]);

  if (value.preview) {
    return (
      <div className="relative">
        <div className="relative aspect-square w-full max-w-50 overflow-hidden rounded-lg border bg-muted">
          <Image
            src={value.preview}
            alt="Preview"
            fill
            className="object-contain p-2"
            sizes="200px"
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -right-2 -top-2 h-6 w-6"
          onClick={handleRemove}
          disabled={disabled}
        >
          <X className="h-3 w-3" />
        </Button>
        {!value.isExisting && (
          <p className="mt-2 text-xs text-muted-foreground">
            Image will be uploaded when you save
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          error && "border-destructive/50 bg-destructive/5",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drop an image here or click to upload
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PNG, JPG, GIF, WebP up to 5MB
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
