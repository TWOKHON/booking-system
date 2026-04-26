import { Activity, Bot, MessageSquareShare, Workflow } from "lucide-react";
import { WorkflowAutomationRecord } from "./workflow-automation-data";

type WorkflowAutomationsSummaryProps = {
  data: WorkflowAutomationRecord[];
};

export const WorkflowAutomationsSummary = ({
  data,
}: WorkflowAutomationsSummaryProps) => {
  const activeCount = data.filter((item) => item.status === "Active").length;
  const draftOrReview = data.filter(
    (item) => item.status === "Draft" || item.status === "Review",
  ).length;
  const totalRuns = data.reduce((sum, item) => sum + item.runVolume, 0);
  const communicationWorkflows = data.filter(
    (item) => item.domain === "Communications",
  ).length;

  const cards = [
    {
      title: "Automation Flows",
      value: String(data.length),
      meta: "Workflow automations currently tracked across reservations, operations, revenue, and guest messaging.",
      icon: Workflow,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Active vs Building",
      value: `${activeCount} / ${draftOrReview}`,
      meta: "Live automations compared against workflows still in draft or review before activation.",
      icon: Bot,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Run Throughput",
      value: totalRuns.toLocaleString("en-PH"),
      meta: "Combined execution volume currently moving through the workflow automation layer.",
      icon: Activity,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Comms Flows",
      value: String(communicationWorkflows),
      meta: "Automations dedicated to guest and tenant communication journeys across the platform.",
      icon: MessageSquareShare,
      tone: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="mt-3 text-2xl font-semibold">{card.value}</p>
              </div>
              <div
                className={`flex size-10 items-center justify-center rounded-full ${card.tone}`}
              >
                <Icon className="size-5" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{card.meta}</p>
          </div>
        );
      })}
    </div>
  );
};
