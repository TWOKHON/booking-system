"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { CompanyContent } from "@/data/company";
import { Button } from "@/components/ui/button";

export function CompanyHeroSection({
  about,
}: {
  about: CompanyContent["about"];
}) {
  return (
    <section className="mx-auto max-w-7xl px-3">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="max-w-4xl" data-animate="hero-copy">
          <p className="text-sm font-medium text-zinc-500">{about.eyebrow}</p>
          <h1 className="mt-6 text-5xl font-semibold text-zinc-950">
            {about.title}
          </h1>
          <div className="mt-8 space-y-6 text-base text-zinc-600">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-11 px-4">
              <Link href="/solution">
                Explore solution
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-4">
              <Link href="/ecosystem">View ecosystem</Link>
            </Button>
          </div>
        </div>

        <div className="relative h-100 w-full" data-animate="hero-image">
          <Image
            src="/bg.jpg"
            alt="Company Hero"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
