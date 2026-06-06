"use client";

import { Slider } from "@/components/ui/slider";

type SliderFieldProps = {
  label?: string;
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export function SliderField({
  label,
  value,
  onChange,
  min = 0,
  max = 128,
  step = 1,
}: SliderFieldProps) {
  return (
    <div className="flex flex-col gap-2 py-2">
      {label && (
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="flex items-center gap-4">
        <Slider
          value={[value ?? 0]}
          onValueChange={(values) => onChange(values[0])}
          min={min}
          max={max}
          step={step}
          className="flex-1"
        />
        <span className="w-8 text-right text-xs font-mono text-muted-foreground">
          {value ?? 0}
        </span>
      </div>
    </div>
  );
}
