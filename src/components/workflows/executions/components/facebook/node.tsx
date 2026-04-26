"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../BaseExecutionNode";
import { FacebookDialog, type FacebookFormValues } from "./dialog";

type FacebookNodeData = {
  variableName?: string;
  pageName?: string;
  message?: string;
};

type FacebookNodeType = Node<FacebookNodeData>;

export const FacebookNode = memo((props: NodeProps<FacebookNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: FacebookFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id
          ? {
              ...node,
              data: {
                ...node.data,
                ...values,
              },
            }
          : node,
      ),
    );
  };

  const nodeData = props.data;
  const description = nodeData?.message
    ? `Post to ${nodeData.pageName || "Facebook"}`
    : "Not configured";

  return (
    <>
      <FacebookDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/brands/facebook.svg"
        name="Facebook"
        status="initial"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

FacebookNode.displayName = "FacebookNode";
