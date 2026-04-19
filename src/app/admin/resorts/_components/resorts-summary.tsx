import { BedDouble, Building2, CircleDollarSign, ShieldAlert } from "lucide-react";
import { ResortRecord } from "./resorts-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

type ResortsSummaryProps = {
  data: ResortRecord[];
};

export const ResortsSummary = ({ data }: ResortsSummaryProps) => {
  const tenantCount = new Set(data.map((item) => item.tenantName)).size;
  const totalUnits = data.reduce((sum, item) => sum + item.units, 0);
  const totalRevenue = data.reduce((sum, item) => sum + item.monthlyRevenue, 0);
  const attentionCount = data.filter(
    (item) =>
      item.operationsStatus === "Attention" ||
      item.setupStatus !== "Live" ||
      item.channelStatus !== "Connected"
  ).length;

  const cards = [
    {
      title: "Managed Resorts",
      value: String(data.length),
      meta: `${tenantCount} tenant accounts currently mapped to resort properties`,
      icon: Building2,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Bookable Units",
      value: String(totalUnits),
      meta: "Combined villas, suites, and rooms across the tenant resort network",
      icon: BedDouble,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Portfolio Revenue",
      value: currency.format(totalRevenue),
      meta: "Current monthly revenue associated with all listed resort properties",
      icon: CircleDollarSign,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      title: "Needs Attention",
      value: String(attentionCount),
      meta: "Resorts with setup, operations, or channel-sync issues requiring review",
      icon: ShieldAlert,
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
