"use client";

import { createElement } from "react";
import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Predefined list of popular icons to avoid a massive list
const popularIcons = [
  "ArrowRight",
  "BarChart3",
  "CalendarDays",
  "Check",
  "Mail",
  "MapPin",
  "MessageSquare",
  "Sparkles",
  "Star",
  "Layout",
  "Zap",
  "Shield",
  "Clock",
  "Smile",
  "Settings",
  "Search",
  "Heart",
  "Home",
  "Users",
  "Phone",
  "Globe",
  "Book",
  "Camera",
  "Music",
  "Briefcase",
  "CreditCard",
  "Info",
  "ExternalLink",
] as const;

function getLucideIcon(name?: string): LucideIcon | null {
  if (!name) return null;

  const candidate = LucideIcons[name as keyof typeof LucideIcons];

  return typeof candidate === "function" ? (candidate as LucideIcon) : null;
}

type IconFieldProps = {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
};

export function IconField({ value, onChange, label }: IconFieldProps) {
  const SelectedIcon = getLucideIcon(value);

  return (
    <div className="flex flex-col gap-2 py-2">
      {label && (
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an icon">
            <div className="flex items-center gap-2">
              {SelectedIcon ? (
                <div className="size-4">
                  {createElement(SelectedIcon, { className: "size-full" })}
                </div>
              ) : null}
              <span>{value || "Select icon"}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {popularIcons.map((iconName) => {
            const Icon = getLucideIcon(iconName);

            if (!Icon) return null;

            return (
              <SelectItem key={iconName} value={iconName}>
                <div className="flex items-center gap-2">
                  <Icon className="size-4" />
                  <span>{iconName}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
