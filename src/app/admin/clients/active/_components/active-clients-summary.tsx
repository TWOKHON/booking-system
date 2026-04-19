import {
  BadgeCheck,
  CalendarClock,
  CircleDollarSign,
  ShieldAlert,
} from "lucide-react";
import { ActiveClient } from "./active-clients-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

type ActiveClientsSummaryProps = {
  data: ActiveClient[];
};

export const ActiveClientsSummary = ({
  data,
}: ActiveClientsSummaryProps) => {
  const healthyCount = data.filter(
    (item) => item.subscriptionStatus === "Healthy"
  ).length;
  const atRiskCount = data.filter(
    (item) => item.subscriptionStatus === "At Risk"
  ).length;
  const recurringRevenue = data.reduce(
    (sum, item) => sum + item.monthlyRevenue,
    0
  );
  const renewalsThisMonth = data.filter((item) =>
    item.renewalDate.startsWith("Apr") || item.renewalDate.startsWith("May")
  ).length;

  const cards = [
    {
      title: "Paid Tenants",
      value: String(data.length),
      meta: "Tenant accounts with active paid subscriptions",
      icon: BadgeCheck,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Healthy Accounts",
      value: String(healthyCount),
      meta: "Paid tenants currently operating without billing flags",
      icon: ShieldAlert,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Recurring Revenue",
      value: currency.format(recurringRevenue),
      meta: "Current monthly subscription revenue from active paid tenants",
      icon: CircleDollarSign,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      title: "Renewals Due Soon",
      value: `${renewalsThisMonth}`,
      meta: `${atRiskCount} account${atRiskCount === 1 ? "" : "s"} currently flagged for review`,
      icon: CalendarClock,
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
