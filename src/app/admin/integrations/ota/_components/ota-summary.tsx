import { Activity, Hotel, Link2, TriangleAlert } from "lucide-react";
import { OtaIntegrationRecord } from "./ota-data";

type OtaSummaryProps = {
  data: OtaIntegrationRecord[];
};

export const OtaSummary = ({ data }: OtaSummaryProps) => {
  const activeCount = data.filter((item) => item.integrationStatus === "Active").length;
  const syncIssues = data.filter((item) => item.syncHealth !== "Healthy").length;
  const totalMappedResorts = data.reduce((sum, item) => sum + item.mappedResorts, 0);
  const totalReservations = data.reduce((sum, item) => sum + item.reservationVolume, 0);

  const cards = [
    {
      title: "OTA Providers",
      value: String(data.length),
      meta: "Connected channel providers currently tracked across OTA, metasearch, and manager integrations.",
      icon: Link2,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Active vs Sync Watch",
      value: `${activeCount} / ${syncIssues}`,
      meta: "Live channels compared against providers that still need sync or mapping review.",
      icon: TriangleAlert,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Mapped Resorts",
      value: String(totalMappedResorts),
      meta: "Combined property-to-channel mapping coverage currently configured across the platform.",
      icon: Hotel,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Reservation Flow",
      value: totalReservations.toLocaleString("en-PH"),
      meta: "Tracked reservation throughput currently moving through the OTA integration stack.",
      icon: Activity,
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
