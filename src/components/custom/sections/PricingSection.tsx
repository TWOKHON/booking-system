"use client";

import {
  PRICING_PLANS,
  YEARLY_DISCOUNT,
  PRICING_FEATURES,
} from "@/constants";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { useState } from "react";
import { FeatureValue } from "@/types";

function FeatureIcon() {
  return (
    <span className="size-4 bg-black flex items-center justify-center shrink-0">
      <Check className="size-2 text-white" strokeWidth={3} />
    </span>
  );
}

function FeatureLabel({
  value,
  label,
}: {
  value: FeatureValue;
  label: string;
}) {
  const isString = typeof value === "string";
  const isSpecial = value === "limited" || value === "preview";

  return (
    <div className="flex items-center gap-2.5">
      {value === true && <FeatureIcon />}
      {value === true && (
        <span className="text-sm text-gray-700">
          {label}
          {isString && !isSpecial && (
            <span className="ml-1 text-gray-400 font-normal">— {value}</span>
          )}
        </span>
      )}
    </div>
  );
}

export function PricingSection() {
  const [frequency, setFrequency] = useState<"monthly" | "yearly">("monthly");

  function getPrice(basePrice: number): number {
    if (frequency === "yearly") {
      return Math.round(basePrice * (1 - YEARLY_DISCOUNT));
    }
    return basePrice;
  }

  return (
    <section className="max-w-7xl flex flex-col items-center mx-auto px-6">
      <h3 className="text-4xl font-bold text-center">
        Simple, Transparent Pricing
      </h3>
      <p className="text-center mt-5">Choose a plan that works best for you.</p>
      <p className="text-center mb-10">No hidden fees.</p>

      <ToggleGroup
        value={frequency}
        onValueChange={(val) => {
          if (val) setFrequency(val as "monthly" | "yearly");
        }}
        type="single"
        variant="outline"
      >
        <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
        <ToggleGroupItem value="yearly">
          Yearly
          <span className="ml-2 text-xs font-medium text-green-700 bg-green-100 px-1.5 py-0.5">
            -20%
          </span>
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="mt-10 grid lg:grid-cols-4 gap-6 w-full">
        {PRICING_PLANS.map((plan) => {
          const displayPrice = getPrice(plan.price);

          return (
            <div
              key={plan.key}
              className={cn(
                "relative flex flex-col p-5",
                plan.featured ? "border-dashed border-zinc-400 border" : "",
              )}
            >
              <p className="text-base font-semibold text-gray-900">
                {plan.name}
              </p>
              {plan.badge && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
                  {plan.badge}
                </Badge>
              )}

              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-1 flex items-baseline gap-2">
                {plan.isFree ? (
                  <span className="text-4xl font-bold text-gray-900">Free</span>
                ) : (
                  <NumberFlow
                    className="text-4xl font-bold text-gray-900"
                    value={displayPrice}
                    format={{
                      style: "currency",
                      currency: "PHP",
                      maximumFractionDigits: 0,
                    }}
                  />
                )}
                <p className="text-xs text-muted-foreground">
                  {plan.isFree ? "7-day trial" : `/ ${frequency}`}
                </p>
              </div>

              {/* CTA */}
              <Button
                className="w-full mt-4 mb-6 h-11"
                variant={plan.featured ? "default" : "outline"}
              >
                {plan.cta}
              </Button>

              {/* "Everything in X, plus:" label */}
              {plan.includes && (
                <p className="text-xs font-medium text-gray-500 mb-4">
                  {plan.includes}
                </p>
              )}

              {/* Features */}
              <div className="space-y-2">
                {PRICING_FEATURES.map((feature) => {
                  const value = feature.values[plan.key];
                  return (
                    <FeatureLabel
                      key={feature.label}
                      value={value}
                      label={feature.label}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
