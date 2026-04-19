type UsageHighlightsProps = {
  items: string[];
};

export const UsageHighlights = ({ items }: UsageHighlightsProps) => {
  return (
    <section>
      <div>
        <h2 className="text-lg font-semibold">System Usage Notes</h2>
        <p className="text-sm text-muted-foreground">
          Admin observations on how tenants are adopting and operating inside the platform.
        </p>
      </div>

      <div className="mt-5 space-y-3 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <p
            key={item}
            className={
              index === 0
                ? "border border-orange-200 bg-orange-50 px-4 py-3 text-orange-800"
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
