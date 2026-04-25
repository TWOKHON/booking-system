import {
  BadgeDollarSign,
  ChartNoAxesColumnIncreasing,
  Megaphone,
  TimerReset,
} from "lucide-react";
import { SalesRecord } from "./sales-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

type SalesSummaryProps = {
  data: SalesRecord[];
};

export const SalesSummary = ({ data }: SalesSummaryProps) => {
  const activePipeline = data.filter(
    (item) => item.pipelineStage !== "Confirmed" && item.pipelineStage !== "Lost"
  ).length;
  const attributedLeads = data.filter(
    (item) => item.attributionStatus === "Attributed"
  ).length;
  const quotedPipeline = data
    .filter((item) => item.pipelineStage !== "Lost")
    .reduce((sum, item) => sum + item.quotedValue, 0);
  const reviewAttribution = data.filter(
    (item) => item.attributionStatus === "Needs Review"
  ).length;

  const cards = [
    {
      title: "Pipeline Coverage",
      value: String(data.length),
      meta: "Live sales and marketing opportunities currently tracked across booking and event demand",
      icon: ChartNoAxesColumnIncreasing,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Active Pipeline",
      value: String(activePipeline),
      meta: "Leads still moving through qualification, proposal, or negotiation stages",
      icon: Megaphone,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Quoted Value",
      value: currency.format(quotedPipeline),
      meta: "Combined quoted pipeline value excluding opportunities already marked lost",
      icon: BadgeDollarSign,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      title: "Attribution Watch",
      value: `${reviewAttribution} / ${attributedLeads}`,
      meta: "Leads still needing attribution review compared against opportunities already tied to campaigns",
      icon: TimerReset,
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
