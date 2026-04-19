type TenantUsageRow = {
  tenant: string;
  mostUsedModule: string;
  staffLogins: string;
  workflowEvents: string;
  responseRate: string;
  lastActive: string;
  status: string;
};

type TenantUsageTableProps = {
  rows: TenantUsageRow[];
};

const statusClasses: Record<string, string> = {
  Engaged: "bg-emerald-100 text-emerald-700",
  Active: "bg-blue-100 text-blue-700",
  Light: "bg-amber-100 text-amber-700",
};

export const TenantUsageTable = ({ rows }: TenantUsageTableProps) => {
  return (
    <section className="border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Tenant Usage Activity</h2>
          <p className="text-sm text-muted-foreground">
            Tenant workspaces ranked by system activity, staff logins, and daily workflow movement.
          </p>
        </div>
        <div className=" bg-neutral-100 px-3 py-1 text-xs text-muted-foreground dark:bg-neutral-800">
          10 active workspaces tracked
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-muted-foreground">
            <tr>
              <th className="py-3 font-medium">Tenant</th>
              <th className="py-3 font-medium">Most Used Module</th>
              <th className="py-3 font-medium">Workflow Events</th>
              <th className="py-3 font-medium">Response Rate</th>
              <th className="py-3 font-medium">Last Active</th>
              <th className="py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.tenant}>
                <td className="py-4">
                  <p className="font-medium">{row.tenant}</p>
                  <p className="text-xs text-muted-foreground">Tenant workspace</p>
                </td>
                <td className="py-4">{row.mostUsedModule}</td>
                <td className="py-4">{row.workflowEvents}</td>
                <td className="py-4">{row.responseRate}</td>
                <td className="py-4">{row.lastActive}</td>
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
