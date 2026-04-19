type QueueItem = {
  label: string;
  value: string;
  note: string;
};

type TenantPulse = {
  tenant: string;
  value: string;
  share: string;
};

type ResortActivitySidePanelProps = {
  queues: QueueItem[];
  tenantPulse: TenantPulse[];
};

export const ResortActivitySidePanel = ({
  queues,
  tenantPulse,
}: ResortActivitySidePanelProps) => {
  return (
    <div className="space-y-6">
      <section>
        <div>
          <h2 className="text-lg font-semibold">Activity Watch</h2>
          <p className="text-sm text-muted-foreground">
            Operational queues and resort activity that need admin visibility today.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {queues.map((item) => (
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
          <h2 className="text-lg font-semibold">Tenant Activity Pulse</h2>
          <p className="text-sm text-muted-foreground">
            Tenants generating the highest current resort movement and team activity.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {tenantPulse.map((item, index) => (
            <div key={item.tenant} className="rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{item.tenant}</p>
                  <p className="text-xs text-muted-foreground">#{index + 1} by active resort traffic</p>
                </div>
                <p className="text-sm font-semibold text-blue-700">{item.value}</p>
              </div>
              <div className="mt-3 h-2 bg-neutral-200 dark:bg-neutral-800">
                <div
                  className="h-2 bg-blue-600"
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
