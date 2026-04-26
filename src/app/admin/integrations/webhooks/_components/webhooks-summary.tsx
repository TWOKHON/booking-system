import { Activity, RefreshCcw, ShieldAlert, Webhook } from "lucide-react";
import { WebhookRecord } from "./webhooks-data";

type WebhooksSummaryProps = {
  data: WebhookRecord[];
};

export const WebhooksSummary = ({ data }: WebhooksSummaryProps) => {
  const activeCount = data.filter((item) => item.webhookStatus === "Active").length;
  const retryingCount = data.filter((item) => item.webhookStatus === "Retrying").length;
  const failingCount = data.filter((item) => item.deliveryHealth === "Failing").length;
  const productionCount = data.filter((item) => item.environment === "Production").length;

  const cards = [
    {
      title: "Tracked Endpoints",
      value: String(data.length),
      meta: "Webhook endpoints currently monitored across payment, OTA, billing, and internal platform event flows.",
      icon: Webhook,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Active vs Retrying",
      value: `${activeCount} / ${retryingCount}`,
      meta: "Healthy live webhook routes compared against endpoints still retrying delivery failures.",
      icon: RefreshCcw,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Production Routes",
      value: String(productionCount),
      meta: "Live production webhook coverage currently connected to resort operations and billing events.",
      icon: Activity,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Failing Routes",
      value: String(failingCount),
      meta: "Endpoints currently marked failing and needing signature, payload, or timeout review.",
      icon: ShieldAlert,
      tone: "bg-rose-50 text-rose-700",
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
