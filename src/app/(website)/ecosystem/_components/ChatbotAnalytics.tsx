"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Message {
  id: number;
  role: "guest" | "bot";
  text: string;
  tag?: string;
}

const CONVERSATIONS: Message[][] = [
  [
    { id: 1, role: "guest", text: "Hi! Do you have rooms available for April 5–8?" },
    { id: 2, role: "bot", text: "Yes! We have 3 Deluxe rooms and 1 Suite available for those dates.", tag: "Availability" },
    { id: 3, role: "guest", text: "What's included in the Suite?" },
    { id: 4, role: "bot", text: "The Suite includes ocean view, breakfast for 2, and airport transfer.", tag: "Upsell" },
  ],
  [
    { id: 1, role: "guest", text: "Can I get an early check-in on the 12th?" },
    { id: 2, role: "bot", text: "Early check-in at 10 AM is available for ₱800. Shall I add it?", tag: "Upsell" },
    { id: 3, role: "guest", text: "Yes please, and can we get a cot for our toddler?" },
    { id: 4, role: "bot", text: "Done! Cot added at no charge. Your booking is confirmed.", tag: "Confirmed" },
  ],
  [
    { id: 1, role: "guest", text: "What's the cancellation policy?" },
    { id: 2, role: "bot", text: "Free cancellation up to 48 hours before check-in. After that, 1 night is charged.", tag: "Policy" },
    { id: 3, role: "guest", text: "Great. Can I book the Deluxe room for 2 nights?" },
    { id: 4, role: "bot", text: "Booked! Confirmation sent to your email. See you April 5!", tag: "Confirmed" },
  ],
];

const TAG_COLORS: Record<string, string> = {
  Availability: "bg-blue-50 text-blue-600 border-blue-200",
  Upsell: "bg-amber-50 text-amber-600 border-amber-200",
  Confirmed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Policy: "bg-violet-50 text-violet-600 border-violet-200",
};

const STATS = [
  { label: "Chats today", value: 47 },
  { label: "Resolved", value: 91 },
  { label: "Avg. reply", value: 1.4 },
];

const STAT_FORMATS = [
  (n: number) => String(Math.round(n)),
  (n: number) => `${Math.round(n)}%`,
  (n: number) => `${n.toFixed(1)}s`,
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block size-1.5  bg-zinc-400"
          style={{ animation: `typing-dot 1.1s ease-in-out ${i * 0.18}s infinite` }}
        />
      ))}
    </div>
  );
}

export default function ChatbotAnalytics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputBarRef = useRef<HTMLDivElement>(null);

  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [typingRole, setTypingRole] = useState<"bot" | null>(null);
  const [convoIdx, setConvoIdx] = useState(0);
  const [statValues, setStatValues] = useState([0, 0, 0]);

  const convoIdxRef = useRef(0);
  const isHoveringRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isPlayingRef = useRef(false);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const runStatCountUp = useCallback(() => {
    const targets = [47, 91, 1.4];

    targets.forEach((target, i) => {
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 1.2,
        delay: i * 0.12,
        ease: "power2.out",
        onUpdate: () => {
          setStatValues((prev) => {
            const next = [...prev];
            next[i] = obj.val;
            return next;
          });
        },
      });
    });
  }, []);

  const playConversation = useCallback(
    (cIdx: number) => {
      if (isPlayingRef.current) return;

      isPlayingRef.current = true;
      setVisibleMessages([]);
      setTypingRole(null);

      const msgs = CONVERSATIONS[cIdx];
      let delay = 300;

      msgs.forEach((msg, i) => {
        const typingDelay = delay;

        const t1 = setTimeout(() => {
          setTypingRole(msg.role === "bot" ? "bot" : null);

          if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }, typingDelay);

        timeoutsRef.current.push(t1);

        const typingDuration = msg.role === "bot" ? 900 + msg.text.length * 18 : 600;
        delay += typingDuration;

        const t2 = setTimeout(() => {
          setTypingRole(null);
          setVisibleMessages((prev) => [...prev, msg]);

          requestAnimationFrame(() => {
            const bubbles = chatRef.current?.querySelectorAll<HTMLElement>(".chat-bubble");
            if (!bubbles?.length) return;

            const last = bubbles[bubbles.length - 1];

            gsap.fromTo(
              last,
              { opacity: 0, y: 10, scale: 0.94 },
              { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "back.out(1.5)" }
            );

            if (chatRef.current) {
              chatRef.current.scrollTop = chatRef.current.scrollHeight;
            }
          });

          if (i === msgs.length - 1) {
            isPlayingRef.current = false;
          }
        }, delay);

        timeoutsRef.current.push(t2);
        delay += msg.role === "guest" ? 400 : 300;
      });
    },
    []
  );

  useGSAP(
    () => {
      const statCards = statsRef.current?.querySelectorAll<HTMLElement>(".stat-card");
      if (!statCards?.length) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.45 }
      )
        .fromTo(
          statCards,
          { opacity: 0, scale: 0.85, y: 8 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.38,
            stagger: 0.09,
            ease: "back.out(1.4)",
          },
          "-=0.2"
        )
        .fromTo(
          chatRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.45 },
          "-=0.1"
        )
        .fromTo(
          inputBarRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.35 },
          "-=0.2"
        )
        .add(() => {
          runStatCountUp();
          playConversation(0);
        }, "-=0.1");
    },
    { scope: containerRef }
  );

  const handleMouseEnter = useCallback(() => {
    if (isHoveringRef.current) return;

    isHoveringRef.current = true;

    const nextIdx = (convoIdxRef.current + 1) % CONVERSATIONS.length;
    convoIdxRef.current = nextIdx;
    setConvoIdx(nextIdx);

    clearTimeouts();
    isPlayingRef.current = false;
    playConversation(nextIdx);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (!isHoveringRef.current || isPlayingRef.current) return;

      const next = (convoIdxRef.current + 1) % CONVERSATIONS.length;
      convoIdxRef.current = next;
      setConvoIdx(next);

      clearTimeouts();
      isPlayingRef.current = false;
      playConversation(next);
    }, 5500);
  }, [clearTimeouts, playConversation]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimeouts();

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [clearTimeouts]);

  return (
    <>
      <style>{`
        @keyframes typing-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

      <div
        ref={containerRef}
        className="relative h-full min-h-96 overflow-hidden border border-zinc-200 bg-zinc-50 p-5 md:min-h-113"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative z-10 flex h-full flex-col gap-3 px-1 py-1">
          <div
            ref={headerRef}
            className="flex items-center justify-between px-1"
            style={{ opacity: 0 }}
          >
            <div>
              <p className="text-sm font-semibold text-zinc-950">Guest Chatbot</p>
              <p className="text-[11px] text-zinc-500">AI self-service · Live analytics</p>
            </div>
            <div className="flex items-center gap-1.5  border border-zinc-200 bg-white px-2.5 py-1 shadow-sm">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping  bg-emerald-400 opacity-70" />
                <span className="relative inline-flex size-1.5  bg-emerald-500" />
              </span>
              <span className="text-[10px] font-medium text-zinc-600">Online</span>
            </div>
          </div>

          <div ref={statsRef} className="grid grid-cols-3 gap-2 px-1">
            {STATS.map(({ label }, i) => (
              <div
                key={label}
                className="stat-card  border border-zinc-200 bg-white p-3 shadow-sm"
                style={{ opacity: 0 }}
              >
                <p className="text-[10px] uppercase text-zinc-400">{label}</p>
                <p className="mt-1.5 text-sm font-semibold text-zinc-950">
                  {STAT_FORMATS[i](statValues[i])}
                </p>
              </div>
            ))}
          </div>

          <div
            ref={chatRef}
            className="mx-1 flex-1 overflow-y-auto no-scrollbar  border border-zinc-200 bg-zinc-50 p-3"
            style={{ opacity: 0, minHeight: 0, maxHeight: 220, scrollBehavior: "smooth" }}
          >
            <div className="space-y-2">
              {visibleMessages.map((msg, index) => (
                <div
                  key={`${msg.id}-${index}`}
                  className={`chat-bubble flex ${msg.role === "guest" ? "justify-end" : "justify-start"}`}
                  style={{ opacity: 0 }}
                >
                  {msg.role === "bot" && (
                    <div className="mr-2 mt-0.5 flex size-6 shrink-0 items-center justify-center  bg-zinc-950">
                      <svg
                        className="size-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="max-w-[75%] space-y-1">
                    <div
                      className={` px-3 py-2 text-[11px] leading-relaxed ${
                        msg.role === "guest"
                          ? " bg-zinc-950 text-white"
                          : " border border-zinc-200 bg-white text-zinc-800 shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.tag && (
                      <span
                        className={`inline-flex items-center  border px-2 py-0.5 text-[9px] font-medium ${TAG_COLORS[msg.tag]}`}
                      >
                        {msg.tag}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {typingRole === "bot" && (
                <div className="flex justify-start">
                  <div className="mr-2 mt-0.5 flex size-6 shrink-0 items-center justify-center  bg-zinc-950">
                    <svg
                      className="size-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className=" border border-zinc-200 bg-white px-3 py-2 shadow-sm">
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            ref={inputBarRef}
            className="mx-1 flex items-center gap-2  border border-zinc-200 bg-white px-3 py-2 shadow-sm"
            style={{ opacity: 0 }}
          >
            <p className="flex-1 text-[11px] text-zinc-400">Ask about availability, pricing…</p>
            <div className="flex size-6 items-center justify-center  bg-zinc-950">
              <svg
                className="size-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}