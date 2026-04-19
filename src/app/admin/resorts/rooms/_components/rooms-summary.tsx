import { BedDouble, BrushCleaning, CircleDollarSign, Wrench } from "lucide-react";
import { RoomRecord } from "./rooms-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

type RoomsSummaryProps = {
  data: RoomRecord[];
};

export const RoomsSummary = ({ data }: RoomsSummaryProps) => {
  const readyRooms = data.filter(
    (item) => item.housekeepingStatus === "Ready"
  ).length;
  const issueRooms = data.filter(
    (item) => item.maintenanceStatus === "Issue"
  ).length;
  const averageRate =
    data.reduce((sum, item) => sum + item.rate, 0) / Math.max(data.length, 1);
  const occupiedOrReserved = data.filter(
    (item) => item.occupancyStatus !== "Vacant"
  ).length;

  const cards = [
    {
      title: "Tracked Rooms",
      value: String(data.length),
      meta: "Rooms and unit records currently monitored across tenant resorts",
      icon: BedDouble,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Ready Inventory",
      value: String(readyRooms),
      meta: "Rooms currently marked ready for same-day sale or guest arrival",
      icon: BrushCleaning,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Average Rate",
      value: currency.format(Math.round(averageRate)),
      meta: "Average nightly room rate across the tracked room inventory",
      icon: CircleDollarSign,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      title: "Operational Issues",
      value: `${issueRooms} / ${occupiedOrReserved}`,
      meta: "Rooms with maintenance issues compared against occupied or reserved units",
      icon: Wrench,
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
