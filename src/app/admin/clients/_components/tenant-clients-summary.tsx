import { Building2, CircleDollarSign, ShieldAlert, Users } from "lucide-react";
import { TenantClient } from "./tenant-clients-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

type TenantClientsSummaryProps = {
  data: TenantClient[];
};

export const TenantClientsSummary = ({
  data,
}: TenantClientsSummaryProps) => {
  const activeTenants = data.filter((item) => item.status === "Active").length;
  const atRiskTenants = data.filter((item) => item.status === "At Risk").length;
  const totalProperties = data.reduce((sum, item) => sum + item.properties, 0);
  const totalMrr = data.reduce((sum, item) => sum + item.monthlyRevenue, 0);

  const cards = [
    {
      title: "Active Tenants",
      value: String(activeTenants),
      meta: "Tenant accounts currently using the platform in good standing",
      icon: Building2,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Managed Properties",
      value: String(totalProperties),
      meta: "Resort properties currently managed across all tenant accounts",
      icon: Users,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Current MRR",
      value: currency.format(totalMrr),
      meta: "Recurring subscription revenue across the tenant portfolio",
      icon: CircleDollarSign,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      title: "Needs Attention",
      value: String(atRiskTenants),
      meta: "Tenants flagged for billing risk, suspension, or support review",
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
