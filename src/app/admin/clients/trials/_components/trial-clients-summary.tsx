import {
  AlarmClockCheck,
  Building2,
  Flag,
  UserRoundPlus,
} from "lucide-react";
import { TrialClient } from "./trial-clients-data";

type TrialClientsSummaryProps = {
  data: TrialClient[];
};

export const TrialClientsSummary = ({ data }: TrialClientsSummaryProps) => {
  const nearExpiry = data.filter((item) => item.daysRemaining <= 3).length;
  const launchReady = data.filter(
    (item) => item.onboardingStep === "Launch Ready"
  ).length;
  const highUsage = data.filter((item) => item.usageLevel === "High").length;

  const cards = [
    {
      title: "Trial Tenants",
      value: String(data.length),
      meta: "Tenant accounts currently inside the 7-day free trial window",
      icon: Building2,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Expiring Soon",
      value: String(nearExpiry),
      meta: "Trial tenants with 3 days or less remaining before expiration",
      icon: AlarmClockCheck,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Launch Ready",
      value: String(launchReady),
      meta: "Trial workspaces that already completed the core onboarding flow",
      icon: Flag,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "High Usage Trials",
      value: String(highUsage),
      meta: "Trial tenants showing strong adoption and upgrade potential",
      icon: UserRoundPlus,
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
