import { Heading } from "@/components/custom/Heading";
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
      <div className="space-y-4">
        <Heading
          title="User Roles & Access"
          description="Manage role templates, permission coverage, and approval guardrails so tenant and platform teams have the right level of access without expanding risk."
        />

        <RolesSummaryStrip items={rolesMetrics} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <RolesWorkspace
            templates={roleTemplates}
            permissionGroups={permissionGroups}
            assignments={accessAssignments}
          />
        </div>

        <div className="min-w-0">
          <RolesSidePanel reviewQueue={reviewQueue} />
        </div>
      </div>
    </div>
  );
};
