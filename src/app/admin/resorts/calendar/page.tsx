import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { CalendarSchedule } from "./_components/calendar-schedule";
import { CalendarSidePanel } from "./_components/calendar-side-panel";
import { CalendarSummary } from "./_components/calendar-summary";
import { resortCalendarEvents } from "./_components/calendar-data";

const insights =
  "Calendar coverage is stable today, but 2 blocked stays still affect room turnover and 1 checkout cluster may pressure housekeeping this week.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <CalendarSummary events={resortCalendarEvents} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-10">
        <div className="space-y-6 xl:col-span-7">
          <CalendarSchedule events={resortCalendarEvents} />
        </div>

        <div className="space-y-6 xl:col-span-3">
          <CalendarSidePanel events={resortCalendarEvents} />
        </div>
      </div>
    </div>
  );
};

export default Page;
