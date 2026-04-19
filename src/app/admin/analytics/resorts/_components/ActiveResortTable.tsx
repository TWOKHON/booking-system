type ActiveResortRow = {
  resort: string;
  tenant: string;
  region: string;
  occupancy: string;
  bookingsToday: string;
  operationsLoad: string;
  staffActivity: string;
  status: string;
};

type ActiveResortTableProps = {
  rows: ActiveResortRow[];
};

const statusClasses: Record<string, string> = {
  Healthy: "bg-emerald-100 text-emerald-700",
  Busy: "bg-blue-100 text-blue-700",
  Attention: "bg-amber-100 text-amber-700",
};

export const ActiveResortTable = ({ rows }: ActiveResortTableProps) => {
  return (
    <section className="border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Active Resort Monitor</h2>
          <p className="text-sm text-muted-foreground">
            Only resorts with current bookings, staff activity, or operations movement are shown here.
          </p>
        </div>
        <div className="bg-neutral-100 px-3 py-1 text-xs text-muted-foreground dark:bg-neutral-800">
          12 active resorts today
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-muted-foreground">
            <tr>
              <th className="py-3 font-medium">Resort</th>
              <th className="py-3 font-medium">Occupancy</th>
              <th className="py-3 font-medium">Bookings Today</th>
              <th className="py-3 font-medium">Operations</th>
              <th className="py-3 font-medium">Staff Activity</th>
              <th className="py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.resort}>
                <td className="py-4">
                  <p className="font-medium">{row.resort}</p>
                  <p className="text-xs text-muted-foreground">{row.tenant} - {row.region}</p>
                </td>
                <td className="py-4 font-medium">{row.occupancy}</td>
                <td className="py-4">{row.bookingsToday}</td>
                <td className="py-4">{row.operationsLoad}</td>
                <td className="py-4">{row.staffActivity}</td>
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
