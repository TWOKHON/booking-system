"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { PricingSection } from "@/components/custom/sections/PricingSection";
import { HeroSection } from "@/components/custom/sections/HeroSection";
import { BrandSection } from "@/components/custom/sections/BrandSection";
import { FeatureSection } from "@/components/custom/sections/FeatureSection";
import { TestimonialSection } from "@/components/custom/sections/TestimonialSection";
import { FaqsSection } from "@/components/custom/sections/FaqsSection";
import { CtaSection } from "@/components/custom/sections/CtaSection";

export default function Home() {
  return (
    <div>
      <div className="max-w-7xl px-6 mx-auto pt-15">
        <HeroSection />
        <BrandSection />
        <FeatureSection />
      </div>
      <TestimonialSection />
      <PricingSection />
      {/* View full comparison */}
      <div className="mt-10 flex justify-center">
        <Button size="lg" variant="outline">
          View full plan comparison
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
      <FaqsSection />
      <CtaSection />
    </div>
  );
}
