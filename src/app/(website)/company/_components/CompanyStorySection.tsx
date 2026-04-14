"use client";

import Image from "next/image";

import type { CompanyContent } from "@/data/company";

export function CompanyStorySection({
  story,
}: {
  story: CompanyContent["story"];
}) {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-3" data-animate="section">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-900/5 md:p-8">
          <p className="text-sm text-zinc-500">Company story</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-bold text-zinc-950">
            {story.title}
          </h2>
          <div className="mt-6 space-y-5 text-base text-zinc-600">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                src: "/thumbnails/inquiries.png",
                alt: "Inquiry workflow preview",
              },
              {
                src: "/thumbnails/asset.png",
                alt: "Operations and asset workflow preview",
              },
            ].map((item) => (
              <div
                key={item.src}
                className="overflow-hidden border border-zinc-200 bg-zinc-50 p-2"
                data-animate="float-card"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-zinc-200 bg-zinc-50 p-6 shadow-lg shadow-zinc-900/5 md:p-8">
          <p className="text-sm text-zinc-500">Our stance</p>
          <p className="mt-6 text-3xl font-semibold text-zinc-950">
            {story.callout}
          </p>
          <div className="mt-8 space-y-3 border-t border-zinc-200 pt-6">
            <div className="flex items-center justify-between text-sm text-zinc-600">
              <span>What that means</span>
              <span>Fewer silos</span>
            </div>
            <div className="flex items-center justify-between text-sm text-zinc-600">
              <span>What we optimize for</span>
              <span>Team coordination</span>
            </div>
            <div className="flex items-center justify-between text-sm text-zinc-600">
              <span>What we refuse</span>
              <span>Feature clutter</span>
            </div>
          </div>
          <div
            className="mt-8 border border-zinc-200 bg-white p-4"
            data-animate="float-card"
          >
            <div className="grid gap-3">
              <div className="flex items-center justify-between border-b border-dashed border-zinc-200 pb-3">
                <span className="text-xs uppercase text-zinc-500">
                  Product lens
                </span>
                <span className="text-sm text-zinc-700">Operational UX</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-zinc-200 pb-3">
                <span className="text-xs uppercase text-zinc-500">
                  Team lens
                </span>
                <span className="text-sm text-zinc-700">
                  Cross-role workflows
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-zinc-500">
                  Growth lens
                </span>
                <span className="text-sm text-zinc-700">
                  Scalable foundations
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
