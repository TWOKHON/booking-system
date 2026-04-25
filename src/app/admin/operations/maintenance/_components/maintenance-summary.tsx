import { AlertTriangle, ShieldCheck, Wrench, WrenchIcon } from "lucide-react";
import { MaintenanceRecord } from "./maintenance-data";

type MaintenanceSummaryProps = {
  data: MaintenanceRecord[];
};

export const MaintenanceSummary = ({ data }: MaintenanceSummaryProps) => {
  const activeTickets = data.filter(
    (item) => item.maintenanceStatus === "Open" || item.maintenanceStatus === "In Progress"
  ).length;
  const criticalOrHigh = data.filter(
    (item) => item.severity === "Critical" || item.severity === "High"
  ).length;
  const outOfOrder = data.filter((item) => item.roomImpact === "Out of Order").length;
  const resolved = data.filter((item) => item.maintenanceStatus === "Resolved").length;

  const cards = [
    {
      title: "Maintenance Board",
      value: String(data.length),
      meta: "Engineering work orders and room issue records currently tracked across tenant resorts",
      icon: Wrench,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Active Tickets",
      value: String(activeTickets),
      meta: "Work orders still open or actively being worked by on-site engineering teams",
      icon: WrenchIcon,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "High-Risk Issues",
      value: String(criticalOrHigh),
      meta: "Critical or high-severity tickets that could affect arrival readiness and guest stay quality",
      icon: AlertTriangle,
      tone: "bg-rose-50 text-rose-700",
    },
    {
      title: "Recovered Inventory",
      value: `${resolved} / ${outOfOrder}`,
      meta: "Resolved work orders compared against rooms currently marked out of order",
      icon: ShieldCheck,
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
