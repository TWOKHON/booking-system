"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Bot, CircleCheckBig, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowNodeData } from "../../_components/workflow-automation-data";

const toneMap: Record<WorkflowNodeData["kind"], string> = {
  trigger: "border-blue-200 bg-blue-50 text-blue-700",
  condition: "border-amber-200 bg-amber-50 text-amber-700",
  action: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const iconMap = {
  trigger: Zap,
  condition: CircleCheckBig,
  action: Bot,
} satisfies Record<WorkflowNodeData["kind"], React.ComponentType<{ className?: string }>>;

export const AutomationNode = ({ data }: NodeProps) => {
  const typedData = data as WorkflowNodeData;
  const Icon = iconMap[typedData.kind];

  return (
    <div className="min-w-56 rounded-2xl border bg-white shadow-sm dark:bg-neutral-900">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-background !bg-primary"
      />

      <div
        className={cn(
          "rounded-t-2xl border-b px-4 py-2 text-xs font-medium",
          toneMap[typedData.kind],
        )}
      >
        <div className="flex items-center gap-2">
          <Icon className="size-3.5" />
          <span className="capitalize">{typedData.kind}</span>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <p className="font-medium">{typedData.title}</p>
        <p className="text-xs text-muted-foreground">{typedData.subtitle}</p>
      </div>

      <Handle
        id="yes"
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-background !bg-primary"
      />
    </div>
  );
};
