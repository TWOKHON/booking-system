import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { AuditLogsTable } from "./AuditLogsTable";
import { AuditSummaryStrip } from "./AuditSummaryStrip";
import { auditLogRecords, auditMetrics } from "./audit-data";

export const AuditLogsView = () => {
  return (
    <div className="space-y-5">
      <TuroInsightCard message="Audit coverage is healthy today, but one unusual elevated login pattern and several pending MFA reminders still deserve review." />

      <AuditSummaryStrip items={auditMetrics} />

      <AuditLogsTable records={auditLogRecords} />
    </div>
  );
};
