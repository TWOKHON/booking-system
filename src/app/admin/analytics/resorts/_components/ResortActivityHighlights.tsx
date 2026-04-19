type ResortActivityHighlightsProps = {
  items: string[];
};

export const ResortActivityHighlights = ({
  items,
}: ResortActivityHighlightsProps) => {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div>
        <h2 className="text-lg font-semibold">Active Resort Notes</h2>
        <p className="text-sm text-muted-foreground">
          Summary observations from currently active tenant resorts across the platform.
        </p>
      </div>

      <div className="mt-5 space-y-3 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <p
            key={item}
            className={
              index === 0
                ? "rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800"
                : "rounded-2xl border px-4 py-3"
            }
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  );
};
