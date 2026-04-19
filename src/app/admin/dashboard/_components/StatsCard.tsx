
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
}

export const StatsCard = ({ title, value, change, icon: Icon }: Props) => {
  return (
    <div className="border bg-white dark:bg-neutral-900 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon className="w-5 h-5 opacity-70" />
      </div>

      <div className="mt-3 text-2xl font-semibold">{value}</div>

      <div className="text-xs text-green-500 mt-1">
        {change} vs last week
      </div>
    </div>
  );
};