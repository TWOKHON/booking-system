type TenantSubscriptionRow = {
  tenant: string;
  plan: string;
  billingCycle: string;
  mrr: string;
  renewalDate: string;
  properties: number;
  status: string;
};

type TenantSubscriptionTableProps = {
  rows: TenantSubscriptionRow[];
};

const statusClasses: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Trial: "bg-blue-100 text-blue-700",
  "At Risk": "bg-amber-100 text-amber-700",
};

export const TenantSubscriptionTable = ({
  rows,
}: TenantSubscriptionTableProps) => {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Tenant Subscription Ledger</h2>
          <p className="text-sm text-muted-foreground">
            Billing and renewal status across tenant accounts on the platform.
          </p>
        </div>
        <div className="bg-neutral-100 px-3 py-1 text-xs text-muted-foreground dark:bg-neutral-800">
          11 tracked tenant subscriptions
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-muted-foreground">
            <tr>
              <th className="py-3 pr-4 font-medium">Tenant</th>
              <th className="py-3 pr-4 font-medium">Plan</th>
              <th className="py-3 pr-4 font-medium">Billing Cycle</th>
              <th className="py-3 pr-4 font-medium">MRR</th>
              <th className="py-3 pr-4 font-medium">Renewal Date</th>
              <th className="py-3 pr-4 font-medium">Properties</th>
              <th className="py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.tenant}>
                <td className="py-4 pr-4">
                  <p className="font-medium">{row.tenant}</p>
                  <p className="text-xs text-muted-foreground">Tenant subscription account</p>
                </td>
                <td className="py-4 pr-4">{row.plan}</td>
                <td className="py-4 pr-4">{row.billingCycle}</td>
                <td className="py-4 pr-4 font-medium">{row.mrr}</td>
                <td className="py-4 pr-4">{row.renewalDate}</td>
                <td className="py-4 pr-4">{row.properties}</td>
                <td className="py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 text-xs font-medium ${statusClasses[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
