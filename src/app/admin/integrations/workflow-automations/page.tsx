import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { WorkflowAutomationsSummary } from "./_components/workflow-automations-summary";
import { WorkflowAutomationsTable } from "./_components/workflow-automations-table";
import { workflowAutomationRecords } from "./_components/workflow-automation-data";

const insights =
  "Automation coverage is expanding today, but 2 workflows are still under review before activation and 1 OTA guard flow remains paused pending mapping cleanup.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />
      <WorkflowAutomationsSummary data={workflowAutomationRecords} />
      <WorkflowAutomationsTable />
    </div>
  );
};

export default Page;
