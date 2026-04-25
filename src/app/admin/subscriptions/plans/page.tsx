import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { PlansBuilder } from "./_components/plans-builder";

const insights =
  "Plan configuration is mostly ready, but 2 offers still need annual pricing review and 1 featured tier should be finalized before publishing to tenant signup flows.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <PlansBuilder />
    </div>
  );
};

export default Page;
