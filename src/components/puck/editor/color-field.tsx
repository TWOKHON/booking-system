"use client";

import { Input } from "@/components/ui/input";

type ColorFieldProps = {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
};

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

export function ColorField({ id, value, onChange, label }: ColorFieldProps & { label?: string }) {
  const colorValue = value && hexColorPattern.test(value) ? value : "#ffffff";

  return (
    <div className="flex flex-col gap-2 py-2">
      {label && (
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <Input
          aria-label="Pick color"
          className="h-9 w-12 shrink-0 cursor-pointer p-1"
          type="color"
          value={colorValue}
          onChange={(event) => onChange(event.target.value)}
        />
        <Input
          id={id}
          value={value || ""}
          placeholder="#dce8f5"
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}
