import {
  AlertCircle,
  ArrowLeftRight,
  BadgeCheck,
} from "lucide-react";
import { TransactionRecord } from "./transactions-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

type TransactionsSummaryProps = {
  data: TransactionRecord[];
};

export const TransactionsSummary = ({ data }: TransactionsSummaryProps) => {
  const failedAmount = data
    .filter((item) => item.transactionStatus === "Failed")
    .reduce((sum, item) => sum + item.amount, 0);
  const successfulAmount = data
    .filter((item) => item.transactionStatus === "Successful")
    .reduce((sum, item) => sum + item.amount, 0);
  const refundRelated = data.filter(
    (item) =>
      item.transactionType === "Refund" || item.transactionStatus === "Refunded",
  ).length;

  const cards = [
    {
      title: "Tracked Transactions",
      value: String(data.length),
      meta: "Subscription payment movements currently monitored across tenant accounts and billing events.",
      icon: ArrowLeftRight,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Successful vs Failed",
      value: `${currency.format(successfulAmount)} / ${currency.format(failedAmount)}`,
      meta: "Settled transaction value compared against failed payment movements on the active board.",
      icon: BadgeCheck,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Refund Watch",
      value: String(refundRelated),
      meta: "Refund-related records that still affect reconciliation, reversal review, or settlement closing.",
      icon: AlertCircle,
      tone: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
