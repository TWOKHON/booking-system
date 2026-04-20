"use client";

import Image from "next/image";

type TuroInsightCardProps = {
  name?: string;
  message: string;
  userName?: string;
};

export const TuroInsightCard = ({
  name = "Turo",
  message,
  userName = "Kyle Andre",
}: TuroInsightCardProps) => {
  const now = new Date();

  // Format date in PH timezone
  const formattedDate = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(now);

  // Get hour in PH timezone
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      hour: "numeric",
      hour12: false,
    }).format(now)
  );

  // Dynamic greeting
  let greeting = "Good evening";
  if (hour >= 5 && hour < 12) greeting = "Good morning";
  else if (hour >= 12 && hour < 18) greeting = "Good afternoon";

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 bottom-3.5">
        <div className="ml-47">
          <p className="text-xs text-muted-foreground font-medium">
            {formattedDate}
          </p>
          <h3 className="text-2xl font-bold mb-2">
            {greeting}, {userName}!{" "}
            <span className="waving-hand">👋</span>
          </h3>
        </div>
        <div className="h-22 bg-linear-to-b from-[#99a944] to-[#537129]" />
      </div>

      <div className="relative flex items-end gap-3 px-4">
        <div className="relative z-10 h-40 w-40 shrink-0 overflow-hidden">
          <Image
            src="/turo-character/greetings.png"
            alt={`${name} mascot`}
            fill
            className="object-cover object-center"
            sizes="128px"
            priority
          />
        </div>

        <div className="relative mb-4.75 w-100 bg-white px-5 h-19 flex flex-col justify-center">
          <span className="absolute -left-2 top-7 h-5 w-5 rotate-45 bg-white shadow-[-6px_6px_18px_rgba(35,73,42,0.06)]" />
          <span className="absolute -left-1 top-6 h-7 w-7 -z-1 rounded-full bg-white" />

          <p className="text-sm font-semibold text-green-700">{name}</p>
          <p className="text-xs text-[#5c625d]">{message}</p>
        </div>
      </div>
    </section>
  );
};