"use client";

import { nodeComponents } from "@/config/node-components";
import { NodeType } from "@/config/node-enums";
import { editorAtom } from "@/lib/atoms";
import {
  ReactFlow,
  Panel,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";
import { useSetAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { AddNodeButton } from "./AddNodeButton";
import { ExecuteWorkflowButton } from "./ExecuteWorkflowButton";

const buildFrontendWorkflow = (workflowId: string) => {
  const nodes: Node[] = [
    {
      id: `${workflowId}-trigger`,
      type: NodeType.MANUAL_TRIGGER,
      position: { x: 120, y: 180 },
      data: {
        title: "Trigger manually",
        description: "Starts the workflow from the frontend builder.",
      },
    },
    {
      id: `${workflowId}-openai`,
      type: NodeType.OPENAI,
      position: { x: 420, y: 180 },
      data: {
        title: "OpenAI step",
        description: "Mock AI processing node for UI testing only.",
      },
    },
    {
      id: `${workflowId}-slack`,
      type: NodeType.SLACK,
      position: { x: 720, y: 180 },
      data: {
        title: "Slack update",
        description: "Mock outbound communication node for preview.",
      },
    },
  ];

  const edges: Edge[] = [
    {
      id: `${workflowId}-edge-1`,
      source: `${workflowId}-trigger`,
      target: `${workflowId}-openai`,
      animated: true,
    },
    {
      id: `${workflowId}-edge-2`,
      source: `${workflowId}-openai`,
      target: `${workflowId}-slack`,
      animated: true,
    },
  ];

  return { nodes, edges };
};

export const WorkflowEditor = ({ workflowId }: { workflowId: string }) => {
  const setEditor = useSetAtom(editorAtom);
  const initialWorkflow = useMemo(() => buildFrontendWorkflow(workflowId), [workflowId]);

  const [nodes, setNodes] = useState<Node[]>(initialWorkflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(initialWorkflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) =>
        addEdge({ ...params, animated: true }, edgesSnapshot),
      ),
    [],
  );

  const hasManualTrigger = useMemo(
    () => nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER),
    [nodes],
  );

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        onInit={setEditor}
        fitView
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        {hasManualTrigger ? (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        ) : null}
      </ReactFlow>
    </div>
  );
};
