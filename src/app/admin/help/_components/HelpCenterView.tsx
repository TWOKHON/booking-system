import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { helpCategories, helpMetrics, quickLinks } from "./help-data";
import { HelpCenterWorkspace } from "./HelpCenterWorkspace";
import { HelpSummaryStrip } from "./HelpSummaryStrip";

export const HelpCenterView = () => {
  return (
    <div className="space-y-5">
      <TuroInsightCard message="Help coverage is in a good place today. The most requested topics are branding setup, access approvals, audit log review, and AI governance guidance." />

      <HelpSummaryStrip items={helpMetrics} />

      <HelpCenterWorkspace
        quickLinks={quickLinks}
        categories={helpCategories}
      />
    </div>
  );
};
