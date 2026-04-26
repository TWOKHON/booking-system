"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../BaseExecutionNode";
import {
  GoogleCalendarDialog,
  type GoogleCalendarFormValues,
} from "./dialog";

type GoogleCalendarNodeData = {
  variableName?: string;
  calendarName?: string;
  eventTitle?: string;
  startAt?: string;
  endAt?: string;
};

type GoogleCalendarNodeType = Node<GoogleCalendarNodeData>;

export const GoogleCalendarNode = memo(
  (props: NodeProps<GoogleCalendarNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: GoogleCalendarFormValues) => {
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
    const description = nodeData?.eventTitle
      ? `${nodeData.eventTitle} • ${nodeData.calendarName || "Calendar"}`
      : "Not configured";

    return (
      <>
        <GoogleCalendarDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
        />
        <BaseExecutionNode
          {...props}
          id={props.id}
          icon="/brands/google-calendar.svg"
          name="Google Calendar"
          status="initial"
          description={description}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </>
    );
  },
);

GoogleCalendarNode.displayName = "GoogleCalendarNode";
