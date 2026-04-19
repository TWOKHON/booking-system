type TenantRevenueRow = {
  tenant: string;
  plan: string;
  properties: number;
  grossRevenue: string;
  platformRevenue: string;
  payoutStatus: string;
  collectionRate: string;
};

type TenantRevenueTableProps = {
  rows: TenantRevenueRow[];
};

const payoutClasses: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  Released: "bg-emerald-100 text-emerald-700",
  Review: "bg-amber-100 text-amber-700",
};

export const TenantRevenueTable = ({ rows }: TenantRevenueTableProps) => {
  return (
    <section className="border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Tenant Revenue Ledger</h2>
          <p className="text-sm text-muted-foreground">
            Revenue visibility across each tenant, including payout and collection status.
          </p>
        </div>
        <div className="bg-neutral-100 px-3 py-1 text-xs text-muted-foreground dark:bg-neutral-800">
          8 active tenant accounts
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-muted-foreground">
            <tr>
              <th className="py-3 font-medium">Tenant</th>
              <th className="py-3 font-medium">Gross Revenue</th>
              <th className="py-3 font-medium">Platform Revenue</th>
              <th className="py-3 font-medium">Collection Rate</th>
              <th className="py-3 font-medium">Payout</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.tenant}>
                <td className="py-4">
                  <p className="font-medium">{row.tenant}</p>
                </td>
                <td className="py-4 font-medium">{row.grossRevenue}</td>
                <td className="py-4 text-emerald-700">{row.platformRevenue}</td>
                <td className="py-4">{row.collectionRate}</td>
                <td className="py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 text-xs font-medium ${
                      payoutClasses[row.payoutStatus]
                    }`}
                  >
                    {row.payoutStatus}
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
