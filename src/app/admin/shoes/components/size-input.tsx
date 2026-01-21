"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SizeInputProps {
  value: { id?: string; value: string }[];
  onChange: (value: { id?: string; value: string }[]) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

export function SizeInput({
  value,
  onChange,
  onRemove,
  disabled,
}: SizeInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Check for duplicates
    if (value.some((s) => s.value.toLowerCase() === trimmed.toLowerCase())) {
      return;
    }

    onChange([...value, { value: trimmed }]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter size (e.g., 42, EU 42, US 9)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAdd}
          disabled={disabled || !inputValue.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Size tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((size, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="gap-1 pr-1 text-sm"
            >
              {size.value}
              <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={disabled}
                className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No sizes added yet. Add at least one size.
        </p>
      )}
    </div>
  );
}
