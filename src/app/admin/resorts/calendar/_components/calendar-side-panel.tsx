import { ResortCalendarEvent, calendarStatusMeta } from "./calendar-data";

type CalendarSidePanelProps = {
  events: ResortCalendarEvent[];
};

export const CalendarSidePanel = ({ events }: CalendarSidePanelProps) => {
  const upcoming = [...events]
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <section>
        <div>
          <h2 className="text-lg font-semibold">Schedule Legend</h2>
          <p className="text-sm text-muted-foreground">
            Status cues used across monthly, weekly, and daily booking views.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {calendarStatusMeta.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className={`size-3 rounded-full ${item.tone}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">Schedule state</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div>
          <h2 className="text-lg font-semibold">Upcoming Schedule</h2>
          <p className="text-sm text-muted-foreground">
            Next booking checkpoints currently expected across tenant resorts.
          </p>
        </div>

        <div className="mt-5 space-y-4 overflow-y-auto h-119 no-scrollbar">
          {upcoming.map((event) => (
            <div key={event.id} className="rounded-2xl border p-4">
              <p className="font-medium">{event.guestName}</p>
              <p className="mt-1 text-sm text-muted-foreground">{event.roomName}</p>
              <p className="mt-1 text-sm text-muted-foreground">{event.resortName}</p>
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>{event.start}</span>
                <span>{event.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
