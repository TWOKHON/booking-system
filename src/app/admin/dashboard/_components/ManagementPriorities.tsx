import type { LucideIcon } from "lucide-react";

type ManagementItem = {
  title: string;
  detail: string;
  icon: LucideIcon;
};

type ManagementPrioritiesProps = {
  items: ManagementItem[];
};

export const ManagementPriorities = ({
  items,
}: ManagementPrioritiesProps) => {
  return (
    <section className="border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Management Priorities</h2>
          <p className="text-sm text-muted-foreground">
            Cross-team items that need admin attention before end of day.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="border p-4">
              <div className="flex items-center gap-2">
                <div className="flex size-6 shrink-0 items-center justify-center bg-foreground">
                  <Icon className="size-3 text-background" />
                </div>
                <p className="font-medium">{item.title}</p>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
