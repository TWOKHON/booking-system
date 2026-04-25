import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { emailSmsRecords } from "./_components/email-sms-data";
import { EmailSmsSummary } from "./_components/email-sms-summary";
import { EmailSmsTable } from "./_components/email-sms-table";

const insights =
  "Email and SMS activity is active today, but 3 outbound sends still need approval or retry and 2 guest-facing campaigns are nearing their scheduled release windows.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <EmailSmsSummary data={emailSmsRecords} />
      <EmailSmsTable />
    </div>
  );
};

export default Page;
