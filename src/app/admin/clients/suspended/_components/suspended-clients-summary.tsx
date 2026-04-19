import {
  BadgeAlert,
  CircleDollarSign,
  FileWarning,
  PauseCircle,
} from "lucide-react";
import { SuspendedClient } from "./suspended-clients-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

type SuspendedClientsSummaryProps = {
  data: SuspendedClient[];
};

export const SuspendedClientsSummary = ({
  data,
}: SuspendedClientsSummaryProps) => {
  const escalated = data.filter(
    (item) => item.reviewStatus === "Escalated"
  ).length;
  const balanceDue = data.reduce((sum, item) => sum + item.balanceDue, 0);
  const failedBilling = data.filter(
    (item) => item.suspensionReason === "Failed Billing"
  ).length;

  const cards = [
    {
      title: "Suspended Tenants",
      value: String(data.length),
      meta: "Tenant accounts currently restricted from normal platform access",
      icon: PauseCircle,
      tone: "bg-rose-50 text-rose-700",
    },
    {
      title: "Failed Billing Cases",
      value: String(failedBilling),
      meta: "Accounts suspended because of unresolved subscription billing issues",
      icon: BadgeAlert,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Outstanding Balance",
      value: currency.format(balanceDue),
      meta: "Unsettled subscription balances tied to suspended tenant accounts",
      icon: CircleDollarSign,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      title: "Escalated Reviews",
      value: String(escalated),
      meta: "Suspension cases currently waiting for admin or owner-level resolution",
      icon: FileWarning,
      tone: "bg-blue-50 text-blue-700",
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
