"use client";

import { ADD_ONS } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Building2,
  Users,
  Sparkles,
  Palette,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import NumberFlow from "@number-flow/react";

const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Building2,
  Users,
  Sparkles,
  Palette,
  Headphones,
};

export function AddOnsSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">
      {/* Header */}
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold">Add-ons</h3>
        <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">
          Extend your plan with optional features. Add-ons can be attached to
          any active subscription at any time.
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ADD_ONS.map((addon) => {
          const Icon = ICON_MAP[addon.icon];

          return (
            <div
              key={addon.key}
              className="relative flex flex-col gap-4 border border-gray-200 p-6"
            >
              {/* Badge */}
              {addon.badge && (
                <Badge className="absolute top-5 right-5">{addon.badge}</Badge>
              )}

              {/* Icon + Name */}
              <div className="flex items-center gap-3">
                <span className="size-9 bg-gray-100 flex items-center justify-center shrink-0">
                  {Icon && <Icon className="size-4 text-gray-700" />}
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {addon.name}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {addon.description}
              </p>

              {/* Price + CTA */}
              <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <div className="flex items-baseline gap-1">
                    <NumberFlow
                      className="text-lg font-bold text-gray-900"
                      value={addon.price}
                      format={{
                        style: "currency",
                        currency: "PHP",
                        maximumFractionDigits: 0,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {addon.priceNote}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Add to plan
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}