type AdoptionItem = {
  label: string;
  value: string;
  note: string;
};

type ModulePulseItem = {
  module: string;
  usage: string;
  share: string;
};

type UsageSidePanelProps = {
  adoption: AdoptionItem[];
  modulePulse: ModulePulseItem[];
};

export const UsageSidePanel = ({
  adoption,
  modulePulse,
}: UsageSidePanelProps) => {
  return (
    <div className="space-y-6">
      <section>
        <div>
          <h2 className="text-lg font-semibold">Adoption Watch</h2>
          <p className="text-sm text-muted-foreground">
            Key system-usage signals that show how deeply tenants are using the platform.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {adoption.map((item) => (
            <div key={item.label} className="rounded-2xl border p-4">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-xl font-semibold">{item.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div>
          <h2 className="text-lg font-semibold">Module Pulse</h2>
          <p className="text-sm text-muted-foreground">
            Which system modules are being used most often by tenant teams right now.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {modulePulse.map((item) => (
            <div key={item.module} className="rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{item.module}</p>
                  <p className="text-xs text-muted-foreground">{item.usage}</p>
                </div>
                <p className="text-sm font-semibold text-orange-700">{item.share}</p>
              </div>
              <div className="mt-3 h-2 bg-neutral-200 dark:bg-neutral-800">
                <div
                  className="h-2 bg-orange-600"
                  style={{ width: item.share }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
