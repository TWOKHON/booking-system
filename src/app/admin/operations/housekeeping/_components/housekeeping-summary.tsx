import { BedDouble, BrushCleaning, CircleCheckBig, TriangleAlert } from "lucide-react";
import { HousekeepingRecord } from "./housekeeping-data";

type HousekeepingSummaryProps = {
  data: HousekeepingRecord[];
};

export const HousekeepingSummary = ({ data }: HousekeepingSummaryProps) => {
  const activeTasks = data.filter(
    (item) => item.housekeepingStatus === "Queued" || item.housekeepingStatus === "Cleaning"
  ).length;
  const readyRooms = data.filter((item) => item.readinessStatus === "Ready").length;
  const blockedTasks = data.filter((item) => item.housekeepingStatus === "Blocked").length;
  const inspectionTasks = data.filter(
    (item) => item.housekeepingStatus === "Inspection"
  ).length;

  const cards = [
    {
      title: "Housekeeping Queue",
      value: String(data.length),
      meta: "Cleaning, turnover, and inspection tasks currently tracked across tenant resorts",
      icon: BedDouble,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Active Cleaning",
      value: String(activeTasks),
      meta: "Tasks still in queue or actively being serviced by housekeeping teams",
      icon: BrushCleaning,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Ready Inventory",
      value: String(readyRooms),
      meta: "Rooms already released as ready for front desk and same-day guest movement",
      icon: CircleCheckBig,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Blocked or Review",
      value: `${blockedTasks} / ${inspectionTasks}`,
      meta: "Blocked tasks versus tasks still waiting on inspection clearance",
      icon: TriangleAlert,
      tone: "bg-violet-50 text-violet-700",
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
