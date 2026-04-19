type CollectionSummary = {
  label: string;
  value: string;
  note: string;
};

type TopTenant = {
  tenant: string;
  value: string;
  share: string;
};

type RevenueSidePanelProps = {
  collections: CollectionSummary[];
  topTenants: TopTenant[];
};

export const RevenueSidePanel = ({
  collections,
  topTenants,
}: RevenueSidePanelProps) => {
  return (
    <div className="space-y-6">
      <section>
        <div>
          <h2 className="text-lg font-semibold">Collections Watch</h2>
          <p className="text-sm text-muted-foreground">
            Payment flow, reconciliation, and payout checkpoints across the platform.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {collections.map((item) => (
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
          <h2 className="text-lg font-semibold">Top Performing Tenants</h2>
          <p className="text-sm text-muted-foreground">
            Highest grossing tenants in the current reporting cycle.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {topTenants.map((tenant, index) => (
            <div key={tenant.tenant} className="rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{tenant.tenant}</p>
                  <p className="text-xs text-muted-foreground">#{index + 1} in platform revenue</p>
                </div>
                <p className="text-sm font-semibold text-emerald-700">{tenant.value}</p>
              </div>
              <div className="mt-3 h-2 bg-neutral-200 dark:bg-neutral-800">
                <div
                  className="h-2 bg-emerald-600"
                  style={{ width: tenant.share }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
