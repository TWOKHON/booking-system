"use client";

import { useState } from "react";
import { FlaskConicalIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);

    window.setTimeout(() => {
      setIsExecuting(false);
      window.alert(`Frontend-only workflow demo executed for: ${workflowId}`);
    }, 900);
  };

  return (
    <Button size="lg" onClick={handleExecute} disabled={isExecuting}>
      {isExecuting ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : (
        <FlaskConicalIcon className="size-4" />
      )}
      {isExecuting ? "Executing..." : "Execute workflow"}
    </Button>
  );
};
