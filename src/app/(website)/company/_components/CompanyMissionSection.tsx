"use client";

import type { CompanyContent } from "@/data/company";

export function CompanyMissionSection({
  mission,
}: {
  mission: CompanyContent["mission"];
}) {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-3" data-animate="section">
      <div className="grid gap-10 border-y border-zinc-200 py-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h2 className="text-4xl font-bold text-zinc-950">
            {mission.title}
          </h2>
          <div className="mt-8 h-px w-12 bg-zinc-300" />
          <p className="mt-8 max-w-xl text-lg text-zinc-600 italic">
            {mission.quote}
          </p>
        </div>

        <div>
          <div className="space-y-5 text-base text-zinc-600">
            {mission.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 grid gap-6 border-t border-zinc-200 pt-8 md:grid-cols-2">
            {mission.metrics.map((metric) => (
              <div key={metric.label}>
                <p className="text-3xl font-bold text-zinc-950">
                  {metric.value}
                </p>
                <p className="mt-3 text-xs text-zinc-500">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
