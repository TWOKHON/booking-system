"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const STATS = [
  { label: "Collected", value: "₱186,000", raw: 186000, prefix: "₱", suffix: "" },
  { label: "Pending review", value: "7 entries", raw: 7, prefix: "", suffix: " entries" },
  { label: "Payroll sync", value: "Ready", raw: null, prefix: "", suffix: "" },
];

const STEPS = ["With Ops", "Admin", "Deposited", "Verified"];
const BAR_HEIGHTS = [26, 40, 32, 48, 36];
const PROGRESS_VALUES = [82, 64, 91];
const DEPARTMENTS = ["Operations", "Finance", "HR"];

function useCountUp(
  ref: React.RefObject<HTMLElement | null>,
  target: number,
  duration = 1.2,
  delay = 0
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || target === null) return;

    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent =
          target >= 1000
            ? "₱" + Math.round(obj.val).toLocaleString()
            : Math.round(obj.val) + (target <= 10 ? " entries" : "%");
      },
    });
  }, [ref, target, duration, delay]);
}

function StatCard({
  label,
  value,
  raw,
  delay,
}: {
  label: string;
  value: string;
  raw: number | null;
  delay: number;
}) {
  const valRef = useRef<HTMLParagraphElement>(null);
  useCountUp(valRef as React.RefObject<HTMLElement>, raw ?? 0, 1.4, delay);

  return (
    <div
      className="stat-card  border border-zinc-200 bg-white p-3 shadow-sm"
      style={{ opacity: 0 }}
    >
      <p className="text-[10px] uppercase text-zinc-500">{label}</p>
      {raw !== null ? (
        <p ref={valRef} className="text-sm font-semibold text-zinc-950">
          0
        </p>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping  bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-1.5  bg-emerald-500" />
          </span>
          <p className="text-sm font-semibold text-zinc-950">{value}</p>
        </div>
      )}
    </div>
  );
}

export default function CashFlowLifecycle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveringRef = useRef(false);

  useGSAP(
    () => {
      const statCards = statsRef.current?.querySelectorAll<HTMLElement>(".stat-card");
      const stepEls = stepsRef.current?.querySelectorAll<HTMLElement>(".step-box");
      const connectors = stepsRef.current?.querySelectorAll<HTMLElement>(".connector");
      const bars = barsRef.current?.querySelectorAll<HTMLElement>(".bar");
      const progressBars = progressRef.current?.querySelectorAll<HTMLElement>(".progress-fill");

      if (
        !cardRef.current ||
        !statCards?.length ||
        !stepEls?.length ||
        !connectors?.length ||
        !bars?.length ||
        !progressBars?.length
      ) {
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        cardRef.current,
        { y: 30, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.65 }
      );

      tl.fromTo(
        statCards,
        { y: -18, opacity: 0, scale: 0.93 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: { each: 0.1, from: "start" },
          ease: "back.out(1.3)",
        },
        "-=0.3"
      );

      tl.fromTo(
        stepEls,
        { scale: 0.75, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.32,
          stagger: 0.08,
          ease: "back.out(1.6)",
        },
        "-=0.1"
      );

      tl.fromTo(
        connectors,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.35,
          stagger: 0.09,
          ease: "power2.out",
        },
        "-=0.2"
      );

      tl.fromTo(
        bars,
        { scaleY: 0, transformOrigin: "bottom center", opacity: 0 },
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.45,
          stagger: { each: 0.07, from: "start" },
          ease: "power3.out",
        },
        "-=0.15"
      );

      tl.fromTo(
        progressBars,
        { width: "0%" },
        {
          width: (i) => `${PROGRESS_VALUES[i]}%`,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        },
        "-=0.3"
      );
    },
    { scope: containerRef }
  );

  const animateBars = useCallback(() => {
    const bars = barsRef.current?.querySelectorAll<HTMLElement>(".bar");
    if (!bars?.length) return;

    gsap.fromTo(
      bars,
      { scaleY: 0, transformOrigin: "bottom center" },
      {
        scaleY: 1,
        duration: 0.5,
        stagger: { each: 0.07, from: "random" },
        ease: "elastic.out(1, 0.6)",
        overwrite: true,
      }
    );
  }, []);

  const cycleStep = useCallback(() => {
    const stepEls = stepsRef.current?.querySelectorAll<HTMLElement>(".step-box");
    if (!stepEls?.length) return;

    const prev = activeStepRef.current;
    const next = (prev + 1) % STEPS.length;

    activeStepRef.current = next;
    setActiveStep(next);

    gsap.fromTo(
      stepEls[next],
      { scale: 0.88, opacity: 0.6 },
      { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" }
    );

    if (stepEls[prev]) {
      gsap.to(stepEls[prev], {
        scale: 0.97,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(stepEls[prev], { scale: 1, duration: 0.2 });
        },
      });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;

    animateBars();
    cycleStep();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (isHoveringRef.current) {
        cycleStep();
      }
    }, 1800);
  }, [animateBars, cycleStep]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setActiveStep(0);
    activeStepRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-96 overflow-hidden border border-zinc-200 bg-zinc-50 p-5 md:min-h-115"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative z-10 h-full">
        <div ref={statsRef} className="absolute inset-x-7 top-3 z-50 grid gap-3 sm:grid-cols-3">
          {STATS.map(({ label, value, raw }, i) => (
            <StatCard
              key={label}
              label={label}
              value={value}
              raw={raw}
              delay={0.4 + i * 0.12}
            />
          ))}
        </div>

        <div
          ref={cardRef}
          className="absolute inset-x-7 top-23 border border-zinc-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-zinc-950">Cash flow lifecycle</p>
              <p className="text-xs text-zinc-500">Operations to bank verification</p>
            </div>
            <div className="flex items-center gap-1.5  bg-zinc-950 px-3 py-1">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping  bg-zinc-400 opacity-60" />
                <span className="relative inline-flex size-1.5  bg-white" />
              </span>
              <span className="text-[11px] text-white">Live status</span>
            </div>
          </div>

          <div ref={stepsRef} className="mt-5 flex items-center gap-2">
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-1 items-center gap-2">
                <div
                  className={`step-box flex h-10 w-full items-center justify-center  border px-2 text-[11px] font-medium transition-colors duration-300 ${
                    activeStep === i
                      ? "border-zinc-900 bg-zinc-950 text-white"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700"
                  }`}
                  style={{ opacity: 0 }}
                >
                  {step}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="connector h-px flex-1 bg-zinc-300"
                    style={{ transformOrigin: "left center" }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className=" border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-xs font-medium text-zinc-900">Petty cash requests</p>
              <div ref={barsRef} className="mt-3 flex items-end gap-2">
                {BAR_HEIGHTS.map((height, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="bar w-full bg-zinc-900/85"
                      style={{ height, transformOrigin: "bottom center" }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[9px] text-zinc-400">
                {["M", "T", "W", "T", "F"].map((d) => (
                  <span key={d} className="flex-1 text-center">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className=" border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-xs font-medium text-zinc-900">Attendance summary</p>
              <div ref={progressRef} className="mt-3 space-y-2.5">
                {PROGRESS_VALUES.map((value, i) => (
                  <div key={i}>
                    <div className="mb-1 flex justify-between text-[10px] text-zinc-500">
                      <span>{DEPARTMENTS[i]}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden  bg-zinc-200">
                      <div
                        className="progress-fill h-2  bg-zinc-900"
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}