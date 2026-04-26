import {
  AlertCircle,
  FileSpreadsheet,
  Receipt,
  WandSparkles,
} from "lucide-react";
import { InvoiceRecord } from "./invoices-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

type InvoicesSummaryProps = {
  data: InvoiceRecord[];
};

export const InvoicesSummary = ({ data }: InvoicesSummaryProps) => {
  const automaticCount = data.filter((item) => item.invoiceSource === "Automatic").length;
  const manualCount = data.filter((item) => item.invoiceSource === "Manual").length;
  const overdueAmount = data
    .filter((item) => item.invoiceStatus === "Overdue")
    .reduce((sum, item) => sum + item.amount, 0);
  const draftCount = data.filter((item) => item.invoiceStatus === "Draft").length;

  const cards = [
    {
      title: "Tracked Invoices",
      value: String(data.length),
      meta: "Subscription and add-on invoices currently tracked across tenant billing activity.",
      icon: Receipt,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Automatic vs Manual",
      value: `${automaticCount} / ${manualCount}`,
      meta: "Auto-generated plan invoices compared against manually created charges for add-ons and exceptions.",
      icon: WandSparkles,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      title: "Overdue Exposure",
      value: currency.format(overdueAmount),
      meta: "Combined amount of invoices already beyond due date and needing billing follow-up.",
      icon: AlertCircle,
      tone: "bg-rose-50 text-rose-700",
    },
    {
      title: "Draft Queue",
      value: String(draftCount),
      meta: "Invoices still being reviewed before issue, including manual charges and pending adjustments.",
      icon: FileSpreadsheet,
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
