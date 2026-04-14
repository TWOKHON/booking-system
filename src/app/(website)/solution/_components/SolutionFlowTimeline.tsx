"use client";

import { useRef } from "react";
import {
  CalendarRange,
  Globe,
  Link2,
  MessageSquareText,
  Sparkles,
  Wallet,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { Timeline } from "@/components/animated-ui/Timeline";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

type WorkflowItem = {
  stage: string;
  title: string;
  body: string;
};

export function SolutionFlowTimeline({
  workflow,
}: {
  workflow: WorkflowItem[];
}) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const visuals = gsap.utils.toArray<HTMLElement>("[data-stage-visual]");

      visuals.forEach((visual) => {
        const stage = visual.dataset.stage;
        const badge = visual.querySelector<HTMLElement>('[data-animate="badge"]');
        const card = visual.querySelector<HTMLElement>('[data-animate="card"]');
        const pill = visual.querySelector<HTMLElement>('[data-animate="pill"]');
        const lines = visual.querySelectorAll<SVGPathElement>('[data-animate="line"]');
        const centerNode = visual.querySelector<HTMLElement>('[data-animate="center-node"]');
        const topCard = visual.querySelector<HTMLElement>('[data-animate="top-card"]');

        if (lines.length > 0) {
          gsap.fromTo(
            lines,
            { strokeDashoffset: 0 },
            {
              strokeDashoffset: -48,
              duration: 1.8,
              ease: "none",
              repeat: -1,
              stagger: 0.08,
            },
          );
        }

        if (centerNode) {
          gsap.to(centerNode, {
            scale: 1.08,
            duration: 1.2,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
          });
        }

        if (stage === "Capture" && card) {
          const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.1 });
          if (badge) gsap.set(badge, { autoAlpha: 0, y: 10, scale: 0.96 });
          if (pill) gsap.set(pill, { autoAlpha: 0, y: 12, scale: 0.96 });
          gsap.set(card, { y: 0 });
          tl.to(card, { y: 34, duration: 0.75, ease: "power3.inOut", delay: 0.25 })
            .to(
              badge,
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.5)" },
              0.32,
            )
            .to(
              pill,
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.5)" },
              0.48,
            )
            .to({}, { duration: 1.2 })
            .to([badge, pill], {
              autoAlpha: 0,
              y: 10,
              scale: 0.96,
              duration: 0.28,
              ease: "power2.in",
            })
            .to(card, { y: 0, duration: 0.55, ease: "power3.inOut" }, "-=0.1");
        }

        if (stage === "Lock" && card) {
          const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.1 });
          if (badge) gsap.set(badge, { autoAlpha: 0, y: 10, scale: 0.96 });
          gsap.set(card, { y: 0 });
          tl.to(card, { y: 28, duration: 0.7, ease: "power3.inOut", delay: 0.3 })
            .to(
              badge,
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: "back.out(1.5)" },
              0.38,
            )
            .to({}, { duration: 1.2 })
            .to(badge, {
              autoAlpha: 0,
              y: 10,
              scale: 0.96,
              duration: 0.25,
              ease: "power2.in",
            })
            .to(card, { y: 0, duration: 0.5, ease: "power3.inOut" }, "-=0.05");
        }

        if (stage === "Optimize" && card) {
          const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.1 });
          if (pill) gsap.set(pill, { autoAlpha: 0, y: 12, scale: 0.97 });
          gsap.set(card, { y: 0 });
          tl.to(card, { y: 26, duration: 0.72, ease: "power3.inOut", delay: 0.25 })
            .to(
              pill,
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: "back.out(1.6)" },
              0.42,
            )
            .to({}, { duration: 1.2 })
            .to(pill, {
              autoAlpha: 0,
              y: 12,
              scale: 0.97,
              duration: 0.25,
              ease: "power2.in",
            })
            .to(card, { y: 0, duration: 0.5, ease: "power3.inOut" }, "-=0.05");
        }

        if (stage === "Deploy" && card) {
          const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.15 });
          if (badge) gsap.set(badge, { autoAlpha: 0, y: 10, scale: 0.96 });
          if (pill) gsap.set(pill, { autoAlpha: 0, y: 10, scale: 0.96 });
          gsap.set(card, { y: 0 });
          tl.to(card, { y: 24, duration: 0.72, ease: "power3.inOut", delay: 0.3 })
            .to(
              badge,
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.38, ease: "back.out(1.5)" },
              0.35,
            )
            .to(
              pill,
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.38, ease: "back.out(1.5)" },
              0.5,
            )
            .to({}, { duration: 1.15 })
            .to([badge, pill], {
              autoAlpha: 0,
              y: 10,
              scale: 0.96,
              duration: 0.24,
              ease: "power2.in",
            })
            .to(card, { y: 0, duration: 0.5, ease: "power3.inOut" }, "-=0.05");
        }

        if (stage === "Unify" && topCard) {
          gsap.fromTo(
            topCard,
            { y: 4 },
            {
              y: -4,
              duration: 1.6,
              ease: "power1.inOut",
              repeat: -1,
              yoyo: true,
            },
          );
        }
      });
    },
    { scope: scopeRef },
  );

  const renderStageVisual = (stage: string) => {
    if (stage === "Capture") {
      return (
        <div
          data-stage-visual
          data-stage="Capture"
          className="relative min-h-56 overflow-hidden border border-zinc-200 bg-zinc-50 p-4"
        >
          <div
            data-animate="badge"
            className="absolute right-4 top-4 border border-zinc-200 bg-white px-3 py-1 text-[11px] text-zinc-600 shadow-sm"
          >
            New inquiry
          </div>
          <div
            data-animate="card"
            className="absolute inset-x-5 top-8 border border-zinc-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-zinc-950 p-2 text-white">
                <MessageSquareText className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-950">
                  Website inquiry
                </p>
                <p className="text-xs text-zinc-500">
                  Family stay • 2 nights • May 12
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {["Priority scored", "Assigned to sales", "Follow-up queued"].map(
                (label) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border border-zinc-200 bg-zinc-50 px-3 py-2"
                  >
                    <span className="text-xs text-zinc-600">{label}</span>
                    <div className="h-2 w-12 rounded-full bg-zinc-200" />
                  </div>
                ),
              )}
            </div>
          </div>
          <div
            data-animate="pill"
            className="absolute bottom-4 left-5 border border-zinc-200 bg-white px-3 py-1 text-[11px] text-zinc-600 shadow-sm"
          >
            Lead captured and ready
          </div>
        </div>
      );
    }

    if (stage === "Lock") {
      return (
        <div
          data-stage-visual
          data-stage="Lock"
          className="relative min-h-56 overflow-hidden border border-zinc-200 bg-zinc-50 p-4"
        >
          <div
            data-animate="card"
            className="absolute inset-x-5 top-6 border border-zinc-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-950">
                  Reservation checkpoint
                </p>
                <p className="text-xs text-zinc-500">
                  Availability, invoice, and payment
                </p>
              </div>
              <CalendarRange className="size-4 text-zinc-500" />
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {[
                "bg-zinc-100",
                "bg-white",
                "bg-zinc-200",
                "bg-zinc-900",
                "bg-zinc-100",
              ].map((tone, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-10 border border-zinc-200 shadow-sm",
                    tone,
                  )}
                />
              ))}
            </div>
            <div className="mt-4 border border-zinc-200 bg-zinc-50 px-3 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600">50% down payment</span>
                <Wallet className="size-4 text-zinc-500" />
              </div>
              <div className="mt-3 h-2 bg-zinc-200">
                <div className="h-2 w-[72%] bg-zinc-900" />
              </div>
            </div>
          </div>
          <div
            data-animate="badge"
            className="absolute right-4 top-4 border border-zinc-200 bg-white px-3 py-1 text-[11px] text-zinc-600 shadow-sm"
          >
            Payment link sent
          </div>
        </div>
      );
    }

    if (stage === "Unify") {
      return (
        <div
          data-stage-visual
          data-stage="Unify"
          className="relative min-h-56 overflow-hidden border border-zinc-200 bg-zinc-50 p-4"
        >
          <div
            data-animate="top-card"
            className="absolute inset-x-5 top-6 border border-zinc-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
          >
            <div className="relative h-40">
              <div className="absolute left-49 top-2 border border-zinc-200 bg-white p-3 shadow-sm">
                <MessageSquareText className="size-4 text-zinc-600" />
              </div>
              <div className="absolute right-49 top-2 border border-zinc-200 bg-white p-3 shadow-sm">
                <Wallet className="size-4 text-zinc-600" />
              </div>
              <div className="absolute left-1/2 top-0 -translate-x-1/2 border border-zinc-200 bg-white p-3 shadow-sm">
                <Globe className="size-4 text-zinc-600" />
              </div>
              <div
                data-animate="center-node"
                className="absolute left-1/2 top-18 -translate-x-1/2 border border-zinc-200 bg-zinc-950 p-3 text-white shadow-sm"
              >
                <Link2 className="size-4" />
              </div>
              <svg
                viewBox="0 0 300 140"
                className="absolute inset-0 h-full w-full text-zinc-300"
                aria-hidden="true"
              >
                <path
                  data-animate="line"
                  d="M45 30 C90 30 104 58 150 86"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  data-animate="line"
                  d="M150 18 C150 36 150 53 150 86"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  data-animate="line"
                  d="M255 30 C210 30 196 58 150 86"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <svg
                viewBox="0 0 300 140"
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="solution-flow-gradient"
                    x1="32"
                    y1="18"
                    x2="260"
                    y2="92"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#e5e7eb" />
                    <stop offset="55%" stopColor="#52525b" />
                    <stop offset="100%" stopColor="#09090b" />
                  </linearGradient>
                </defs>
                <path
                  d="M45 30 C90 30 104 58 150 86"
                  fill="none"
                  stroke="url(#solution-flow-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="12 12"
                  className="animate-[flow-line_1.8s_linear_infinite]"
                />
                <path
                  d="M150 18 C150 36 150 53 150 86"
                  fill="none"
                  stroke="url(#solution-flow-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="12 12"
                  className="animate-[flow-line_1.8s_linear_infinite]"
                />
                <path
                  d="M255 30 C210 30 196 58 150 86"
                  fill="none"
                  stroke="url(#solution-flow-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="12 12"
                  className="animate-[flow-line_1.8s_linear_infinite]"
                />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    if (stage === "Optimize") {
      return (
        <div
          data-stage-visual
          data-stage="Optimize"
          className="relative min-h-56 overflow-hidden border border-zinc-200 bg-zinc-50 p-4"
        >
          <div
            data-animate="card"
            className="absolute inset-x-5 top-6 border border-zinc-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-950">
                Forecast overview
              </p>
              <Sparkles className="size-4 text-zinc-500" />
            </div>
            <div className="mt-4 flex items-end gap-2">
              {[32, 46, 38, 58, 49, 64].map((height) => (
                <div
                  key={height}
                  className="w-8 bg-zinc-900/90"
                  style={{ height }}
                />
              ))}
            </div>
          </div>
          <div
            data-animate="pill"
            className="absolute bottom-5 left-5 right-5 border border-zinc-200 bg-white px-4 py-4 shadow-sm"
          >
            <p className="text-xs uppercase text-zinc-500">
              Recommendation
            </p>
            <p className="mt-2 text-sm text-zinc-700">
              Increase weekday promotions for May and push direct bookings on
              your highest-converting channel.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        data-stage-visual
        data-stage="Deploy"
        className="relative min-h-56 overflow-hidden border border-zinc-200 bg-zinc-50 p-4"
      >
        <div
          data-animate="badge"
          className="absolute right-4 top-4 border border-zinc-200 bg-white px-3 py-1 text-[11px] text-zinc-600 shadow-sm"
        >
          domain connected
        </div>
        <div
          data-animate="card"
          className="absolute inset-x-5 top-8 border border-zinc-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
        >
          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <div className="h-20 bg-[linear-gradient(135deg,#18181b,#52525b)]" />
            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-950">
                  Public booking website
                </p>
                <p className="text-xs text-zinc-500">
                  Live with branded domain
                </p>
              </div>
              <Globe className="size-4 text-zinc-500" />
            </div>
          </div>
        </div>
        <div
          data-animate="pill"
          className="absolute bottom-5 left-5 border border-zinc-200 bg-white px-3 py-1 text-[11px] text-zinc-600 shadow-sm"
        >
          Guest flow deployed
        </div>
      </div>
    );
  };

  const data = workflow.map((item, index) => ({
    title: item.stage,
    content: (
      <div className="border border-zinc-200 bg-white p-5 shadow-lg shadow-zinc-900/5">
        <div className="grid gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium uppercase text-zinc-500">
                Stage {String(index + 1).padStart(2, "0")}
              </div>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-zinc-950">
              {item.title}
            </h3>
            <p className="mt-2 text-base text-muted-foreground">
              {item.body}
            </p>
          </div>
          {renderStageVisual(item.stage)}
        </div>
      </div>
    ),
  }));

  return (
    <div ref={scopeRef}>
      <Timeline
        data={data}
        heading="One journey from inquiry to growth"
        description="ResortCloud is not just a list of modules. It is a connected workflow that supports how demand arrives, how bookings are confirmed, how properties are run, and how businesses scale."
        className="bg-transparent px-0 md:px-0"
        introClassName="px-0 pt-0 pb-0 md:px-0 lg:px-0"
      />
    </div>
  );
}
