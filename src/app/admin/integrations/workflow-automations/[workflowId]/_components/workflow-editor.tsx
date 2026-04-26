"use client";
"use no memo";

import * as React from "react";
import Link from "next/link";
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  type Connection,
  type Edge,
  type Node,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { ArrowLeft, Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  workflowTemplates,
  type WorkflowAutomationRecord,
  type WorkflowNodeData,
} from "../../_components/workflow-automation-data";
import { AutomationNode } from "./automation-node";

type WorkflowEditorProps = {
  workflow: WorkflowAutomationRecord | null;
  workflowId: string;
};

const nodeTypes = {
  automation: AutomationNode,
};

const cloneNodes = (nodes: Node<WorkflowNodeData>[]) =>
  nodes.map((node) => ({
    ...node,
    data: { ...node.data },
    position: { ...node.position },
  }));

const cloneEdges = (edges: Edge[]) => edges.map((edge) => ({ ...edge }));

export const WorkflowEditor = ({ workflow, workflowId }: WorkflowEditorProps) => {
  const template = workflowTemplates[workflowId] ?? workflowTemplates.new;
  const [nodes, setNodes, onNodesChange] = useNodesState(cloneNodes(template.nodes));
  const [edges, setEdges, onEdgesChange] = useEdgesState(cloneEdges(template.edges));

  React.useEffect(() => {
    const nextTemplate = workflowTemplates[workflowId] ?? workflowTemplates.new;
    setNodes(cloneNodes(nextTemplate.nodes));
    setEdges(cloneEdges(nextTemplate.edges));
  }, [setEdges, setNodes, workflowId]);

  const onConnect = React.useCallback(
    (params: Edge | Connection) =>
      setEdges((currentEdges) => addEdge({ ...params, animated: true }, currentEdges)),
    [setEdges],
  );

  const sidebarItems = [
    {
      title: "Reservation triggers",
      detail: "New booking, arrival window, payment due, cancellation, OTA confirmation",
    },
    {
      title: "Operations actions",
      detail: "Assign housekeeping, alert front desk, open maintenance task, update room state",
    },
    {
      title: "Communications actions",
      detail: "Send SMS, email, internal message, review follow-up, guest recovery note",
    },
    {
      title: "Revenue safeguards",
      detail: "Retry payment, notify finance, hold upgrade, create invoice, escalate billing",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/admin/integrations/workflow-automations">
                <ArrowLeft className="size-4" />
                Back to workflows
              </Link>
            </Button>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">
              {workflow?.name ?? "New workflow builder"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {workflow?.note ?? template.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Play className="size-4" />
            Test workflow
          </Button>
          <Button>
            <Save className="size-4" />
            Save workflow
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <section className="space-y-5 rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900">
          <div>
            <h2 className="text-lg font-semibold">Workflow Outline</h2>
            <p className="text-sm text-muted-foreground">
              Build automations similar to Zapier, n8n, or HighLevel, tuned for
              resort reservations, operations, guest messaging, and billing.
            </p>
          </div>

          <div className="rounded-2xl border bg-muted/20 p-4">
            <p className="text-sm font-medium">
              {workflow?.triggerLabel ?? "Choose a trigger to begin"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {workflow ? `${workflow.domain} automation • ${workflow.status}` : template.description}
            </p>
          </div>

          <div className="space-y-3">
            {sidebarItems.map((item) => (
              <div key={item.title} className="rounded-2xl border p-4">
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-dashed p-4">
            <p className="font-medium">Template intent</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {template.description}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold">Workflow Canvas</h2>
              <p className="text-sm text-muted-foreground">
                Drag, connect, and adjust nodes to model the automation path.
              </p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>{nodes.length} nodes</p>
              <p>{edges.length} connections</p>
            </div>
          </div>

          <div className="h-[720px] w-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <Background gap={20} size={1} />
              <MiniMap pannable zoomable />
              <Controls />
              <Panel position="top-right">
                <div className="rounded-2xl border bg-background/95 px-3 py-2 text-xs shadow-sm backdrop-blur">
                  Use this builder to create and update automation logic stored under
                  `{` /[workflowId] `}
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </section>
      </div>
    </div>
  );
};
