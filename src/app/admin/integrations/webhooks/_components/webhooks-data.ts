export type WebhookRecord = {
  id: string;
  endpointName: string;
  provider: string;
  eventType:
    | "Booking Created"
    | "Payment Settled"
    | "Invoice Issued"
    | "OTA Sync"
    | "Refund Posted";
  environment: "Production" | "Sandbox";
  webhookStatus: "Active" | "Retrying" | "Review" | "Paused";
  deliveryHealth: "Healthy" | "Watch" | "Failing";
  successRate: string;
  retryWindow: string;
  assignedTo: string;
  lastTriggered: string;
  note: string;
  priority: boolean;
};

export const webhookRecords: WebhookRecord[] = [
  {
    id: "WH-6101",
    endpointName: "Stripe settlement callback",
    provider: "Stripe",
    eventType: "Payment Settled",
    environment: "Production",
    webhookStatus: "Active",
    deliveryHealth: "Healthy",
    successRate: "99.8%",
    retryWindow: "No active retries",
    assignedTo: "Kara Mendoza",
    lastTriggered: "3 mins ago",
    note: "Primary payment settlement webhook for subscription and guest payment confirmation.",
    priority: false,
  },
  {
    id: "WH-6102",
    endpointName: "PayMongo signature verifier",
    provider: "PayMongo",
    eventType: "Payment Settled",
    environment: "Production",
    webhookStatus: "Review",
    deliveryHealth: "Failing",
    successRate: "82.1%",
    retryWindow: "Retry queue building",
    assignedTo: "Liza Ong",
    lastTriggered: "6 mins ago",
    note: "Production signature verification needs review after timeout spikes on callback validation.",
    priority: true,
  },
  {
    id: "WH-6103",
    endpointName: "Booking.com reservation push",
    provider: "Booking.com",
    eventType: "Booking Created",
    environment: "Production",
    webhookStatus: "Active",
    deliveryHealth: "Healthy",
    successRate: "99.3%",
    retryWindow: "No active retries",
    assignedTo: "Mira Valdez",
    lastTriggered: "5 mins ago",
    note: "Resort reservation intake webhook remains stable across mapped properties.",
    priority: false,
  },
  {
    id: "WH-6104",
    endpointName: "Airbnb reservation bridge",
    provider: "Airbnb",
    eventType: "Booking Created",
    environment: "Production",
    webhookStatus: "Retrying",
    deliveryHealth: "Watch",
    successRate: "91.4%",
    retryWindow: "Retrying for 18 mins",
    assignedTo: "Noel Ramos",
    lastTriggered: "9 mins ago",
    note: "Recent delivery retries are tied to endpoint latency on villa reservation intake.",
    priority: true,
  },
  {
    id: "WH-6105",
    endpointName: "Billing invoice dispatcher",
    provider: "Internal Billing",
    eventType: "Invoice Issued",
    environment: "Production",
    webhookStatus: "Active",
    deliveryHealth: "Healthy",
    successRate: "98.9%",
    retryWindow: "No active retries",
    assignedTo: "Janine Castro",
    lastTriggered: "12 mins ago",
    note: "Internal webhook used to fan out invoice events into tenant communication flows.",
    priority: false,
  },
  {
    id: "WH-6106",
    endpointName: "GCash settlement notifier",
    provider: "GCash",
    eventType: "Payment Settled",
    environment: "Sandbox",
    webhookStatus: "Paused",
    deliveryHealth: "Watch",
    successRate: "0%",
    retryWindow: "Paused for sandbox maintenance",
    assignedTo: "Mina Torres",
    lastTriggered: "1 day ago",
    note: "Sandbox webhook paused while test credentials are being refreshed.",
    priority: false,
  },
  {
    id: "WH-6107",
    endpointName: "SiteMinder inventory hook",
    provider: "SiteMinder",
    eventType: "OTA Sync",
    environment: "Production",
    webhookStatus: "Retrying",
    deliveryHealth: "Watch",
    successRate: "93.2%",
    retryWindow: "Retrying for 11 mins",
    assignedTo: "Aira Santos",
    lastTriggered: "8 mins ago",
    note: "Channel sync endpoint is retrying inventory events for two mapped room groups.",
    priority: true,
  },
  {
    id: "WH-6108",
    endpointName: "Refund reconciliation hook",
    provider: "Internal Finance",
    eventType: "Refund Posted",
    environment: "Production",
    webhookStatus: "Review",
    deliveryHealth: "Watch",
    successRate: "95.7%",
    retryWindow: "Review payload ordering",
    assignedTo: "Cleo Rivera",
    lastTriggered: "15 mins ago",
    note: "Refund event ordering needs review before next reconciliation close window.",
    priority: false,
  },
];
