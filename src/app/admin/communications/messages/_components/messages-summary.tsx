import { BellRing, MailOpen, MessageCircleMore, TriangleAlert } from "lucide-react";
import { MessageRecord } from "./messages-data";

type MessagesSummaryProps = {
  data: MessageRecord[];
};

export const MessagesSummary = ({ data }: MessagesSummaryProps) => {
  const unread = data.filter((item) => item.messageStatus === "Unread").length;
  const followUps = data.filter(
    (item) => item.messageStatus === "Pending Follow-Up"
  ).length;
  const escalated = data.filter((item) => item.messageStatus === "Escalated").length;
  const urgent = data.filter((item) => item.priorityLevel === "Urgent").length;

  const cards = [
    {
      title: "Tracked Conversations",
      value: String(data.length),
      meta: "Platform-level message threads currently monitored across guest, lead, tenant, and owner communications",
      icon: MessageCircleMore,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Unread Threads",
      value: String(unread),
      meta: "Conversations still waiting for the first response from the assigned admin or tenant-facing owner",
      icon: MailOpen,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Follow-Up Queue",
      value: String(followUps),
      meta: "Threads that already have contact but still require a timed next response or confirmation",
      icon: BellRing,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      title: "Escalation Watch",
      value: `${escalated} / ${urgent}`,
      meta: "Escalated communication threads compared against all urgent message cases in the live board",
      icon: TriangleAlert,
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
