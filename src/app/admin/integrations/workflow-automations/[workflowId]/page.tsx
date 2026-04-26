import { WorkflowEditor } from "@/components/custom/workflows/WorkflowEditor";
import { TuroInsightCard } from "../../../dashboard/_components/TuroInsightCard";
import {
  workflowAutomationRecords,
  workflowTemplates,
} from "../_components/workflow-automation-data";

type WorkflowPageProps = {
  params: Promise<{ workflowId: string }>;
};

const Page = async ({ params }: WorkflowPageProps) => {
  const { workflowId } = await params;
  const workflow =
    workflowAutomationRecords.find((item) => item.id === workflowId) ?? null;
  const template = workflowTemplates[workflowId] ?? workflowTemplates.new;

  const insightMessage =
    workflow?.status === "Active"
      ? `${workflow.name} is currently active with ${workflow.successRate} success and ${workflow.runVolume.toLocaleString("en-PH")} recorded runs across resort workflows.`
      : `${template.title} is still being shaped, so review its trigger, branching logic, and downstream actions before moving it into active automation.`;

  return (
    // <div className="space-y-6">
    //   <TuroInsightCard message={insightMessage} />
    //   <main className="flex-1">
    //     <WorkflowEditor workflowId={workflowId} />
    //   </main>
    // </div>

    <main className="flex-1">
      <WorkflowEditor workflowId={workflowId} />
    </main>
  );
};

export default Page;
