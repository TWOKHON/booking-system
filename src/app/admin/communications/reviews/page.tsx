import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { reviewRecords } from "./_components/reviews-data";
import { ReviewsSummary } from "./_components/reviews-summary";
import { ReviewsTable } from "./_components/reviews-table";

const insights =
  "Review activity is elevated today, but 3 low-rating posts still need responses and 2 public reviews are already approaching escalation if service recovery is delayed.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <ReviewsSummary data={reviewRecords} />
      <ReviewsTable />
    </div>
  );
};

export default Page;
