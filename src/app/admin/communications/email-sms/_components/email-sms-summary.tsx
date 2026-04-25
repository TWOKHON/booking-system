import { Mail, MessageSquareText, Send, TriangleAlert } from "lucide-react";
import { EmailSmsRecord } from "./email-sms-data";

type EmailSmsSummaryProps = {
  data: EmailSmsRecord[];
};

export const EmailSmsSummary = ({ data }: EmailSmsSummaryProps) => {
  const queuedOrScheduled = data.filter(
    (item) => item.sendStatus === "Queued" || item.sendStatus === "Scheduled"
  ).length;
  const sent = data.filter((item) => item.sendStatus === "Sent").length;
  const approvalOrFailed = data.filter(
    (item) => item.sendStatus === "Needs Approval" || item.sendStatus === "Failed"
  ).length;
  const urgent = data.filter((item) => item.priorityLevel === "Urgent").length;

  const cards = [
    {
      title: "Outbound Sends",
      value: String(data.length),
      meta: "Email and SMS sends currently tracked across guest, lead, owner, and tenant audiences",
      icon: MessageSquareText,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Queued or Scheduled",
      value: String(queuedOrScheduled),
      meta: "Campaigns and alerts already lined up for release in the next send windows",
      icon: Mail,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Delivered Sends",
      value: String(sent),
      meta: "Outbound messages that already completed send across email or SMS channels",
      icon: Send,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Release Watch",
      value: `${approvalOrFailed} / ${urgent}`,
      meta: "Sends needing approval or retry compared against all urgent outbound items in the board",
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
