import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { BrandingMetricCards } from "./BrandingMetricCards";
import { BrandingWorkspace } from "./BrandingWorkspace";
import {
  brandingMetrics,
  themeOptions,
} from "./branding-data";

export const BrandingSettingsView = () => {
  return (
    <div className="space-y-5">
      <TuroInsightCard message="Brand governance is mostly healthy today. Two asset exports still need review before the next guest-facing rollout goes live." />

      <BrandingMetricCards items={brandingMetrics} />

      <BrandingWorkspace themeOptions={themeOptions} />
    </div>
  );
};
