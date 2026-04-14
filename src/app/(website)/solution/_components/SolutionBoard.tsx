"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const GRID_TONES = [
  "bg-white",
  "bg-zinc-100",
  "bg-zinc-200",
  "bg-zinc-900",
  "bg-zinc-300",
  "bg-zinc-100",
  "bg-white",
  "bg-zinc-200",
  "bg-zinc-800",
  "bg-zinc-100",
];

const FEED_ITEMS = [
  "Inquiry converted to reserved",
  "Down payment received",
  "Guest record synced to operations",
];

const KPI_ITEMS = [
  ["42", "open inquiries"],
  ["18", "confirmed stays"],
  ["91%", "payment compliance"],
];

export function SolutionBoard() {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-animate='panel-main']",
        { y: 28, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7 },
      )
        .fromTo(
          "[data-animate='panel-side']",
          { x: 24, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.55, stagger: 0.08 },
          "-=0.42",
        )
        .fromTo(
          "[data-animate='grid-cell']",
          { scale: 0.72, opacity: 0, y: 8 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.32,
            stagger: { each: 0.04, from: "start" },
            ease: "back.out(1.5)",
          },
          "-=0.28",
        )
        .fromTo(
          "[data-animate='feed-card']",
          { x: -16, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.34,
            stagger: 0.08,
          },
          "-=0.18",
        );

      gsap.to("[data-animate='pulse-line']", {
        scaleX: 0.82,
        opacity: 0.45,
        duration: 1.1,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.12,
        transformOrigin: "left center",
      });

      gsap.to("[data-animate='kpi-card']", {
        y: -4,
        duration: 1.8,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.12,
      });

      gsap.to("[data-animate='website-shell']", {
        y: -6,
        duration: 2.1,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to("[data-animate='publish-chip']", {
        scale: 1.05,
        duration: 1.2,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: scopeRef },
  );

  return (
    <div
      ref={scopeRef}
      className="grid gap-4 lg:col-span-6 lg:grid-cols-[1.2fr_0.8fr]"
    >
      <div
        data-animate="panel-main"
        className="border border-zinc-200 bg-zinc-50 p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase text-zinc-500">
              Live reservations
            </p>
            <p className="mt-1 text-xl font-semibold text-zinc-950">
              Unified front desk view
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {GRID_TONES.map((tone, index) => (
            <div
              key={index}
              data-animate="grid-cell"
              className={`h-15  border border-zinc-200 shadow-sm ${tone}`}
            />
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {FEED_ITEMS.map((item) => (
            <div
              key={item}
              data-animate="feed-card"
              className=" border border-zinc-200 bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="size-2 bg-zinc-950" />
                <p className="text-sm text-zinc-700">{item}</p>
              </div>
              <div
                data-animate="pulse-line"
                className="mt-2 h-3 w-full bg-zinc-200"
              />
              <div
                data-animate="pulse-line"
                className="mt-2 h-3 w-50 bg-zinc-200"
              />
              <div
                data-animate="pulse-line"
                className="mt-2 h-3 w-80 bg-zinc-200"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div
          data-animate="panel-side"
          className="border border-zinc-200 bg-zinc-950 p-4 text-white"
        >
          <p className="text-xs uppercase text-zinc-400">KPI snapshot</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {KPI_ITEMS.map(([value, label]) => (
              <div
                key={label}
                data-animate="kpi-card"
                className=" bg-neutral-800 p-3"
              >
                <p className="text-2xl font-semibold">{value}</p>
                <p className="mt-1 text-[10px] uppercase text-zinc-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          data-animate="panel-side"
          className="border border-zinc-200 bg-white p-4"
        >
          <p className="text-sm font-medium text-zinc-950">
            Website and domain
          </p>
          <div
            data-animate="website-shell"
            className="mt-4 border border-zinc-200 bg-zinc-50 p-4"
          >
            <div className="h-24  bg-[linear-gradient(135deg,#18181b,#52525b)]" />
            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-950">
                  alrioprivateresort.resortcloud.com
                </p>
                <p className="text-xs text-zinc-500">Ready for custom domain</p>
              </div>
              <div
                data-animate="publish-chip"
                className="bg-zinc-950 px-3 py-1 text-[11px] text-white"
              >
                Publish
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
