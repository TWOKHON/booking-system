import {
  Activity,
  BanknoteArrowDown,
  CreditCard,
  ShieldAlert,
} from "lucide-react";
import { PaymentIntegrationRecord } from "./payments-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

type PaymentsSummaryProps = {
  data: PaymentIntegrationRecord[];
};

export const PaymentsSummary = ({ data }: PaymentsSummaryProps) => {
  const activeCount = data.filter((item) => item.integrationStatus === "Active").length;
  const watchCount = data.filter((item) => item.webhookHealth !== "Healthy").length;
  const totalVolume = data.reduce((sum, item) => sum + item.transactionVolume, 0);
  const tenantCoverage = data.reduce((sum, item) => sum + item.supportedTenants, 0);

  const cards = [
    {
      title: "Payment Providers",
      value: String(data.length),
      meta: "Configured platform payment integrations across cards, banking, transfers, and e-wallet categories.",
      icon: CreditCard,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Active vs Review",
      value: `${activeCount} / ${watchCount}`,
      meta: "Live production providers compared against integrations that still need webhook or settlement review.",
      icon: ShieldAlert,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Transaction Volume",
      value: currency.format(totalVolume),
      meta: "Tracked payment throughput currently routed through the configured provider stack.",
      icon: BanknoteArrowDown,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Tenant Coverage",
      value: String(tenantCoverage),
      meta: "Combined tenant-provider coverage currently enabled across the payment configuration board.",
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
