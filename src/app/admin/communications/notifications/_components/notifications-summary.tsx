import { Bell, CircleAlert, Send, TimerReset } from "lucide-react";
import { NotificationRecord } from "./notifications-data";

type NotificationsSummaryProps = {
  data: NotificationRecord[];
};

export const NotificationsSummary = ({ data }: NotificationsSummaryProps) => {
  const queued = data.filter((item) => item.deliveryStatus === "Queued").length;
  const sent = data.filter((item) => item.deliveryStatus === "Sent").length;
  const reviewOrFailed = data.filter(
    (item) =>
      item.deliveryStatus === "Needs Review" || item.deliveryStatus === "Failed"
  ).length;
  const urgent = data.filter((item) => item.priorityLevel === "Urgent").length;

  const cards = [
    {
      title: "Tracked Notifications",
      value: String(data.length),
      meta: "Platform-level notification entries currently monitored across tenants and resorts",
      icon: Bell,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Queued Sends",
      value: String(queued),
      meta: "Notifications already prepared and waiting for scheduled send or release approval",
      icon: TimerReset,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Delivered Notices",
      value: String(sent),
      meta: "Notifications that have already completed delivery through their assigned channels",
      icon: Send,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Delivery Watch",
      value: `${reviewOrFailed} / ${urgent}`,
      meta: "Notifications needing review or retry compared against all urgent alerts in the live board",
      icon: CircleAlert,
      tone: "bg-rose-50 text-rose-700",
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
