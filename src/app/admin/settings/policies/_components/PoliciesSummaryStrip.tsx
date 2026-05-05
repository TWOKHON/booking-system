import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PolicyMetric } from "./policies-data";

type PoliciesSummaryStripProps = {
  items: PolicyMetric[];
};

export const PoliciesSummaryStrip = ({
  items,
}: PoliciesSummaryStripProps) => {
  return (
    <Card className="gap-0 overflow-hidden">
      <CardContent className="grid grid-cols-1 px-0 py-0 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={[
                "flex items-start gap-3 px-5 py-4",
                index < items.length - 1 ? "border-b sm:border-b-0" : "",
                index >= 2 ? "sm:border-t xl:border-t-0" : "",
                index % 2 === 1 ? "sm:border-l" : "",
                index >= 1 ? "xl:border-l" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Icon className="size-4.5" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase text-muted-foreground">
                  {item.title}
                </p>
                <p className="mt-2 text-base font-semibold leading-tight">
                  {item.value}
                </p>
                <Badge
                  variant="outline"
                  className="mt-2 rounded-full border-emerald-200 bg-emerald-50 px-2 py-0 text-[11px] text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                  {item.change}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
