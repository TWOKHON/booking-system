import type { LucideIcon } from "lucide-react";

type OperationItem = {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

type OperationsSnapshotProps = {
  items: OperationItem[];
};

export const OperationsSnapshot = ({
  items,
}: OperationsSnapshotProps) => {
  return (
    <section className="border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Operations Snapshot</h2>
          <p className="text-sm text-muted-foreground">
            Daily execution across front desk, housekeeping, and resort
            facilities.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 border px-3 py-1 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Shift handoff in progress
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="border p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="mt-1 text-xl font-semibold">{item.value}</p>
                </div>
                <div className="flex size-7 shrink-0 items-center justify-center border bg-foreground">
                  <Icon className="size-3.5 text-background" />
                </div>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
