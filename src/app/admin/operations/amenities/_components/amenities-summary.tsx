import { CalendarRange, CircleAlert, ConciergeBell, UsersRound } from "lucide-react";
import { AmenitiesRecord } from "./amenities-data";

type AmenitiesSummaryProps = {
  data: AmenitiesRecord[];
};

export const AmenitiesSummary = ({ data }: AmenitiesSummaryProps) => {
  const available = data.filter((item) => item.operationalStatus === "Available").length;
  const constrained = data.filter(
    (item) =>
      item.operationalStatus === "Limited" ||
      item.operationalStatus === "Maintenance" ||
      item.operationalStatus === "Offline"
  ).length;
  const highDemand = data.filter(
    (item) => item.guestDemand === "High" || item.guestDemand === "Peak"
  ).length;
  const staffingWatch = data.filter((item) => item.staffingStatus !== "Covered").length;

  const cards = [
    {
      title: "Tracked Amenities",
      value: String(data.length),
      meta: "Guest-facing facilities and shared services currently monitored across tenant resorts",
      icon: ConciergeBell,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Fully Available",
      value: String(available),
      meta: "Amenities currently open without operational or guest access restrictions",
      icon: CalendarRange,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Demand Pressure",
      value: String(highDemand),
      meta: "Amenities seeing high or peak guest demand during current operating windows",
      icon: UsersRound,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      title: "Operational Watch",
      value: `${constrained} / ${staffingWatch}`,
      meta: "Constrained amenities compared against locations with staffing pressure or vendor dependency",
      icon: CircleAlert,
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
