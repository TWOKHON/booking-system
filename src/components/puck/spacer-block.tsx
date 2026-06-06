import type { CSSProperties } from "react";

type SpacerBlockProps = {
  height: number;
};

export function SpacerBlock({ height }: SpacerBlockProps) {
  return (
    <div
      className="h-[var(--spacer-height)]"
      style={{ "--spacer-height": `${height ?? 0}px` } as CSSProperties}
    />
  );
}
