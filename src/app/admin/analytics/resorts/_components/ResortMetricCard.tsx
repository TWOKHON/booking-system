import type { LucideIcon } from "lucide-react";

type ResortMetricCardProps = {
  title: string;
  value: string;
  change: string;
  meta: string;
  icon: LucideIcon;
};

export const ResortMetricCard = ({
  title,
  value,
  change,
  meta,
  icon: Icon,
}: ResortMetricCardProps) => {
  return (
    <div className="border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-3 text-2xl font-semibold">{value}</p>
        </div>
        <div className="flex size-10 items-center justify-center bg-blue-50 text-blue-700">
          <Icon className="size-5" />
        </div>
      </div>

      <p className="mt-2 text-xs font-medium text-blue-700">{change}</p>
      <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
    </div>
  );
};
