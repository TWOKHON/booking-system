type ReservationPipelineItem = {
  label: string;
  value: string;
  note: string;
};

type ReservationPipelineProps = {
  items: ReservationPipelineItem[];
};

export const ReservationPipeline = ({
  items,
}: ReservationPipelineProps) => {
  return (
    <section className="grid gap-6">
      <div className="border bg-white p-5 shadow-sm dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Reservation Pipeline</h2>
            <p className="text-sm text-muted-foreground">
              Track inquiry conversion, approval bottlenecks, and payment
              follow-ups.
            </p>
          </div>
          <div className="bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            76% confirmation rate
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          {items.map((item) => (
            <div key={item.label} className="border p-3.5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-lg font-semibold">{item.value}</p>
              </div>
              <p className="mt-2.5 text-sm text-muted-foreground">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
