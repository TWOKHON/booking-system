import { KeyRound, RefreshCcw, ShieldAlert, Waypoints } from "lucide-react";
import { ApiKeyRecord } from "./api-keys-data";

type ApiKeysSummaryProps = {
  data: ApiKeyRecord[];
};

export const ApiKeysSummary = ({ data }: ApiKeysSummaryProps) => {
  const activeCount = data.filter((item) => item.keyStatus === "Active").length;
  const expiringOrReview = data.filter(
    (item) => item.keyStatus === "Expiring" || item.keyStatus === "Review",
  ).length;
  const productionKeys = data.filter((item) => item.environment === "Production").length;
  const adminScopeKeys = data.filter((item) => item.accessScope === "Admin").length;

  const cards = [
    {
      title: "Tracked Keys",
      value: String(data.length),
      meta: "Platform API credentials currently tracked across payment, OTA, and integration providers.",
      icon: KeyRound,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Active vs Review",
      value: `${activeCount} / ${expiringOrReview}`,
      meta: "Live keys compared against credentials that need rotation, review, or policy cleanup.",
      icon: ShieldAlert,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Production Coverage",
      value: String(productionKeys),
      meta: "Keys currently powering live platform integrations across billing, OTA, and payment workflows.",
      icon: Waypoints,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Admin Scope Keys",
      value: String(adminScopeKeys),
      meta: "Credentials with elevated access that should stay within the current platform integration policy.",
      icon: RefreshCcw,
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
