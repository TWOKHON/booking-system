import {
  BadgeDollarSign,
  BellRing,
  Hotel,
  LogIn,
} from "lucide-react";
import { FrontdeskRecord } from "./frontdesk-data";

type FrontdeskSummaryProps = {
  data: FrontdeskRecord[];
};

export const FrontdeskSummary = ({ data }: FrontdeskSummaryProps) => {
  const arrivalsToday = data.filter(
    (item) => item.queueStage === "Arrival Today" || item.queueStage === "Check-In Pending"
  ).length;
  const paymentHolds = data.filter(
    (item) => item.paymentStatus !== "Settled" || item.frontdeskStatus === "Waiting Payment"
  ).length;
  const readyRooms = data.filter((item) => item.roomReadiness === "Ready").length;
  const readinessRate = Math.round((readyRooms / Math.max(data.length, 1)) * 100);

  const cards = [
    {
      title: "Front Desk Queue",
      value: String(data.length),
      meta: "Guest arrivals, in-house actions, and departures currently visible across tenant resorts",
      icon: Hotel,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Arrivals In Motion",
      value: String(arrivalsToday),
      meta: "Arrival and active check-in records requiring front desk attention today",
      icon: LogIn,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Payment Holds",
      value: String(paymentHolds),
      meta: "Guest records still blocked by partial or outstanding payment checkpoints",
      icon: BadgeDollarSign,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Ready Room Coverage",
      value: `${readinessRate}%`,
      meta: "Share of front desk queue items already backed by ready room inventory",
      icon: BellRing,
      tone: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="mt-3 text-2xl font-semibold">{card.value}</p>
              </div>
              <div
                className={`flex size-10 items-center justify-center rounded-full ${card.tone}`}
              >
                <Icon className="size-5" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{card.meta}</p>
          </div>
        );
      })}
    </div>
  );
};
