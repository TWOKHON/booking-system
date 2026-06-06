import type { CSSProperties, ReactNode } from "react";

type ColumnsBlockProps = {
  columns: number;
  gap: number;
  puck?: {
    renderDropZone: (props: { zone: string }) => ReactNode;
  };
};

const columnClasses: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-4",
};

export function ColumnsBlock({ columns, gap, puck }: ColumnsBlockProps) {
  const columnCount = Math.min(Math.max(columns || 1, 1), 4);

  return (
      <div
          className={`grid gap-(--columns-gap) ${columnClasses[columnCount]}`}
          style={{ "--columns-gap": `${gap ?? 0}px` } as CSSProperties}
      >
        {Array.from({ length: columnCount }).map((_, i) => (
            <div key={`column-${i}`}>{puck?.renderDropZone({ zone: `column-${i}` })}</div>
        ))}
      </div>
  );
}