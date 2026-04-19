type RevenueHighlightsProps = {
  items: string[];
};

export const RevenueHighlights = ({ items }: RevenueHighlightsProps) => {
  return (
    <section>
      <div>
        <h2 className="text-lg font-semibold">Admin Revenue Notes</h2>
        <p className="text-sm text-muted-foreground">
          Cross-tenant insights to help platform admins review revenue health quickly.
        </p>
      </div>

      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <p
            key={item}
            className={
              index === 0
                ? "border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800"
                : "border px-4 py-3"
            }
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  );
};
