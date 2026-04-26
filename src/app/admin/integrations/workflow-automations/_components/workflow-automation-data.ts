import type { Edge, Node } from "@xyflow/react";

export type WorkflowAutomationRecord = {
  id: string;
  name: string;
  domain: "Reservations" | "Operations" | "Communications" | "Revenue";
  status: "Active" | "Draft" | "Review" | "Paused";
  triggerLabel: string;
  runVolume: number;
  successRate: string;
  assignedTo: string;
  lastUpdated: string;
  note: string;
  priority: boolean;
};

export type WorkflowNodeData = {
  title: string;
  subtitle: string;
  kind: "trigger" | "condition" | "action";
};

export type WorkflowTemplate = {
  id: string;
  title: string;
  description: string;
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
};

export const workflowAutomationRecords: WorkflowAutomationRecord[] = [
  {
    id: "reservation-arrival-assist",
    name: "Arrival readiness assistant",
    domain: "Reservations",
    status: "Active",
    triggerLabel: "Reservation confirmed",
    runVolume: 1280,
    successRate: "98.4%",
    assignedTo: "Kara Mendoza",
    lastUpdated: "7 mins ago",
    note: "Automates guest pre-arrival messages, balance reminders, and room-readiness tasks.",
    priority: false,
  },
  {
    id: "housekeeping-turnover-priority",
    name: "Housekeeping turnover priority",
    domain: "Operations",
    status: "Review",
    triggerLabel: "Checkout posted",
    runVolume: 640,
    successRate: "92.6%",
    assignedTo: "Mina Torres",
    lastUpdated: "10 mins ago",
    note: "Routes same-day turnovers to housekeeping and inspection when high-priority arrivals exist.",
    priority: true,
  },
  {
    id: "payment-failed-recovery",
    name: "Failed payment recovery",
    domain: "Revenue",
    status: "Active",
    triggerLabel: "Subscription payment failed",
    runVolume: 214,
    successRate: "95.1%",
    assignedTo: "Liza Ong",
    lastUpdated: "14 mins ago",
    note: "Retries billing, alerts finance, and notifies tenant admins before service interruption.",
    priority: true,
  },
  {
    id: "guest-review-nurture",
    name: "Guest review nurture",
    domain: "Communications",
    status: "Draft",
    triggerLabel: "Checkout completed",
    runVolume: 480,
    successRate: "89.7%",
    assignedTo: "Janine Castro",
    lastUpdated: "19 mins ago",
    note: "Sends thank-you, feedback prompts, and escalation follow-up based on guest sentiment.",
    priority: false,
  },
  {
    id: "ota-overbook-guard",
    name: "OTA overbook guard",
    domain: "Reservations",
    status: "Paused",
    triggerLabel: "Inventory mismatch detected",
    runVolume: 76,
    successRate: "87.2%",
    assignedTo: "Noel Ramos",
    lastUpdated: "22 mins ago",
    note: "Pauses high-risk room types, notifies front desk, and opens manual review on mapping conflicts.",
    priority: true,
  },
];

const buildTemplate = (
  id: string,
  title: string,
  description: string,
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
): WorkflowTemplate => ({
  id,
  title,
  description,
  nodes,
  edges,
});

export const workflowTemplates: Record<string, WorkflowTemplate> = {
  "reservation-arrival-assist": buildTemplate(
    "reservation-arrival-assist",
    "Arrival readiness assistant",
    "Coordinates guest messaging, payment checks, and room readiness before arrival.",
    [
      {
        id: "trigger-1",
        type: "automation",
        position: { x: 40, y: 80 },
        data: {
          title: "Reservation confirmed",
          subtitle: "Trigger when a direct or OTA booking becomes confirmed",
          kind: "trigger",
        },
      },
      {
        id: "condition-1",
        type: "automation",
        position: { x: 320, y: 80 },
        data: {
          title: "Arrival within 72 hours?",
          subtitle: "Check arrival window before guest operations begin",
          kind: "condition",
        },
      },
      {
        id: "action-1",
        type: "automation",
        position: { x: 620, y: 20 },
        data: {
          title: "Send pre-arrival message",
          subtitle: "Share check-in details, directions, and amenity reminders",
          kind: "action",
        },
      },
      {
        id: "action-2",
        type: "automation",
        position: { x: 620, y: 160 },
        data: {
          title: "Open room readiness task",
          subtitle: "Notify housekeeping and front desk if turnover is still pending",
          kind: "action",
        },
      },
      {
        id: "action-3",
        type: "automation",
        position: { x: 930, y: 80 },
        data: {
          title: "Alert team if balance due",
          subtitle: "Escalate pending payment before arrival is finalized",
          kind: "action",
        },
      },
    ],
    [
      { id: "e1", source: "trigger-1", target: "condition-1", animated: true },
      { id: "e2", source: "condition-1", sourceHandle: "yes", target: "action-1" },
      { id: "e3", source: "condition-1", sourceHandle: "yes", target: "action-2" },
      { id: "e4", source: "action-1", target: "action-3", animated: true },
    ],
  ),
  "housekeeping-turnover-priority": buildTemplate(
    "housekeeping-turnover-priority",
    "Housekeeping turnover priority",
    "Prioritizes room turnover based on same-day arrivals and inspection urgency.",
    [
      {
        id: "trigger-1",
        type: "automation",
        position: { x: 40, y: 80 },
        data: {
          title: "Checkout posted",
          subtitle: "Trigger after a guest leaves and room status becomes dirty",
          kind: "trigger",
        },
      },
      {
        id: "condition-1",
        type: "automation",
        position: { x: 330, y: 80 },
        data: {
          title: "New arrival today?",
          subtitle: "Check if the room is tied to an incoming same-day reservation",
          kind: "condition",
        },
      },
      {
        id: "action-1",
        type: "automation",
        position: { x: 640, y: 20 },
        data: {
          title: "Raise housekeeping priority",
          subtitle: "Push turnover to the top of the cleaning queue",
          kind: "action",
        },
      },
      {
        id: "action-2",
        type: "automation",
        position: { x: 640, y: 160 },
        data: {
          title: "Assign inspection follow-up",
          subtitle: "Create inspection task when room becomes ready",
          kind: "action",
        },
      },
    ],
    [
      { id: "e1", source: "trigger-1", target: "condition-1", animated: true },
      { id: "e2", source: "condition-1", sourceHandle: "yes", target: "action-1" },
      { id: "e3", source: "condition-1", sourceHandle: "yes", target: "action-2" },
    ],
  ),
  "payment-failed-recovery": buildTemplate(
    "payment-failed-recovery",
    "Failed payment recovery",
    "Recovers failed subscription or resort billing events with alerts and retry logic.",
    [
      {
        id: "trigger-1",
        type: "automation",
        position: { x: 40, y: 80 },
        data: {
          title: "Payment failed",
          subtitle: "Trigger when recurring billing or invoice collection is declined",
          kind: "trigger",
        },
      },
      {
        id: "action-1",
        type: "automation",
        position: { x: 330, y: 30 },
        data: {
          title: "Retry billing in 6 hours",
          subtitle: "Create delayed retry before escalating the account",
          kind: "action",
        },
      },
      {
        id: "condition-1",
        type: "automation",
        position: { x: 330, y: 170 },
        data: {
          title: "Second failure?",
          subtitle: "Check if retry still failed after the first recovery attempt",
          kind: "condition",
        },
      },
      {
        id: "action-2",
        type: "automation",
        position: { x: 640, y: 30 },
        data: {
          title: "Notify tenant admins",
          subtitle: "Send billing notice with payment update instructions",
          kind: "action",
        },
      },
      {
        id: "action-3",
        type: "automation",
        position: { x: 640, y: 170 },
        data: {
          title: "Open finance review task",
          subtitle: "Escalate for manual follow-up before service impact",
          kind: "action",
        },
      },
    ],
    [
      { id: "e1", source: "trigger-1", target: "action-1", animated: true },
      { id: "e2", source: "action-1", target: "condition-1" },
      { id: "e3", source: "condition-1", sourceHandle: "yes", target: "action-2" },
      { id: "e4", source: "condition-1", sourceHandle: "yes", target: "action-3" },
    ],
  ),
  "guest-review-nurture": buildTemplate(
    "guest-review-nurture",
    "Guest review nurture",
    "Handles post-stay messaging and review recovery paths after checkout.",
    [
      {
        id: "trigger-1",
        type: "automation",
        position: { x: 40, y: 80 },
        data: {
          title: "Checkout completed",
          subtitle: "Start after a stay is marked complete in the resort PMS",
          kind: "trigger",
        },
      },
      {
        id: "action-1",
        type: "automation",
        position: { x: 330, y: 30 },
        data: {
          title: "Send thank-you note",
          subtitle: "Message guest with appreciation and review invitation",
          kind: "action",
        },
      },
      {
        id: "condition-1",
        type: "automation",
        position: { x: 330, y: 170 },
        data: {
          title: "Negative feedback detected?",
          subtitle: "Check reply sentiment or low-score review submission",
          kind: "condition",
        },
      },
      {
        id: "action-2",
        type: "automation",
        position: { x: 640, y: 170 },
        data: {
          title: "Open guest recovery case",
          subtitle: "Route issue to communications and operations leads",
          kind: "action",
        },
      },
    ],
    [
      { id: "e1", source: "trigger-1", target: "action-1", animated: true },
      { id: "e2", source: "action-1", target: "condition-1" },
      { id: "e3", source: "condition-1", sourceHandle: "yes", target: "action-2" },
    ],
  ),
  "ota-overbook-guard": buildTemplate(
    "ota-overbook-guard",
    "OTA overbook guard",
    "Detects inventory mismatch and protects room availability across OTA channels.",
    [
      {
        id: "trigger-1",
        type: "automation",
        position: { x: 40, y: 80 },
        data: {
          title: "Inventory mismatch detected",
          subtitle: "Trigger when channel availability differs from live room inventory",
          kind: "trigger",
        },
      },
      {
        id: "condition-1",
        type: "automation",
        position: { x: 330, y: 80 },
        data: {
          title: "Risk of overbook?",
          subtitle: "Check whether mismatch touches bookable units within arrival window",
          kind: "condition",
        },
      },
      {
        id: "action-1",
        type: "automation",
        position: { x: 640, y: 20 },
        data: {
          title: "Pause channel inventory",
          subtitle: "Temporarily block affected room types on the channel",
          kind: "action",
        },
      },
      {
        id: "action-2",
        type: "automation",
        position: { x: 640, y: 160 },
        data: {
          title: "Notify reservations team",
          subtitle: "Create manual review ticket for front desk and OTA owner",
          kind: "action",
        },
      },
    ],
    [
      { id: "e1", source: "trigger-1", target: "condition-1", animated: true },
      { id: "e2", source: "condition-1", sourceHandle: "yes", target: "action-1" },
      { id: "e3", source: "condition-1", sourceHandle: "yes", target: "action-2" },
    ],
  ),
  new: buildTemplate(
    "new",
    "New workflow",
    "Start a new automation for resort operations, communications, reservations, or revenue workflows.",
    [
      {
        id: "trigger-1",
        type: "automation",
        position: { x: 70, y: 100 },
        data: {
          title: "Select a trigger",
          subtitle: "Reservation, payment, OTA, housekeeping, or guest event",
          kind: "trigger",
        },
      },
      {
        id: "action-1",
        type: "automation",
        position: { x: 380, y: 100 },
        data: {
          title: "Add next action",
          subtitle: "Message guest, assign task, update room, or sync external system",
          kind: "action",
        },
      },
    ],
    [{ id: "e1", source: "trigger-1", target: "action-1", animated: true }],
  ),
};
