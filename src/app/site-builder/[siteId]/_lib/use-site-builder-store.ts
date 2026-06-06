"use client";

import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { temporal } from "zundo";
import {
  createDefaultBuilderPageSchema,
  createCanvasNodeFromComponent,
  type BuilderPageSchema,
  type BuilderSchemaSeedInput,
  type BuilderCanvasPlacement,
  type BuilderCanvasNode,
  type BuilderCanvasComponentType,
  type BuilderViewport,
} from "./builder-schema";

function updateNodeInTree(
  nodes: BuilderCanvasNode[],
  nodeId: string,
  updater: (node: BuilderCanvasNode) => BuilderCanvasNode,
): BuilderCanvasNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return updater(node);
    }

    if (node.type === "container") {
      return {
        ...node,
        children: updateNodeInTree(node.children, nodeId, updater),
      };
    }

    return node;
  });
}

function removeNodeFromTree(
  nodes: BuilderCanvasNode[],
  nodeId: string,
): BuilderCanvasNode[] {
  return nodes
    .filter((node) => node.id !== nodeId)
    .map((node) => {
      if (node.type === "container") {
        return {
          ...node,
          children: removeNodeFromTree(node.children, nodeId),
        };
      }

      return node;
    });
}

function findNodeInTree(
  nodes: BuilderCanvasNode[],
  nodeId: string | null,
): BuilderCanvasNode | null {
  if (!nodeId) {
    return null;
  }

  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }

    if (node.type === "container") {
      const next = findNodeInTree(node.children, nodeId);

      if (next) {
        return next;
      }
    }
  }

  return null;
}

function extractNodeFromTree(
  nodes: BuilderCanvasNode[],
  nodeId: string,
): { nodes: BuilderCanvasNode[]; extracted: BuilderCanvasNode | null } {
  let extracted: BuilderCanvasNode | null = null;

  const nextNodes = nodes
    .filter((node) => {
      if (node.id === nodeId) {
        extracted = node;
        return false;
      }

      return true;
    })
    .map((node) => {
      if (node.type === "container") {
        const result = extractNodeFromTree(node.children, nodeId);

        if (result.extracted) {
          extracted = result.extracted;
        }

        return {
          ...node,
          children: result.nodes,
        };
      }

      return node;
    });

  return {
    nodes: nextNodes,
    extracted,
  };
}

function insertNodeIntoContainer(
  nodes: BuilderCanvasNode[],
  containerId: string,
  nodeToInsert: BuilderCanvasNode,
): BuilderCanvasNode[] {
  return nodes.map((node) => {
    if (node.id === containerId && node.type === "container") {
      return {
        ...node,
        children: [...node.children, nodeToInsert],
      };
    }

    if (node.type === "container") {
      return {
        ...node,
        children: insertNodeIntoContainer(node.children, containerId, nodeToInsert),
      };
    }

    return node;
  });
}

function isNodeInsideContainer(
  nodes: BuilderCanvasNode[],
  nodeId: string,
  containerId: string,
): boolean {
  const targetContainer = findNodeInTree(nodes, containerId);

  if (!targetContainer || targetContainer.type !== "container") {
    return false;
  }

  return findNodeInTree(targetContainer.children, nodeId) !== null;
}

type SiteBuilderStore = {
  page: BuilderPageSchema | null;
  viewport: BuilderViewport;
  initializedSiteId: string | null;
  selectedNodeId: string | null;
  initialize: (input: BuilderSchemaSeedInput) => void;
  setViewport: (viewport: BuilderViewport) => void;
  addComponentToCanvas: (
    componentKey: BuilderCanvasComponentType,
    placement?: Partial<BuilderCanvasPlacement>,
  ) => void;
  addComponentToContainer: (
    containerId: string,
    componentKey: BuilderCanvasComponentType,
    placement?: Partial<BuilderCanvasPlacement>,
  ) => void;
  selectCanvasNode: (nodeId: string | null) => void;
  updateCanvasNode: (
    nodeId: string,
    updater: (node: BuilderCanvasNode) => BuilderCanvasNode,
  ) => void;
  updateCanvasNodePlacement: (
    nodeId: string,
    placement: Partial<BuilderCanvasPlacement>,
  ) => void;
  moveCanvasNodeToContainer: (
    nodeId: string,
    containerId: string,
    placement: Partial<BuilderCanvasPlacement>,
  ) => void;
  moveCanvasNodeToRoot: (
    nodeId: string,
    placement: Partial<BuilderCanvasPlacement>,
  ) => void;
  duplicateCanvasNode: (nodeId: string) => void;
  removeCanvasNode: (nodeId: string) => void;
};

export const useSiteBuilderStore = create<SiteBuilderStore>()(
  temporal(
    immer((set) => ({
      page: null,
      viewport: "desktop",
      initializedSiteId: null,
      selectedNodeId: null,
      initialize: (input) =>
        set((state) => {
          if (state.initializedSiteId === input.siteId && state.page) {
            return;
          }

          state.page = createDefaultBuilderPageSchema(input);
          state.initializedSiteId = input.siteId;
          state.selectedNodeId = null;
        }),
      setViewport: (viewport) =>
        set((state) => {
          state.viewport = viewport;
        }),
      addComponentToCanvas: (componentKey, placement) =>
        set((state) => {
          if (!state.page) {
            return;
          }

          const nextNode = createCanvasNodeFromComponent(
            componentKey,
            state.page.canvasItems.length,
            placement,
          );

          state.page.canvasItems.push(nextNode);
          state.selectedNodeId = nextNode.id;
          state.page.breadcrumbs = [
            "Body",
            "Canvas",
            nextNode.type === "heading"
              ? "Heading"
              : nextNode.type === "text"
                ? "Text"
                : nextNode.type === "button"
                  ? "Button"
                  : nextNode.label,
          ];
        }),
      addComponentToContainer: (containerId, componentKey, placement) =>
        set((state) => {
          if (!state.page) {
            return;
          }

          state.page.canvasItems = updateNodeInTree(
            state.page.canvasItems,
            containerId,
            (node) => {
              if (node.type !== "container") {
                return node;
              }

              const nextChild = createCanvasNodeFromComponent(
                componentKey,
                node.children.length,
                placement,
              );

              state.selectedNodeId = nextChild.id;

              return {
                ...node,
                children: [...node.children, nextChild],
              };
            },
          );
        }),
      selectCanvasNode: (nodeId) =>
        set((state) => {
          state.selectedNodeId = nodeId;

          if (!state.page) {
            return;
          }

          const nextNode = findNodeInTree(state.page.canvasItems, nodeId);

          state.page.breadcrumbs = nextNode
            ? [
                "Body",
                "Canvas",
                nextNode.type === "heading"
                  ? "Heading"
                  : nextNode.type === "text"
                    ? "Text"
                    : nextNode.type === "button"
                      ? "Button"
                      : nextNode.label,
              ]
            : ["Body", "Canvas"];
        }),
      updateCanvasNode: (nodeId, updater) =>
        set((state) => {
          if (!state.page) {
            return;
          }

          state.page.canvasItems = updateNodeInTree(
            state.page.canvasItems,
            nodeId,
            updater,
          );

          const nextNode = findNodeInTree(state.page.canvasItems, nodeId);

          if (!nextNode) {
            return;
          }
          state.page.breadcrumbs = [
            "Body",
            "Canvas",
            nextNode.type === "heading"
              ? "Heading"
              : nextNode.type === "text"
                ? "Text"
                : nextNode.type === "button"
                  ? "Button"
                  : nextNode.label,
          ];
        }),
      updateCanvasNodePlacement: (nodeId, placement) =>
        set((state) => {
          if (!state.page) {
            return;
          }

          const targetNode = findNodeInTree(state.page.canvasItems, nodeId);

          if (!targetNode) {
            return;
          }

          targetNode.placement = {
            ...targetNode.placement,
            ...placement,
          };
        }),
      moveCanvasNodeToContainer: (nodeId, containerId, placement) =>
        set((state) => {
          if (!state.page || nodeId === containerId) {
            return;
          }

          if (isNodeInsideContainer(state.page.canvasItems, containerId, nodeId)) {
            return;
          }

          const extractedResult = extractNodeFromTree(state.page.canvasItems, nodeId);

          if (!extractedResult.extracted) {
            return;
          }

          const nextNode = {
            ...extractedResult.extracted,
            placement: {
              ...extractedResult.extracted.placement,
              ...placement,
            },
          } satisfies BuilderCanvasNode;

          state.page.canvasItems = insertNodeIntoContainer(
            extractedResult.nodes,
            containerId,
            nextNode,
          );
          state.selectedNodeId = nextNode.id;
        }),
      moveCanvasNodeToRoot: (nodeId, placement) =>
        set((state) => {
          if (!state.page) {
            return;
          }

          const extractedResult = extractNodeFromTree(state.page.canvasItems, nodeId);

          if (!extractedResult.extracted) {
            return;
          }

          const nextNode = {
            ...extractedResult.extracted,
            placement: {
              ...extractedResult.extracted.placement,
              ...placement,
            },
          } satisfies BuilderCanvasNode;

          state.page.canvasItems = [...extractedResult.nodes, nextNode];
          state.selectedNodeId = nextNode.id;
        }),
      duplicateCanvasNode: (nodeId) =>
        set((state) => {
          if (!state.page) {
            return;
          }

          const sourceNode = findNodeInTree(state.page.canvasItems, nodeId);

          if (!sourceNode) {
            return;
          }

          const duplicateIndex = state.page.canvasItems.length + 1;
          const duplicatedNode = {
            ...sourceNode,
            id: `${sourceNode.type}-${duplicateIndex}-${Date.now()}`,
            placement: {
              ...sourceNode.placement,
              x: sourceNode.placement.x + 32,
              y: sourceNode.placement.y + 32,
            },
          } satisfies BuilderCanvasNode;

          state.page.canvasItems.push(duplicatedNode);
          state.selectedNodeId = duplicatedNode.id;
        }),
      removeCanvasNode: (nodeId) =>
        set((state) => {
          if (!state.page) {
            return;
          }

          state.page.canvasItems = removeNodeFromTree(
            state.page.canvasItems,
            nodeId,
          );

          if (state.selectedNodeId === nodeId) {
            state.selectedNodeId = null;
          }

          state.page.breadcrumbs =
            state.page.canvasItems.length > 0 ? ["Body", "Canvas"] : ["Body"];
        }),
    })),
    {
      partialize: (state) => ({
        page: state.page,
      }),
    },
  ),
);

export function useCanUndo() {
  return useStore(
    useSiteBuilderStore.temporal,
    (state) => state.pastStates.length > 0,
  );
}

export function useCanRedo() {
  return useStore(
    useSiteBuilderStore.temporal,
    (state) => state.futureStates.length > 0,
  );
}
