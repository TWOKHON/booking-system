/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const SECTIONS = [
  { id: "hero", label: "Hero", icon: "▣" },
  { id: "rooms", label: "Rooms", icon: "⊞" },
  { id: "gallery", label: "Gallery", icon: "⊡" },
];

export default function WebsiteBuilder() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const livePillRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const section0Ref = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const publishRef = useRef<HTMLDivElement>(null);
  const bottomCard0Ref = useRef<HTMLDivElement>(null);
  const bottomCard1Ref = useRef<HTMLDivElement>(null);

  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [publishState, setPublishState] = useState<
    "idle" | "publishing" | "done"
  >("idle");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const publishIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const publishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const publishResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isHoveringRef = useRef(false);
  const isPublishingRef = useRef(false);
  const demoIndexRef = useRef(0);

  const sectionRefs = [section0Ref, section1Ref, section2Ref];

  // ── Entrance ──────────────────────────────────────────────────────────────
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        cardRef.current,
        { y: 22, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6 },
      ).fromTo(
        livePillRef.current,
        { x: 16, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.3",
      );

      tl.fromTo(
        heroRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 1 },
        { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power2.inOut" },
        "-=0.1",
      );

      tl.fromTo(
        [section0Ref.current, section1Ref.current, section2Ref.current],
        { y: -12, opacity: 0, scale: 0.88 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.36,
          stagger: 0.1,
          ease: "back.out(1.5)",
        },
        "-=0.2",
      );

      // Keep only if you really plan to render these refs later
      if (bottomCard0Ref.current || bottomCard1Ref.current) {
        tl.fromTo(
          [bottomCard0Ref.current, bottomCard1Ref.current].filter(Boolean),
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.38,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.15",
        );
      }
    },
    { scope: containerRef },
  );

  // ── Drag simulation ────────────────────────────────────────────────────────
  const simulateDrag = useCallback((idx: number) => {
    const sourceEl = sectionRefs[idx]?.current;
    const ghostEl = ghostRef.current;
    const dropzoneEl = dropzoneRef.current;
    const containerEl = containerRef.current;

    if (!sourceEl || !ghostEl || !dropzoneEl || !containerEl) return;

    setDraggingIdx(idx);

    const sourceRect = sourceEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();
    const dropRect = dropzoneEl.getBoundingClientRect();

    const ghostWidth = sourceRect.width;
    const ghostHeight = sourceRect.height;

    // Start position from source card
    const startX = sourceRect.left - containerRect.left;
    const startY = sourceRect.top - containerRect.top;

    // End position at center of dropzone
    const endX =
      dropRect.left - containerRect.left + (dropRect.width - ghostWidth) / 2;
    const endY =
      dropRect.top - containerRect.top + (dropRect.height - ghostHeight) / 2;

    gsap.set(ghostEl, {
      x: startX,
      y: startY,
      width: ghostWidth,
      height: ghostHeight,
      opacity: 0,
      scale: 1,
      display: "flex",
    });

    gsap.to(sourceEl, {
      opacity: 0.3,
      scale: 0.94,
      duration: 0.2,
      overwrite: true,
    });

    gsap.to(dropzoneEl, {
      borderColor: "#71717a",
      backgroundColor: "#f4f4f5",
      duration: 0.25,
      overwrite: true,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setDraggingIdx(null);

        gsap.set(ghostEl, { display: "none" });

        gsap.to(sourceEl, {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          overwrite: true,
        });

        gsap.to(dropzoneEl, {
          borderColor: "#d4d4d8",
          backgroundColor: "#ffffff",
          duration: 0.3,
          overwrite: true,
        });

        gsap.fromTo(
          dropzoneEl,
          { scale: 0.98 },
          { scale: 1, duration: 0.4, ease: "back.out(2.2)" },
        );
      },
    });

    tl.to(ghostEl, {
      opacity: 1,
      scale: 1.04,
      duration: 0.22,
      ease: "power2.out",
    })
      .to(ghostEl, {
        x: endX,
        y: endY,
        duration: 0.55,
        ease: "power2.inOut",
      })
      .to(ghostEl, {
        scale: 0.96,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
  }, []);

  // ── Publish animation ─────────────────────────────────────────────────────
  const triggerPublish = useCallback(() => {
    const el = publishRef.current;
    if (!el || isPublishingRef.current) return;

    isPublishingRef.current = true;
    setPublishState("publishing");

    gsap.to(el, {
      scale: 0.93,
      duration: 0.12,
      ease: "power2.in",
      onComplete: () => {
        gsap.to(el, {
          scale: 1,
          duration: 0.2,
          ease: "back.out(2)",
        });
      },
    });

    if (publishTimeoutRef.current) clearTimeout(publishTimeoutRef.current);
    if (publishResetTimeoutRef.current)
      clearTimeout(publishResetTimeoutRef.current);

    publishTimeoutRef.current = setTimeout(() => {
      setPublishState("done");

      gsap.fromTo(
        el,
        { scale: 0.88, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" },
      );

      publishResetTimeoutRef.current = setTimeout(() => {
        setPublishState("idle");
        isPublishingRef.current = false;
      }, 2200);
    }, 1400);
  }, []);

  // Auto publish loop
  useEffect(() => {
    const startDelay = setTimeout(() => {
      triggerPublish();

      publishIntervalRef.current = setInterval(() => {
        triggerPublish();
      }, 5200);
    }, 1800);

    return () => {
      clearTimeout(startDelay);

      if (publishIntervalRef.current) {
        clearInterval(publishIntervalRef.current);
        publishIntervalRef.current = null;
      }

      if (publishTimeoutRef.current) {
        clearTimeout(publishTimeoutRef.current);
        publishTimeoutRef.current = null;
      }

      if (publishResetTimeoutRef.current) {
        clearTimeout(publishResetTimeoutRef.current);
        publishResetTimeoutRef.current = null;
      }
    };
  }, [triggerPublish]);

  // ── Hover: cycle drag demos ───────────────────────────────────────────────
  const runHoverCycle = useCallback(() => {
    const idx = demoIndexRef.current % SECTIONS.length;
    demoIndexRef.current += 1;
    simulateDrag(idx);
  }, [simulateDrag]);

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;

    runHoverCycle();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (isHoveringRef.current) {
        runHoverCycle();
      }
    }, 2400);
  }, [runHoverCycle]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setDraggingIdx(null);

    if (ghostRef.current) {
      gsap.set(ghostRef.current, { display: "none" });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
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
      <div
        ref={ghostRef}
        className="pointer-events-none absolute z-50 hidden items-center justify-center gap-2 border border-zinc-400 bg-white px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
        style={{ display: "none" }}
      >
        <div className="size-1.5  bg-zinc-400" />
        <p className="text-[11px] font-medium text-zinc-700">
          {draggingIdx !== null ? SECTIONS[draggingIdx].label : ""}
        </p>
        <svg
          className="ml-1 size-3 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>

      <div className="relative z-10 h-full">
        <div
          ref={cardRef}
          className="absolute inset-x-7 top-3 border border-zinc-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {["bg-red-300", "bg-yellow-300", "bg-green-300"].map((c, i) => (
                <div key={i} className={`size-2.5 rounded-full ${c}`} />
              ))}
            </div>

            <div
              ref={livePillRef}
              className="flex items-center gap-1.5  border border-zinc-200 bg-white px-3 py-1.5 shadow-sm"
              style={{ opacity: 0 }}
            >
              <span className="relative size-1.5 animate-pulse rounded-full bg-green-500" />
              <span className="text-[11px] text-zinc-600">
                domain.resortcloud.app is live
              </span>
            </div>
          </div>

          <div className="mt-5 border border-zinc-200 bg-zinc-50 p-4">
            <div
              ref={heroRef}
              className="h-22 overflow-hidden bg-[linear-gradient(135deg,#111827,#3f3f46)]"
              style={{ clipPath: "inset(0 100% 0 0)" }}
            >
              <div className="flex h-full items-center justify-between px-4">
                <div className="space-y-1">
                  <div className="h-2 w-20  bg-white/30" />
                  <div className="h-1.5 w-14  bg-white/20" />
                </div>
                <div className=" bg-white/20 px-3 py-1 text-[10px] text-white/80">
                  Book now
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-950">
                  Villa Amari Resort
                </p>
                <p className="text-xs capitalize text-zinc-500">
                  Hero, rooms, gallery, amenities, contact
                </p>
              </div>

              <div
                ref={publishRef}
                className="cursor-pointer select-none  px-3 py-1 text-[11px] font-medium transition-colors"
                style={{
                  background: publishState === "done" ? "#16a34a" : "#09090b",
                  color: "#ffffff",
                }}
                onClick={triggerPublish}
              >
                {publishState === "publishing"
                  ? "Publishing…"
                  : publishState === "done"
                    ? "✓ Published"
                    : "Publish"}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {SECTIONS.map(({ id, label }, i) => (
                <div
                  key={id}
                  ref={sectionRefs[i]}
                  className={`flex h-11 cursor-grab items-center justify-center gap-1.5 border text-xs font-medium transition-colors ${
                    draggingIdx === i
                      ? "border-zinc-300 bg-zinc-100 text-zinc-400"
                      : "border-zinc-200 bg-white text-zinc-700 shadow-sm"
                  }`}
                  style={{ opacity: 0 }}
                >
                  <svg
                    className="size-4 text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                  {label}
                </div>
              ))}
            </div>

            <div
              ref={dropzoneRef}
              className="mt-4 flex h-16 items-center justify-center border border-dashed border-zinc-300 bg-white"
            >
              <p className="text-[10px] text-zinc-400">Drop section here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
