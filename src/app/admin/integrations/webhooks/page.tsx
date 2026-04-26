import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { WebhooksSummary } from "./_components/webhooks-summary";
import { webhookRecords } from "./_components/webhooks-data";
import { WebhooksTable } from "./_components/webhooks-table";

const insights =
  "Webhook delivery is mostly stable today, but 3 endpoints are still retrying failed events and 1 production signature route needs immediate review after timeout spikes.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />
      <WebhooksSummary data={webhookRecords} />
      <WebhooksTable />
    </div>
  );
};

export default Page;
