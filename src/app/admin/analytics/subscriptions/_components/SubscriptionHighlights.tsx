type SubscriptionHighlightsProps = {
  items: string[];
};

export const SubscriptionHighlights = ({
  items,
}: SubscriptionHighlightsProps) => {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div>
        <h2 className="text-lg font-semibold">Subscription Notes</h2>
        <p className="text-sm text-muted-foreground">
          Platform billing observations across active tenants, trials, and renewals.
        </p>
      </div>

      <div className="mt-5 space-y-3 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <p
            key={item}
            className={
              index === 0
                ? "rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-violet-800"
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
