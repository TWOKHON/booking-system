"use client";

import * as React from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  CopyPlusIcon,
  GripIcon,
  ImageIcon,
  LinkIcon,
  MousePointerSquareDashedIcon,
  Rows3Icon,
  Settings2Icon,
  Trash2Icon,
  TypeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type BuilderCanvasNode,
  type BuilderCanvasPlacement,
} from "../_lib/builder-schema";
import { useSiteBuilderStore } from "../_lib/use-site-builder-store";

type BuilderCanvasPreviewProps = {
  isDropTargetActive: boolean;
  canvasRef: React.Ref<HTMLDivElement>;
};

type InlineEditingTarget = {
  nodeId: string;
  field: "label" | "text" | "href";
};

const GUIDE_SNAP_THRESHOLD = 10;

function snapToGuide(
  value: number,
  guides: number[],
  threshold = GUIDE_SNAP_THRESHOLD,
) {
  const nearestGuide = guides.reduce((nearest, guide) => {
    if (Math.abs(guide - value) < Math.abs(nearest - value)) {
      return guide;
    }

    return nearest;
  }, guides[0] ?? value);

  return Math.abs(nearestGuide - value) <= threshold ? nearestGuide : value;
}

const viewportShellClasses = {
  desktop: "w-full",
  tablet: "mx-auto max-w-[834px]",
  mobile: "mx-auto max-w-[430px]",
} as const;

export function BuilderCanvasPreview({
  isDropTargetActive,
  canvasRef,
}: BuilderCanvasPreviewProps) {
  const page = useSiteBuilderStore((state) => state.page);
  const viewport = useSiteBuilderStore((state) => state.viewport);
  const selectedNodeId = useSiteBuilderStore((state) => state.selectedNodeId);
  const selectCanvasNode = useSiteBuilderStore((state) => state.selectCanvasNode);
  const updateCanvasNode = useSiteBuilderStore((state) => state.updateCanvasNode);
  const updateCanvasNodePlacement = useSiteBuilderStore(
    (state) => state.updateCanvasNodePlacement,
  );
  const duplicateCanvasNode = useSiteBuilderStore((state) => state.duplicateCanvasNode);
  const removeCanvasNode = useSiteBuilderStore((state) => state.removeCanvasNode);

  if (!page) {
    return (
      <div className="rounded-3xl border bg-white p-10 text-center text-sm text-zinc-500 shadow-sm">
        Loading builder canvas...
      </div>
    );
  }

  const hasCanvasItems = page.canvasItems.length > 0;

  return (
    <div className={viewportShellClasses[viewport]}>
      <div
        className={`overflow-hidden border bg-white shadow-sm transition ${
          isDropTargetActive ? "border-green-300 ring-2 ring-green-200" : ""
        }`}
      >
        <div className="border-b bg-white px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold text-zinc-900">
                {page.resortName}
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                Blank canvas builder
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full capitalize">
                {viewport} view
              </Badge>
              <Badge
                variant={page.publishStatus === "Live" ? "secondary" : "outline"}
                className="rounded-full"
              >
                {page.publishStatus}
              </Badge>
            </div>
          </div>
        </div>

        <div className="relative bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] px-6 py-8 md:px-8 md:py-10">
          {isDropTargetActive ? (
            <div className="pointer-events-none absolute inset-x-6 top-6 z-20 rounded-2xl border border-dashed border-green-300 bg-white/90 px-4 py-3 text-center text-sm font-medium text-green-900 shadow-sm md:inset-x-8">
              Drop component into the canvas
            </div>
          ) : null}

          <div
            ref={canvasRef}
            className={`relative min-h-275 border-2 border-dashed bg-white/92 transition ${
              isDropTargetActive ? "border-green-300" : "border-zinc-200"
            }`}
            onClick={() => selectCanvasNode(null)}
          >
            <CanvasGuides />
            {!hasCanvasItems ? (
              <div className="flex min-h-274 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-700">
                  <MousePointerSquareDashedIcon className="size-7" />
                </div>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">
                  Start from scratch
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500">
                  Drag a component from the left panel into this canvas to start
                  building your site. Components can be placed freely, resized,
                  and containers can now hold child blocks like navigation links.
                </p>
              </div>
            ) : (
              page.canvasItems.map((item) => (
                <CanvasNodeCard
                  key={item.id}
                  item={item}
                  isSelected={selectedNodeId === item.id}
                  onSelect={selectCanvasNode}
                  onUpdate={updateCanvasNode}
                  onUpdatePlacement={updateCanvasNodePlacement}
                  onDuplicate={duplicateCanvasNode}
                  onDelete={removeCanvasNode}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-white px-5 py-3 text-xs text-zinc-500">
          <div className="flex flex-wrap items-center gap-2">
            {page.breadcrumbs.map((crumb) => (
              <span key={crumb} className="rounded-full border px-2.5 py-1">
                {crumb}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span>Save draft</span>
            <span>Free-position canvas ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type CanvasNodeCardProps = {
  item: BuilderCanvasNode;
  isSelected: boolean;
  onSelect: (nodeId: string | null) => void;
  onUpdate: (
    nodeId: string,
    updater: (node: BuilderCanvasNode) => BuilderCanvasNode,
  ) => void;
  onUpdatePlacement: (
    nodeId: string,
    placement: Partial<BuilderCanvasPlacement>,
  ) => void;
  onDuplicate: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
};

function CanvasNodeCard({
  item,
  isSelected,
  onSelect,
  onUpdate,
  onUpdatePlacement,
  onDuplicate,
  onDelete,
}: CanvasNodeCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `canvas-node-${item.id}`,
      data: {
        nodeId: item.id,
        source: "canvas-node",
      },
    });

  const nodeRef = React.useRef<HTMLDivElement | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [editingTarget, setEditingTarget] =
    React.useState<InlineEditingTarget | null>(null);
  const [draftValue, setDraftValue] = React.useState("");

  const style: React.CSSProperties = {
    left: item.placement.x,
    top: item.placement.y,
    width: item.placement.width,
    minHeight: item.placement.height,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : isSelected ? 30 : 10,
  };

  const dragHandleProps = {
    ...listeners,
    ...attributes,
  };

  const startInlineEdit = React.useCallback(
    (field: InlineEditingTarget["field"], currentValue: string) => {
      setEditingTarget({ nodeId: item.id, field });
      setDraftValue(currentValue);
    },
    [item.id],
  );

  const commitInlineEdit = React.useCallback(() => {
    if (!editingTarget) {
      return;
    }

    const nextValue = draftValue.trim();

    if (!nextValue) {
      setEditingTarget(null);
      setDraftValue("");
      return;
    }

    onUpdate(item.id, (node) => {
      if (editingTarget.field === "label" && node.type === "button") {
        return { ...node, label: nextValue };
      }

      if (editingTarget.field === "label" && node.type === "link") {
        return { ...node, label: nextValue };
      }

      if (editingTarget.field === "href" && node.type === "link") {
        return { ...node, href: nextValue };
      }

      if (editingTarget.field === "text" && node.type === "text") {
        return { ...node, text: nextValue };
      }

      if (editingTarget.field === "text" && node.type === "heading") {
        return { ...node, text: nextValue };
      }

      return node;
    });

    setEditingTarget(null);
    setDraftValue("");
  }, [draftValue, editingTarget, item.id, onUpdate]);

  const cancelInlineEdit = React.useCallback(() => {
    setEditingTarget(null);
    setDraftValue("");
  }, []);

  const handleResizePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();

      const startX = event.clientX;
      const startY = event.clientY;
      const startWidth = item.placement.width;
      const startHeight = item.placement.height;
      const parentSurface =
        nodeRef.current?.parentElement instanceof HTMLElement
          ? nodeRef.current.parentElement
          : null;
      const parentBounds = parentSurface?.getBoundingClientRect() ?? null;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const nextWidth = Math.max(120, startWidth + (moveEvent.clientX - startX));
        const nextHeight = Math.max(48, startHeight + (moveEvent.clientY - startY));
        const maxWidth = parentBounds
          ? Math.max(120, parentBounds.width - item.placement.x - 12)
          : nextWidth;
        const maxHeight = parentBounds
          ? Math.max(48, parentBounds.height - item.placement.y - 12)
          : nextHeight;
        const symmetricWidth = parentBounds
          ? Math.max(120, parentBounds.width - item.placement.x * 2)
          : nextWidth;
        const snappedWidth = parentBounds
          ? snapToGuide(Math.min(nextWidth, maxWidth), [symmetricWidth, maxWidth])
          : nextWidth;
        const snappedHeight = parentBounds
          ? snapToGuide(Math.min(nextHeight, maxHeight), [maxHeight])
          : nextHeight;

        onUpdatePlacement(item.id, {
          width: snappedWidth,
          height: snappedHeight,
        });
      };

      const handlePointerUp = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [
      item.id,
      item.placement.height,
      item.placement.width,
      item.placement.x,
      item.placement.y,
      onUpdatePlacement,
    ],
  );

  const isEditingLabel =
    editingTarget?.nodeId === item.id && editingTarget.field === "label";
  const isEditingHref =
    editingTarget?.nodeId === item.id && editingTarget.field === "href";
  const isEditingText =
    editingTarget?.nodeId === item.id && editingTarget.field === "text";

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        nodeRef.current = node;
      }}
      data-builder-node-id={item.id}
      style={style}
      className="group absolute"
      onClick={(event) => {
        event.stopPropagation();
        onSelect(item.id);
      }}
    >
      <div
        ref={wrapperRef}
        className={`relative rounded-2xl border bg-white px-4 py-4 shadow-sm transition ${
          isSelected
            ? "border-blue-500 ring-1 ring-blue-400"
            : "border-zinc-200 hover:border-zinc-300"
        }`}
        {...dragHandleProps}
      >
        <div
          className={`absolute -top-11 left-2 flex items-center gap-1 rounded-t-xl rounded-br-xl bg-blue-600 px-2 py-1 text-white shadow-lg transition ${
            isSelected
              ? "opacity-100"
              : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <span className="max-w-28 truncate px-1 text-xs font-medium capitalize">
            {item.type === "heading"
              ? "Heading"
              : item.type === "text"
                ? "Text"
                : item.type === "button"
                  ? "Button"
                  : item.type === "link"
                    ? "Link"
                    : item.label}
          </span>

          <button
            type="button"
            className="rounded-md p-1 hover:bg-white/15"
            aria-label="Move block"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <GripIcon className="size-3.5" />
          </button>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="rounded-md p-1 hover:bg-white/15"
                aria-label="Edit block"
                onPointerDown={(event) => event.stopPropagation()}
              >
                <Settings2Icon className="size-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              sideOffset={8}
              className="w-80 rounded-2xl p-4"
            >
              <InlineNodeEditor item={item} onUpdate={onUpdate} />
            </PopoverContent>
          </Popover>

          <button
            type="button"
            className="rounded-md p-1 hover:bg-white/15"
            aria-label="Duplicate block"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onDuplicate(item.id)}
          >
            <CopyPlusIcon className="size-3.5" />
          </button>

          <button
            type="button"
            className="rounded-md p-1 hover:bg-white/15"
            aria-label="Delete block"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onDelete(item.id)}
          >
            <Trash2Icon className="size-3.5" />
          </button>
        </div>

        {item.type === "button" ? (
          isEditingLabel ? (
            <Input
              autoFocus
              value={draftValue}
              className="h-11 rounded-xl"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => setDraftValue(event.target.value)}
              onBlur={commitInlineEdit}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitInlineEdit();
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  cancelInlineEdit();
                }
              }}
            />
          ) : (
            <Button
              className={
                item.variant === "primary"
                  ? "rounded-xl bg-green-950 px-5 hover:bg-green-900"
                  : "rounded-xl border border-zinc-300 bg-white px-5 text-zinc-900 hover:bg-zinc-50"
              }
              variant={item.variant === "primary" ? "default" : "outline"}
              onDoubleClick={(event) => {
                event.stopPropagation();
                startInlineEdit("label", item.label);
              }}
            >
              {item.label}
            </Button>
          )
        ) : item.type === "link" ? (
          <div className="space-y-2">
            {isEditingLabel ? (
              <Input
                autoFocus
                value={draftValue}
                className="h-10 rounded-xl"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => setDraftValue(event.target.value)}
                onBlur={commitInlineEdit}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commitInlineEdit();
                  }

                  if (event.key === "Escape") {
                    event.preventDefault();
                    cancelInlineEdit();
                  }
                }}
              />
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  startInlineEdit("label", item.label);
                }}
              >
                <LinkIcon className="size-4" />
                {item.label}
              </button>
            )}

            {isEditingHref ? (
              <Input
                autoFocus
                value={draftValue}
                className="h-9 rounded-xl text-xs"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => setDraftValue(event.target.value)}
                onBlur={commitInlineEdit}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commitInlineEdit();
                  }

                  if (event.key === "Escape") {
                    event.preventDefault();
                    cancelInlineEdit();
                  }
                }}
              />
            ) : (
              <div
                className="text-xs text-zinc-500"
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  startInlineEdit("href", item.href);
                }}
              >
                {item.href}
              </div>
            )}
          </div>
        ) : item.type === "text" ? (
          isEditingText ? (
            <Textarea
              autoFocus
              rows={5}
              value={draftValue}
              className="resize-none rounded-xl"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => setDraftValue(event.target.value)}
              onBlur={commitInlineEdit}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  commitInlineEdit();
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  cancelInlineEdit();
                }
              }}
            />
          ) : (
            <p
              className="text-base leading-7 text-zinc-700"
              onDoubleClick={(event) => {
                event.stopPropagation();
                startInlineEdit("text", item.text);
              }}
            >
              {item.text}
            </p>
          )
        ) : item.type === "heading" ? (
          isEditingText ? (
            <Input
              autoFocus
              value={draftValue}
              className="h-12 rounded-xl text-lg font-semibold"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => setDraftValue(event.target.value)}
              onBlur={commitInlineEdit}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitInlineEdit();
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  cancelInlineEdit();
                }
              }}
            />
          ) : (
            <div
              onDoubleClick={(event) => {
                event.stopPropagation();
                startInlineEdit("text", item.text);
              }}
            >
              <HeadingPreview item={item} />
            </div>
          )
        ) : item.type === "container" ? (
          <ContainerNodeContent
            item={item}
            onSelect={onSelect}
            onUpdate={onUpdate}
            onUpdatePlacement={onUpdatePlacement}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        ) : item.type === "divider" ? (
          <div className="h-px w-full bg-zinc-200" />
        ) : item.type === "spacer" ? (
          <div className="flex h-16 items-center justify-center rounded-xl border border-dashed border-zinc-200 text-xs text-zinc-400">
            Spacer block
          </div>
        ) : item.type === "columns" || item.type === "grid" ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <Rows3Icon className="size-4" />
              {item.label}
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {item.description}
            </p>
          </div>
        ) : item.type === "image" ||
          item.type === "gallery" ||
          item.type === "video" ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <ImageIcon className="size-4" />
              {item.label}
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {item.description}
            </p>
          </div>
        ) : item.type === "form" ||
          item.type === "input" ||
          item.type === "textarea" ||
          item.type === "select" ||
          item.type === "checkbox" ||
          item.type === "radio" ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <TypeIcon className="size-4" />
              {item.label}
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {item.description}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="text-sm font-medium text-zinc-700">{item.label}</div>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {item.description}
            </p>
          </div>
        )}

        <button
          type="button"
          className="absolute right-1.5 bottom-1.5 h-4 w-4 cursor-se-resize rounded-sm border border-zinc-300 bg-white shadow-sm hover:border-blue-400"
          onPointerDown={handleResizePointerDown}
          aria-label="Resize block"
        />
      </div>
    </div>
  );
}

function CanvasGuides() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute top-0 left-0 h-px w-full bg-blue-100/70" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-blue-100/70" />
      <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-blue-200/70" />
      <div className="absolute top-0 left-0 h-full w-px bg-blue-100/70" />
      <div className="absolute top-0 right-0 h-full w-px bg-blue-100/70" />
      <div className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-blue-200/70" />

      <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-blue-700 shadow-sm">
        top
      </span>
      <span className="absolute right-2 bottom-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-blue-700 shadow-sm">
        bottom
      </span>
      <span className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-blue-700 shadow-sm">
        center
      </span>
      <span className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-blue-700 shadow-sm">
        left
      </span>
      <span className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-blue-700 shadow-sm">
        right
      </span>
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-blue-700 shadow-sm">
        middle
      </span>
    </div>
  );
}

function ContainerNodeContent({
  item,
  onSelect,
  onUpdate,
  onUpdatePlacement,
  onDuplicate,
  onDelete,
}: {
  item: Extract<BuilderCanvasNode, { type: "container" }>;
  onSelect: (nodeId: string | null) => void;
  onUpdate: (
    nodeId: string,
    updater: (node: BuilderCanvasNode) => BuilderCanvasNode,
  ) => void;
  onUpdatePlacement: (
    nodeId: string,
    placement: Partial<BuilderCanvasPlacement>,
  ) => void;
  onDuplicate: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
}) {
  const selectedNodeId = useSiteBuilderStore((state) => state.selectedNodeId);
  const { setNodeRef, isOver } = useDroppable({
    id: `container-drop-${item.id}`,
  });

  return (
    <div className="relative min-h-30 overflow-hidden rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/70 p-4">
      <div
        className={`rounded-2xl transition ${
          isOver ? "bg-green-50/80" : ""
        }`}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-900">{item.label}</div>
            <div className="text-xs text-zinc-500">
              Use this as a structural wrapper for headers, nav, or grouped blocks.
            </div>
          </div>
          <Badge variant="outline" className="rounded-full">
            children {item.children.length}
          </Badge>
        </div>

        {item.children.length === 0 ? (
          <div
            ref={setNodeRef}
            className="flex min-h-18 items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white/90 text-xs text-zinc-500"
          >
            Drop links, text, buttons, or headings into this container
          </div>
        ) : (
          <div
            ref={setNodeRef}
            className="relative min-h-30 overflow-hidden rounded-xl border border-dashed border-zinc-200 bg-white/90 p-2"
          >
            {item.children.map((child) => (
              <CanvasNodeCard
                key={child.id}
                item={child}
                isSelected={selectedNodeId === child.id}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onUpdatePlacement={onUpdatePlacement}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HeadingPreview({
  item,
}: {
  item: Extract<BuilderCanvasNode, { type: "heading" }>;
}) {
  if (item.level === 1) {
    return (
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
        {item.text}
      </h1>
    );
  }

  if (item.level === 3) {
    return (
      <h3 className="text-2xl font-semibold tracking-tight text-zinc-900">
        {item.text}
      </h3>
    );
  }

  return (
    <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
      {item.text}
    </h2>
  );
}

function InlineNodeEditor({
  item,
  onUpdate,
}: {
  item: BuilderCanvasNode;
  onUpdate: (
    nodeId: string,
    updater: (node: BuilderCanvasNode) => BuilderCanvasNode,
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-semibold text-zinc-900">Edit block</div>
        <div className="mt-1 text-xs text-zinc-500">
          Update this component directly from the canvas.
        </div>
      </div>

      {item.type === "button" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor={`button-label-${item.id}`}>Button label</Label>
            <Input
              id={`button-label-${item.id}`}
              value={item.label}
              onChange={(event) =>
                onUpdate(item.id, (node) =>
                  node.type === "button"
                    ? { ...node, label: event.target.value }
                    : node,
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`button-variant-${item.id}`}>Variant</Label>
            <Select
              value={item.variant}
              onValueChange={(value) =>
                onUpdate(item.id, (node) =>
                  node.type === "button"
                    ? {
                        ...node,
                        variant: value === "primary" ? "primary" : "secondary",
                      }
                    : node,
                )
              }
            >
              <SelectTrigger id={`button-variant-${item.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      ) : item.type === "link" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor={`link-label-${item.id}`}>Link label</Label>
            <Input
              id={`link-label-${item.id}`}
              value={item.label}
              onChange={(event) =>
                onUpdate(item.id, (node) =>
                  node.type === "link"
                    ? { ...node, label: event.target.value }
                    : node,
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`link-href-${item.id}`}>Href</Label>
            <Input
              id={`link-href-${item.id}`}
              value={item.href}
              onChange={(event) =>
                onUpdate(item.id, (node) =>
                  node.type === "link"
                    ? { ...node, href: event.target.value }
                    : node,
                )
              }
            />
          </div>
        </>
      ) : item.type === "text" ? (
        <div className="space-y-2">
          <Label htmlFor={`text-content-${item.id}`}>Text content</Label>
          <Textarea
            id={`text-content-${item.id}`}
            rows={7}
            value={item.text}
            onChange={(event) =>
              onUpdate(item.id, (node) =>
                node.type === "text"
                  ? { ...node, text: event.target.value }
                  : node,
              )
            }
          />
        </div>
      ) : item.type === "heading" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor={`heading-text-${item.id}`}>Heading text</Label>
            <Input
              id={`heading-text-${item.id}`}
              value={item.text}
              onChange={(event) =>
                onUpdate(item.id, (node) =>
                  node.type === "heading"
                    ? { ...node, text: event.target.value }
                    : node,
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`heading-level-${item.id}`}>Heading level</Label>
            <Select
              value={String(item.level)}
              onValueChange={(value) =>
                onUpdate(item.id, (node) =>
                  node.type === "heading"
                    ? {
                        ...node,
                        level: value === "1" ? 1 : value === "3" ? 3 : 2,
                      }
                    : node,
                )
              }
            >
              <SelectTrigger id={`heading-level-${item.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1</SelectItem>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      ) : item.type === "container" ? (
        <div className="space-y-2">
          <Label htmlFor={`container-label-${item.id}`}>Container label</Label>
          <Input
            id={`container-label-${item.id}`}
            value={item.label}
            onChange={(event) =>
              onUpdate(item.id, (node) =>
                node.type === "container"
                  ? { ...node, label: event.target.value }
                  : node,
              )
            }
          />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor={`block-label-${item.id}`}>Block label</Label>
            <Input
              id={`block-label-${item.id}`}
              value={item.label}
              onChange={(event) =>
                onUpdate(item.id, (node) =>
                  "label" in node ? { ...node, label: event.target.value } : node,
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`block-description-${item.id}`}>Description</Label>
            <Textarea
              id={`block-description-${item.id}`}
              rows={6}
              value={item.description}
              onChange={(event) =>
                onUpdate(item.id, (node) =>
                  "description" in node
                    ? { ...node, description: event.target.value }
                    : node,
                )
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
