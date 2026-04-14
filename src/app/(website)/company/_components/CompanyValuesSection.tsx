"use client";

import { Building2, Compass, Globe, ShieldCheck } from "lucide-react";

import type { CompanyContent } from "@/data/company";

const principleIcons = [Compass, ShieldCheck, Globe, Building2] as const;

export function CompanyValuesSection({
  valuesIntro,
  principles,
}: {
  valuesIntro: CompanyContent["valuesIntro"];
  principles: CompanyContent["principles"];
}) {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-3" data-animate="section">
      <div className="grid gap-12 lg:grid-cols-[0.90fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            {valuesIntro.eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl font-bold text-zinc-950">
            {valuesIntro.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base text-zinc-600">
            {valuesIntro.description}
          </p>

          <div className="mt-7 grid gap-6 sm:grid-cols-3">
            {valuesIntro.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-zinc-950">{stat.value}</p>
                <p className="mt-2 text-xs text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {principles.map((principle, index) => {
            const Icon = principleIcons[index];

            return (
              <div
                key={principle.id}
                className="border border-zinc-200 bg-zinc-50 p-4 shadow-sm shadow-zinc-900/5"
                data-animate="float-card"
              >
                <div className="flex size-11 items-center justify-center border border-zinc-200 bg-white text-zinc-900">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-zinc-950">
                  {principle.title}
                </h3>
                <p className="mt-4 text-sm text-zinc-600">{principle.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
