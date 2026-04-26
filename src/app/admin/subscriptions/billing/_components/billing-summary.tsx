import {
  AlertCircle,
  BadgeCheck,
  ReceiptText,
  RefreshCcw,
} from "lucide-react";
import { BillingRecord } from "./billing-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

type BillingSummaryProps = {
  data: BillingRecord[];
};

export const BillingSummary = ({ data }: BillingSummaryProps) => {
  const overdueCount = data.filter((item) => item.invoiceStatus === "Overdue").length;
  const watchAmount = data
    .filter((item) => item.collectionStatus !== "Clear")
    .reduce((sum, item) => sum + item.amountDue, 0);
  const paidCount = data.filter((item) => item.invoiceStatus === "Paid").length;
  const annualRenewals = data.filter(
    (item) => item.billingCycle === "Annual" && item.invoiceStatus !== "Paid",
  ).length;

  const cards = [
    {
      title: "Billing Accounts",
      value: String(data.length),
      meta: "Tenant subscription accounts currently tracked across active billing cycles and invoice stages.",
      icon: ReceiptText,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Overdue Invoices",
      value: String(overdueCount),
      meta: "Tenant invoices that have passed their due window and now need direct collection follow-up.",
      icon: AlertCircle,
      tone: "bg-rose-50 text-rose-700",
    },
    {
      title: "Collection Watch",
      value: currency.format(watchAmount),
      meta: "Open exposure currently sitting in watch or escalated billing review across the platform.",
      icon: RefreshCcw,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Paid vs Renewing",
      value: `${paidCount} / ${annualRenewals}`,
      meta: "Settled billing accounts compared against annual renewals that still require review this cycle.",
      icon: BadgeCheck,
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
