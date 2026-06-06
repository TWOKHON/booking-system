"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ExternalImageField = ({
  value,
  onChange,
  label = "Image URL",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) => {
  return (
    <div className="flex flex-col gap-2 py-2">
      <Label className="text-[13px] font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="flex flex-col gap-3">
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="h-8 text-[13px]"
        />
        {value && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/400x225?text=Invalid+Image+URL";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
