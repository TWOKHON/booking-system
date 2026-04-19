type RenewalItem = {
  label: string;
  value: string;
  note: string;
};

type PlanMixItem = {
  plan: string;
  tenants: string;
  share: string;
};

type SubscriptionSidePanelProps = {
  renewals: RenewalItem[];
  planMix: PlanMixItem[];
};

export const SubscriptionSidePanel = ({
  renewals,
  planMix,
}: SubscriptionSidePanelProps) => {
  return (
    <div className="space-y-6">
      <section>
        <div>
          <h2 className="text-lg font-semibold">Renewal Watch</h2>
          <p className="text-sm text-muted-foreground">
            Upcoming renewals, failed billings, and accounts that need admin attention.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {renewals.map((item) => (
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
          <h2 className="text-lg font-semibold">Plan Mix</h2>
          <p className="text-sm text-muted-foreground">
            Distribution of active tenants by subscription tier.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {planMix.map((item) => (
            <div key={item.plan} className="rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{item.plan}</p>
                  <p className="text-xs text-muted-foreground">{item.tenants}</p>
                </div>
                <p className="text-sm font-semibold text-violet-700">{item.share}</p>
              </div>
              <div className="mt-3 h-2 bg-neutral-200 dark:bg-neutral-800">
                <div
                  className="h-2 bg-violet-600"
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
