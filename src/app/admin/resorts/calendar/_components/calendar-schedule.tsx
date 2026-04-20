"use client";
"use no memo";

import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ResortCalendarEvent } from "./calendar-data";

type CalendarScheduleProps = {
  events: ResortCalendarEvent[];
};

const eventClasses: Record<ResortCalendarEvent["status"], string> = {
  Confirmed: "fc-event-confirmed",
  "Checked In": "fc-event-checkedin",
  Checkout: "fc-event-checkout",
  Blocked: "fc-event-blocked",
};

const statusBadgeClasses: Record<ResortCalendarEvent["status"], string> = {
  Confirmed: "bg-blue-100 text-blue-700",
  "Checked In": "bg-emerald-100 text-emerald-700",
  Checkout: "bg-amber-100 text-amber-700",
  Blocked: "bg-rose-100 text-rose-700",
};

export const CalendarSchedule = ({ events }: CalendarScheduleProps) => {
  const [selectedEvent, setSelectedEvent] =
    React.useState<ResortCalendarEvent | null>(null);

  return (
    <>
      <section className="resort-calendar-shell rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900">
        <div>
          <h2 className="text-lg font-semibold">Booking Schedule</h2>
          <p className="text-sm text-muted-foreground">
            Unified monthly, weekly, and daily booking calendar across all
            tenant resorts.
          </p>
        </div>

        <div className="mt-5 overflow-hidden  border bg-background">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day",
            }}
            events={events.map((event) => ({
              id: event.id,
              title: `${event.roomName} · ${event.guestName}`,
              start: event.start,
              end: event.end,
              className: eventClasses[event.status],
              extendedProps: {
                resortName: event.resortName,
                tenantName: event.tenantName,
                roomName: event.roomName,
                guestName: event.guestName,
                source: event.source,
                status: event.status,
              },
            }))}
            eventClick={(info) => {
              const match = events.find((event) => event.id === info.event.id);
              if (match) setSelectedEvent(match);
            }}
            eventContent={(arg) => (
              <div className="fc-event-card">
                <div className="fc-event-title">{arg.event.title}</div>
                <div className="fc-event-meta">
                  {arg.event.extendedProps.resortName} ·{" "}
                  {arg.event.extendedProps.status}
                </div>
              </div>
            )}
            dayMaxEvents={3}
            editable={false}
            selectable={false}
            nowIndicator
          />
        </div>
      </section>

      <Sheet
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      >
        <SheetContent side="right" className="w-full max-w-md!">
          {selectedEvent ? (
            <>
              <SheetHeader>
                <SheetTitle>{selectedEvent.guestName}</SheetTitle>
                <SheetDescription>
                  Detailed booking information for {selectedEvent.roomName} at{" "}
                  {selectedEvent.resortName}.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 px-4 pb-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={statusBadgeClasses[selectedEvent.status]}
                    variant="outline"
                  >
                    {selectedEvent.status}
                  </Badge>
                  <Badge variant="outline">{selectedEvent.source}</Badge>
                </div>

                <div className=" border p-4">
                  <div className="space-y-3">
                    <DetailRow label="Guest" value={selectedEvent.guestName} />
                    <DetailRow
                      label="Tenant"
                      value={selectedEvent.tenantName}
                    />
                    <DetailRow
                      label="Resort"
                      value={selectedEvent.resortName}
                    />
                    <DetailRow label="Room" value={selectedEvent.roomName} />
                    <DetailRow label="Start" value={selectedEvent.start} />
                    <DetailRow label="End" value={selectedEvent.end} />
                    <DetailRow label="Source" value={selectedEvent.source} />
                  </div>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="text-sm font-medium">Booking Note</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Use this quick sheet to inspect schedule details before
                    moving to the reservations or operations modules.
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
};
