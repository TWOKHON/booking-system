import type { LucideIcon } from "lucide-react";

type SubscriptionMetricCardProps = {
  title: string;
  value: string;
  change: string;
  meta: string;
  icon: LucideIcon;
};

export const SubscriptionMetricCard = ({
  title,
  value,
  change,
  meta,
  icon: Icon,
}: SubscriptionMetricCardProps) => {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-3 text-2xl font-semibold">{value}</p>
        </div>
        <div className="flex size-10 items-center justify-center bg-violet-50 text-violet-700">
          <Icon className="size-5" />
        </div>
      </div>

      <p className="mt-2 text-xs font-medium text-violet-700">{change}</p>
      <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
    </div>
  );
};
