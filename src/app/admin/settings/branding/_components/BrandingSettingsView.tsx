import { Heading } from "@/components/custom/Heading";
import { BrandingMetricCards } from "./BrandingMetricCards";
import { BrandingWorkspace } from "./BrandingWorkspace";
import {
  brandingMetrics,
  themeOptions,
} from "./branding-data";

export const BrandingSettingsView = () => {
  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <Heading
          title="Platform Branding"
          description="Manage the shared visual system, asset kit, and publishing rules that shape the Alrio experience across admin and guest-facing touchpoints."
        />

        <BrandingMetricCards items={brandingMetrics} />
      </div>

      <BrandingWorkspace themeOptions={themeOptions} />
    </div>
  );
};
