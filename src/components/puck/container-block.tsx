import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerBlockProps = {
  maxWidth: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  paddingX: number;
  paddingY: number;
  background: string;
  puck?: {
    renderDropZone: (props: { zone: string }) => ReactNode;
  };
};

const maxWidthMap = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
} as const;

export function ContainerBlock({
  maxWidth,
  paddingX,
  paddingY,
  background,
  puck,
}: ContainerBlockProps) {
  const style = {
    "--container-padding-x": `${paddingX ?? 0}px`,
    "--container-padding-y": `${paddingY ?? 0}px`,
    background: background || "transparent",
  } as CSSProperties;

  return (
    <div style={style}>
      <div
        className={cn(
          "mx-auto px-(--container-padding-x) py-(--container-padding-y)",
          maxWidthMap[maxWidth] ?? "max-w-7xl"
        )}
      >
        {puck?.renderDropZone({ zone: "content" })}
      </div>
    </div>
  );
}
