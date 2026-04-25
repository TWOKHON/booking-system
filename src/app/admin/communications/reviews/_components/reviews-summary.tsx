import { MessageSquareQuote, ShieldAlert, Star, TriangleAlert } from "lucide-react";
import { ReviewRecord } from "./reviews-data";

type ReviewsSummaryProps = {
  data: ReviewRecord[];
};

export const ReviewsSummary = ({ data }: ReviewsSummaryProps) => {
  const pending = data.filter(
    (item) => item.reviewStatus === "Pending Response" || item.reviewStatus === "New"
  ).length;
  const escalated = data.filter((item) => item.reviewStatus === "Escalated").length;
  const lowRatings = data.filter((item) => item.rating <= 2).length;
  const positive = data.filter((item) => item.sentimentLevel === "Positive").length;

  const cards = [
    {
      title: "Tracked Reviews",
      value: String(data.length),
      meta: "Public and direct review records currently monitored across tenant resorts",
      icon: MessageSquareQuote,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Pending Responses",
      value: String(pending),
      meta: "Reviews that still need a public response or a first review action from the assigned owner",
      icon: TriangleAlert,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Low Ratings",
      value: String(lowRatings),
      meta: "Reviews with 1 or 2 stars that may affect resort reputation and service recovery workload",
      icon: ShieldAlert,
      tone: "bg-rose-50 text-rose-700",
    },
    {
      title: "Positive Pulse",
      value: `${positive} / ${escalated}`,
      meta: "Positive review count compared against reviews already escalated for service recovery",
      icon: Star,
      tone: "bg-emerald-50 text-emerald-700",
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
