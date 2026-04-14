"use client";

import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { PEOPLE, TESTIMONIALS } from "@/constants";
import { ThreeDMarquee } from "@/components/animated-ui/3DMarquee";
import { AnimatedTooltip } from "@/components/animated-ui/AnimatedTooltip";

export function TestimonialSection() {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-start overflow-hidden">
      <div
        className={cn(
          "absolute inset-0",
          "bg-size-[20px_20px]",
          "bg-[radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:bg-[radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
      {/* Center content with backdrop so it's readable over cards */}
      <div className="relative z-20 flex flex-col items-center px-6 py-5 bg-white/90">
        <h2 className="mx-auto max-w-4xl text-center text-2xl font-bold text-balance md:text-4xl lg:text-6xl">
          Loved by resort owners running smarter operations
        </h2>
        <p className="mx-auto max-w-2xl py-8 text-center text-sm text-black/80 md:text-base">
          Hear from those who trust a single platform to manage bookings,
          operations, and guest experiences—all in one place.
        </p>
        <div className="flex flex-row items-center justify-center mb-10 w-full">
          <AnimatedTooltip items={PEOPLE} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="h-11 px-4">
            Read all reviews <ArrowRightIcon />
          </Button>
        </div>
      </div>

      {/* Edge fades */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 20%, white 75%)",
        }}
      />

      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        testimonials={TESTIMONIALS}
      />
    </section>
  );
}
