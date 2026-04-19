const statusDotClasses = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  issue: "bg-rose-500",
};

type HealthTone = keyof typeof statusDotClasses;

type HealthItem = {
  label: string;
  value: string;
  note: string;
  tone: HealthTone;
};

type PropertyHealthProps = {
  items: HealthItem[];
};

const HealthRow = ({ label, value, note, tone }: HealthItem) => {
  return (
    <div className="border p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`size-2.5 rounded-full animate-pulse ${statusDotClasses[tone]}`} />
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        <p className="font-semibold">{value}</p>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{note}</p>
    </div>
  );
};

export const PropertyHealth = ({ items }: PropertyHealthProps) => {
  return (
    <section className="border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Property Health</h2>
          <p className="text-sm text-muted-foreground">
            Quick read on the operational condition of the active resort
            portfolio.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <HealthRow key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
};
