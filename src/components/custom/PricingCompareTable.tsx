"use client";

import {
  PRICING_PLANS,
  PRICING_FEATURES,
  PRICING_CATEGORIES,
} from "@/constants";
import type { FeatureValue } from "@/types";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <span className="size-5 bg-gray-900 flex items-center justify-center shrink-0">
          <Check className="size-3 text-white" strokeWidth={3} />
        </span>
      </div>
    );
  }

  if (value === false) {
    return (
      <div className="flex justify-center">
        <Minus className="size-4 text-gray-300" />
      </div>
    );
  }

  if (value === "limited") {
    return (
      <div className="flex justify-center">
        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5">
          Limited
        </span>
      </div>
    );
  }

  if (value === "preview") {
    return (
      <div className="flex justify-center">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5">
          Preview
        </span>
      </div>
    );
  }

  // Any other string value
  return (
    <div className="flex justify-center">
      <span className="text-xs text-gray-600 text-center leading-snug">
        {value}
      </span>
    </div>
  );
}

export function PricingCompareTable() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold">Compare plans</h3>
        <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">
          A detailed breakdown of everything included in each plan so you can
          find the right fit for your resort.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Sticky plan header row */}
          <thead>
            <tr>
              {/* Empty label column */}
              <th className="w-64 pb-6 text-left align-bottom">
                <p className="text-sm font-medium text-muted-foreground">
                  Features
                </p>
              </th>

              {PRICING_PLANS.map((plan) => (
                <th
                  key={plan.key}
                  className={cn(
                    "pb-6 px-4 text-center align-bottom min-w-36",
                    plan.featured && "relative",
                  )}
                >
                  <div
                    className={cn(
                      "py-4 px-3 flex flex-col items-center gap-1",
                      plan.featured
                        ? "border-2 border-dashed border-zinc-400 bg-zinc-50"
                        : "border border-gray-100 bg-gray-50",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {plan.name}
                      </span>
                      {plan.badge && (
                        <Badge className="text-[10px] px-1.5 py-0">
                          {plan.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {plan.isFree
                        ? "7-day trial"
                        : `₱${plan.price.toLocaleString()}/mo`}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {PRICING_CATEGORIES.map((category) => {
              const categoryFeatures = PRICING_FEATURES.filter(
                (f) => f.category === category,
              );

              return (
                <>
                  {/* Category header row */}
                  <tr key={`cat-${category}`}>
                    <td
                      colSpan={PRICING_PLANS.length + 1}
                      className="pt-8 pb-3"
                    >
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {category}
                      </span>
                    </td>
                  </tr>

                  {/* Feature rows */}
                  {categoryFeatures.map((feature, index) => (
                    <tr
                      key={feature.label}
                      className={cn(
                        "border-t border-gray-100",
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                      )}
                    >
                      {/* Feature label */}
                      <td className="py-3.5 pr-6">
                        <span className="text-sm text-gray-700">
                          {feature.label}
                        </span>
                      </td>

                      {/* Plan cells */}
                      {PRICING_PLANS.map((plan) => (
                        <td
                          key={plan.key}
                          className={cn(
                            "py-3.5 px-4",
                            plan.featured && "bg-zinc-50/60",
                          )}
                        >
                          <FeatureCell value={feature.values[plan.key]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
