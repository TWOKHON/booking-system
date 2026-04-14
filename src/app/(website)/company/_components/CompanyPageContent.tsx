"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import type { CompanyContent } from "@/data/company";
import { FaqsSection } from "@/components/custom/sections/FaqsSection";
import { CompanyHeroSection } from "./CompanyHeroSection";
import { CompanyMissionSection } from "./CompanyMissionSection";
import { CompanyValuesSection } from "./CompanyValuesSection";
import { CompanyStorySection } from "./CompanyStorySection";
import { CompanyTeamSection } from "./CompanyTeamSection";
import { CompanyCareersSection } from "./CompanyCareersSection";

gsap.registerPlugin(useGSAP);

export function CompanyPageContent({
  content,
}: {
  content: CompanyContent;
}) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-animate='hero-copy'] > *",
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.62, stagger: 0.08 },
      ).fromTo(
        "[data-animate='hero-image']",
        { x: 28, opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, duration: 0.82 },
        "-=0.38",
      );

      gsap.fromTo(
        "[data-animate='section']",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          stagger: 0.1,
          ease: "power3.out",
        },
      );

      gsap.to("[data-animate='float-card']", {
        y: (index) => (index % 2 === 0 ? -6 : 6),
        duration: 2.8,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.12,
      });

      gsap.to("[data-animate='team-card']", {
        y: (index) => (index % 2 === 0 ? -8 : 8),
        duration: 3,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.15,
      });

      gsap.to("[data-animate='role-card']", {
        x: 3,
        duration: 2.2,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.08,
      });
    },
    { scope: scopeRef },
  );

  return (
    <main className="overflow-hidden bg-white pt-15 pb-24" ref={scopeRef}>
      <CompanyHeroSection about={content.about} />
      <CompanyMissionSection mission={content.mission} />
      <CompanyValuesSection
        valuesIntro={content.valuesIntro}
        principles={content.principles}
      />
      <CompanyStorySection story={content.story} />
      <CompanyTeamSection team={content.team} />
      <CompanyCareersSection careers={content.careers} team={content.team} />

      <FaqsSection />
    </main>
  );
}
