const resorts = [
  { name: "Sunset Resort", revenue: 23000 },
  { name: "Ocean View", revenue: 18500 },
  { name: "Palm Beach", revenue: 14200 },
];

export const TopResorts = () => {
  return (
    <div className="rounded-2xl border bg-white dark:bg-neutral-900 p-6">
      <h2 className="font-semibold text-lg mb-4">Top Resorts</h2>

      <div className="space-y-4">
        {resorts.map((r, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm">
              <span>{r.name}</span>
              <span>₱{r.revenue.toLocaleString()}</span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-2 bg-black dark:bg-white rounded-full"
                style={{ width: `${60 - i * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
