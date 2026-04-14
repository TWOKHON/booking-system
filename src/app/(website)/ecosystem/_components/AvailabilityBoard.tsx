"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const GRID_COLORS = [
  "bg-white",
  "bg-zinc-100",
  "bg-zinc-200",
  "bg-zinc-800",
  "bg-zinc-300",
  "bg-zinc-100",
  "bg-zinc-200",
  "bg-white",
  "bg-zinc-900",
  "bg-zinc-100",
];

const STATUS_LABELS = ["Reserved", "Confirmed", "Pending payment"];

const NOTIFICATIONS = [
  {
    id: 1,
    label: "New inquiry",
    message: "Room 12 · 2 nights · Mar 28",
    time: "Just now",
  },
  {
    id: 2,
    label: "Booking confirmed",
    message: "#4821 · Deluxe Suite · ₱12,500",
    time: "2m ago",
  },
  {
    id: 3,
    label: "Guest checked in",
    message: "Room 14 · Juan dela Cruz",
    time: "5m ago",
  },
];

export default function AvailabilityBoard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const notifIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveringRef = useRef(false);

  const [notif, setNotif] = useState(NOTIFICATIONS[0]);

  // Entrance animation
  useGSAP(
    () => {
      const gridCells =
        gridRef.current?.querySelectorAll<HTMLElement>(".grid-cell");
      const statusRows =
        statusRef.current?.querySelectorAll<HTMLElement>(".status-row");

      if (
        !gridCells?.length ||
        !statusRows?.length ||
        !cardRef.current ||
        !notifRef.current
      )
        return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        cardRef.current,
        { y: 24, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6 },
      )
        .fromTo(
          gridCells,
          { scale: 0.65, opacity: 0, y: 8 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.32,
            stagger: { each: 0.05, from: "start" },
            ease: "back.out(1.4)",
          },
          "-=0.2",
        )
        .fromTo(
          statusRows,
          { x: -14, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.35,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.15",
        )
        .fromTo(
          notifRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" },
          "-=0.1",
        );
    },
    { scope: containerRef },
  );

  const runStagger = useCallback(() => {
    const gridCells =
      gridRef.current?.querySelectorAll<HTMLElement>(".grid-cell");
    const statusRows =
      statusRef.current?.querySelectorAll<HTMLElement>(".status-row");

    if (!gridCells?.length || !statusRows?.length) return;

    gsap.fromTo(
      gridCells,
      { scale: 0.7, opacity: 0, y: 8 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: { each: 0.05, from: "random" },
        ease: "back.out(1.5)",
        overwrite: true,
      },
    );

    gsap.fromTo(
      statusRows,
      { x: -12, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.32,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.15,
        overwrite: true,
      },
    );
  }, []);

  const cycleNotification = useCallback(() => {
    const el = notifRef.current;
    if (!el) return;

    gsap.to(el, {
      y: 12,
      opacity: 0,
      scale: 0.95,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => {
        notifIndexRef.current =
          (notifIndexRef.current + 1) % NOTIFICATIONS.length;
        const nextNotif = NOTIFICATIONS[notifIndexRef.current];
        setNotif(nextNotif);

        gsap.fromTo(
          el,
          { y: -16, opacity: 0, scale: 0.93 },
          { y: 0, opacity: 1, scale: 1, duration: 0.38, ease: "back.out(1.8)" },
        );
      },
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    runStagger();
    cycleNotification();

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (isHoveringRef.current) {
        cycleNotification();
      }
    }, 2800);
  }, [runStagger, cycleNotification]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-96 overflow-hidden border border-zinc-200 bg-zinc-50 md:min-h-110"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative z-10 h-full">
        <div
          ref={cardRef}
          className="absolute left-1/2 top-8 w-[82%] max-w-md -translate-x-1/2 border border-zinc-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-zinc-950">
                Availability board
              </p>
              <p className="text-xs text-zinc-500">March 2026</p>
            </div>
            <div className=" border border-zinc-200 px-3 py-1 text-[11px] text-zinc-600">
              12 active leads
            </div>
          </div>

          <div ref={gridRef} className="mt-4 grid grid-cols-5 gap-2">
            {GRID_COLORS.map((className, i) => (
              <div
                key={i}
                className={cn(
                  "grid-cell h-11 border border-zinc-200 shadow-sm",
                  className,
                )}
                style={{ opacity: 0 }}
              />
            ))}
          </div>

          <div ref={statusRef} className="mt-4 space-y-2">
            {STATUS_LABELS.map((label) => (
              <div
                key={label}
                className="status-row flex items-center justify-between border border-zinc-200 bg-zinc-50 px-3 py-2"
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-2">
                  <div className="size-2  bg-zinc-950" />
                  <p className="text-xs text-zinc-700">{label}</p>
                </div>
                <div className="h-2 w-12  bg-zinc-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={notifRef}
        className="absolute bottom-4 left-1/2 z-20 w-[82%] max-w-sm -translate-x-1/2"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center gap-3 border border-zinc-200 bg-white px-4 py-3 shadow-[0_8px_32px_rgba(15,23,42,0.10)]">
          <div className="relative flex size-8 shrink-0 items-center justify-center  bg-zinc-950">
            <span className="absolute inline-flex h-full w-full animate-ping  bg-zinc-700 opacity-40" />
            <svg
              className="relative size-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-zinc-950">
                {notif.label}
              </p>
              <p className="shrink-0 text-[10px] text-zinc-400">{notif.time}</p>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-zinc-500">
              {notif.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
