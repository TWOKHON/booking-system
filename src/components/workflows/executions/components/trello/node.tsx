"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../BaseExecutionNode";
import { TrelloDialog, type TrelloFormValues } from "./dialog";

type TrelloNodeData = {
  variableName?: string;
  boardName?: string;
  listName?: string;
  cardTitle?: string;
};

type TrelloNodeType = Node<TrelloNodeData>;

export const TrelloNode = memo((props: NodeProps<TrelloNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: TrelloFormValues) => {
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
  const description = nodeData?.cardTitle
    ? `${nodeData.boardName || "Board"} • ${nodeData.cardTitle}`
    : "Not configured";

  return (
    <>
      <TrelloDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/brands/trello.svg"
        name="Trello"
        status="initial"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

TrelloNode.displayName = "TrelloNode";
