import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { messageRecords } from "./_components/messages-data";
import { MessagesSummary } from "./_components/messages-summary";
import { MessagesTable } from "./_components/messages-table";

const insights =
  "Message activity is elevated today, but 3 urgent threads still need responses and 2 tenant or guest conversations have already crossed into escalation watch.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <MessagesSummary data={messageRecords} />
      <MessagesTable />
    </div>
  );
};

export default Page;
