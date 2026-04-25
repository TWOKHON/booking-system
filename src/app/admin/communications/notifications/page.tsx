import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { notificationRecords } from "./_components/notifications-data";
import { NotificationsSummary } from "./_components/notifications-summary";
import { NotificationsTable } from "./_components/notifications-table";

const insights =
  "Notification traffic is stable today, but 3 high-priority alerts still need delivery review and 2 tenant-facing broadcasts are waiting on approval before release.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <NotificationsSummary data={notificationRecords} />
      <NotificationsTable />
    </div>
  );
};

export default Page;
