import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { PoliciesSummaryStrip } from "./PoliciesSummaryStrip";
import { PoliciesWorkspace } from "./PoliciesWorkspace";
import {
  policyMetrics,
  policyRecords,
} from "./policies-data";

export const PoliciesView = () => {
  return (
    <div className="space-y-5">
      <TuroInsightCard message="Policy coverage is steady today, but two draft approvals and one AI revision still need attention before the next governance export goes out." />

      <PoliciesSummaryStrip items={policyMetrics} />

      <PoliciesWorkspace records={policyRecords} />
    </div>
  );
};
