import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { RatesOverviewBoard } from "./_components/rates-overview-board";
import { RatesSummary } from "./_components/rates-summary";
import { rateRecords } from "./_components/rates-data";
import { RatesTable } from "./_components/rates-table";

const insights =
  "Rate coverage is healthy today, but 3 units still need pricing review and 2 promo-led rooms are carrying high-demand pressure this week.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <RatesSummary data={rateRecords} />
      <RatesOverviewBoard data={rateRecords} />
      <RatesTable />
    </div>
  );
};

export default Page;
