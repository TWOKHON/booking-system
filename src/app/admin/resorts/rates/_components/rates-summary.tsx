import { BadgePercent, CircleDollarSign, Megaphone, TrendingUp } from "lucide-react";
import { RateRecord } from "./rates-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

type RatesSummaryProps = {
  data: RateRecord[];
};

export const RatesSummary = ({ data }: RatesSummaryProps) => {
  const averageBaseRate =
    data.reduce((sum, item) => sum + item.baseRate, 0) / Math.max(data.length, 1);
  const promoLive = data.filter((item) => item.pricingStatus === "Promo Live").length;
  const needsReview = data.filter((item) => item.pricingStatus === "Needs Review").length;
  const averageWeekendLift = Math.round(
    data.reduce((sum, item) => sum + (item.weekendRate - item.baseRate), 0) /
      Math.max(data.length, 1)
  );

  const cards = [
    {
      title: "Average Base Rate",
      value: currency.format(Math.round(averageBaseRate)),
      meta: "Average standard nightly rate across the tracked room-rate inventory",
      icon: CircleDollarSign,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      title: "Weekend Lift",
      value: currency.format(averageWeekendLift),
      meta: "Average premium added to weekend pricing across active room categories",
      icon: TrendingUp,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Promo Live",
      value: String(promoLive),
      meta: "Rooms currently carrying a promo rate or published offer",
      icon: Megaphone,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Needs Review",
      value: String(needsReview),
      meta: "Rate setups flagged for pricing review because of weak demand or stale updates",
      icon: BadgePercent,
      tone: "bg-amber-50 text-amber-700",
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
