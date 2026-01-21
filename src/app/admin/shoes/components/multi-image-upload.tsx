"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MultiImageFile {
  id?: string;
  file: File | null;
  preview: string;
  isExisting: boolean;
}

interface MultiImageUploadProps {
  value: MultiImageFile[];
  onChange: (value: MultiImageFile[]) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
  maxFiles?: number;
}

export function MultiImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  maxFiles = 10,
}: MultiImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith("image/")) return false;
    if (file.size > 5 * 1024 * 1024) return false;
    return true;
  };

  const handleFilesSelect = useCallback(
    (files: FileList) => {
      const validFiles: MultiImageFile[] = [];
      const remaining = maxFiles - value.length;

      for (let i = 0; i < Math.min(files.length, remaining); i++) {
        const file = files[i];
        if (validateFile(file)) {
          validFiles.push({
            file,
            preview: URL.createObjectURL(file),
            isExisting: false,
          });
        }
      }

      if (validFiles.length > 0) {
        onChange([...value, ...validFiles]);
      }
    },
    [onChange, value, maxFiles],
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
      if (e.dataTransfer.files?.length) {
        handleFilesSelect(e.dataTransfer.files);
      }
    },
    [handleFilesSelect],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        handleFilesSelect(e.target.files);
      }
      // Reset input
      e.target.value = "";
    },
    [handleFilesSelect],
  );

  const canAddMore = value.length < maxFiles;

  return (
    <div className="space-y-4">
      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {value.map((image, index) => (
            <div key={index} className="group relative aspect-square">
              <div className="relative h-full w-full overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={image.preview}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-1 -top-1 h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => onRemove(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
              {!image.isExisting && (
                <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1 text-[10px] text-white">
                  New
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {canAddMore && (
        <div
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
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
            multiple
            onChange={handleChange}
            disabled={disabled}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <Plus className="mb-1 h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Add photos</p>
          <p className="text-xs text-muted-foreground">
            {value.length}/{maxFiles} photos
          </p>
        </div>
      )}
    </div>
  );
}
