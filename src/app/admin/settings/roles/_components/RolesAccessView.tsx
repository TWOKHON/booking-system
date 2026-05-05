import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { RolesSidePanel } from "./RolesSidePanel";
import { RolesSummaryStrip } from "./RolesSummaryStrip";
import { RolesWorkspace } from "./RolesWorkspace";
import {
  accessAssignments,
  permissionGroups,
  reviewQueue,
  roleTemplates,
  rolesMetrics,
} from "./roles-data";

export const RolesAccessView = () => {
  return (
    <div className="space-y-5">
      <TuroInsightCard message="Access controls are in a stable state today, but three privileged accounts and four pending MFA enrollments should be reviewed before the next audit window." />

      <RolesSummaryStrip items={rolesMetrics} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <RolesWorkspace
            templates={roleTemplates}
            permissionGroups={permissionGroups}
            assignments={accessAssignments}
          />
        </div>

        <div className="min-w-0 xl:pt-1">
          <RolesSidePanel reviewQueue={reviewQueue} />
        </div>
      </div>
    </div>
  );
};
