
export const RevenueGoal = () => {
  return (
    <div className="rounded-2xl border bg-white dark:bg-neutral-900 p-5">
      <h2 className="font-semibold text-lg mb-4">Revenue Goal</h2>

      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-8 border-gray-200" />
          <div
            className="absolute inset-0 border-8 border-black dark:border-white"
            style={{
              clipPath: "inset(0 35% 0 0)",
            }}
          />
          <div className="flex items-center justify-center h-full">
            <span className="font-semibold">65%</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-3">
          ₱65,000 of ₱100,000 target
        </p>
      </div>
    </div>
  );
};