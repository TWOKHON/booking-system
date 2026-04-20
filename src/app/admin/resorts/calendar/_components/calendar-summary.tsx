import {
  CalendarClock,
  CalendarRange,
  DoorOpen,
  ShieldAlert,
} from "lucide-react";
import { ResortCalendarEvent } from "./calendar-data";

type CalendarSummaryProps = {
  events: ResortCalendarEvent[];
};

export const CalendarSummary = ({ events }: CalendarSummaryProps) => {
  const arrivals = events.filter((event) => event.status === "Confirmed").length;
  const checkedIn = events.filter((event) => event.status === "Checked In").length;
  const checkouts = events.filter((event) => event.status === "Checkout").length;
  const blocked = events.filter((event) => event.status === "Blocked").length;

  const cards = [
    {
      title: "Scheduled Arrivals",
      value: String(arrivals),
      meta: "Confirmed bookings currently plotted across tenant resort calendars",
      icon: CalendarRange,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "In-House Stays",
      value: String(checkedIn),
      meta: "Guests already checked in and occupying rooms in the active schedule",
      icon: DoorOpen,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Checkout Flow",
      value: String(checkouts),
      meta: "Scheduled departures and checkout events currently on the board",
      icon: CalendarClock,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Blocked Slots",
      value: String(blocked),
      meta: "Calendar holds caused by maintenance, inspection, or admin controls",
      icon: ShieldAlert,
      tone: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="mt-3 text-2xl font-semibold">{card.value}</p>
              </div>
              <div
                className={`flex size-10 items-center justify-center rounded-full ${card.tone}`}
              >
                <Icon className="size-5" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{card.meta}</p>
          </div>
        );
      })}
    </div>
  );
};
