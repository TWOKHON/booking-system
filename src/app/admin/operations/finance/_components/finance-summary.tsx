import {
  AlertCircle,
  BanknoteArrowDown,
  CircleDollarSign,
  WalletCards,
} from "lucide-react";
import { FinanceRecord } from "./finance-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

type FinanceSummaryProps = {
  data: FinanceRecord[];
};

export const FinanceSummary = ({ data }: FinanceSummaryProps) => {
  const pendingCollections = data.filter(
    (item) => item.financeStatus === "Pending Collection"
  ).length;
  const holdOrRecon = data.filter(
    (item) =>
      item.financeStatus === "Payout Hold" ||
      item.financeStatus === "For Reconciliation"
  ).length;
  const atRiskAmount = data
    .filter((item) => item.paymentHealth === "At Risk")
    .reduce((sum, item) => sum + item.amount, 0);
  const closedAmount = data
    .filter((item) => item.financeStatus === "Closed")
    .reduce((sum, item) => sum + item.amount, 0);

  const cards = [
    {
      title: "Tracked Ledgers",
      value: String(data.length),
      meta: "Operational finance records currently monitored across resort-level collections and settlements",
      icon: WalletCards,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Pending Collections",
      value: String(pendingCollections),
      meta: "Guest or operating balances that still need collection action before closeout",
      icon: CircleDollarSign,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "At-Risk Exposure",
      value: currency.format(atRiskAmount),
      meta: "Combined value of finance items already flagged as at risk across the active board",
      icon: AlertCircle,
      tone: "bg-rose-50 text-rose-700",
    },
    {
      title: "Close vs Hold",
      value: `${currency.format(closedAmount)} / ${holdOrRecon}`,
      meta: "Closed finance value compared against items still held in payout or reconciliation queues",
      icon: BanknoteArrowDown,
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
