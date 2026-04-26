import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

export const Hint = ({
  triggerChildren,
  contentChildren,
}: {
  triggerChildren: ReactNode;
  contentChildren: ReactNode;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{triggerChildren}</TooltipTrigger>
        <TooltipContent>{contentChildren}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
