"use client";

import {
  AlertTriangle,
  BedDouble,
  BellRing,
  CalendarCheck,
  ClipboardList,
  DoorOpen,
  Hotel,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { AdminNotes } from "./_components/AdminNotes";
import { BookingTable } from "./_components/BookingTable";
import { ManagementPriorities } from "./_components/ManagementPriorities";
import { OperationsSnapshot } from "./_components/OperationsSnapshot";
import { PropertyHealth } from "./_components/PropertyHealth";
import { ReservationPipeline } from "./_components/ReservationPipeline";
import { RevenueChart } from "./_components/RevenueChart";
import { StatsCard } from "./_components/StatsCard";
import { TuroInsightCard } from "./_components/TuroInsightCard";

const stats = [
  {
    title: "Occupancy Today",
    value: "84%",
    change: "+6 rooms sold",
    icon: BedDouble,
  },
  {
    title: "Arrivals & Departures",
    value: "26",
    change: "14 arrivals pending",
    icon: CalendarCheck,
  },
  {
    title: "Operations Queue",
    value: "19",
    change: "5 urgent tasks",
    icon: ClipboardList,
  },
  {
    title: "Collection Rate",
    value: "92%",
    change: "+4.3% this week",
    icon: ShieldCheck,
  },
];

const operations = [
  {
    title: "Front Desk",
    value: "14 arrivals",
    detail:
      "3 early check-ins and 2 transport requests to confirm before 2:00 PM.",
    icon: DoorOpen,
  },
  {
    title: "Housekeeping",
    value: "11 rooms in turnover",
    detail:
      "Villa 3 and Casita 8 are blocking same-day arrivals until inspection is completed.",
    icon: Sparkles,
  },
  {
    title: "Maintenance",
    value: "4 open work orders",
    detail:
      "Pool pump issue is still active and affects one family villa block.",
    icon: AlertTriangle,
  },
  {
    title: "Resort Facilities",
    value: "All operational",
    detail: "No reported issues with the restaurant, spa, or gym facilities.",
    icon: Hotel,
  },
];

const reservationPipeline = [
  {
    label: "Pending approvals",
    value: "8",
    note: "3 require owner confirmation",
  },
  { label: "Confirmed this week", value: "42", note: "68% direct bookings" },
  {
    label: "Balance follow-ups",
    value: "12",
    note: "Due within the next 48 hours",
  },
  { label: "Cancellations", value: "3", note: "2 rebooked to weekday slots" },
];

const managementItems = [
  {
    title: "Subscription and tenant health",
    detail:
      "3 active resort branches, 27 staff accounts, and billing is current on the Growth plan.",
    icon: Hotel,
  },
  {
    title: "Role coverage",
    detail:
      "Front desk, housekeeping, accounting, and marketing roles all logged in today except maintenance lead.",
    icon: Users,
  },
  {
    title: "Automation watch",
    detail:
      "Payment reminders, check-in emails, and Discord alerts are healthy. One SMS webhook retried at 8:42 AM.",
    icon: BellRing,
  },
];

const propertyHealth = [
  {
    label: "Ready rooms",
    value: "32 / 38",
    tone: "healthy" as const,
    note: "6 tied to turnover and maintenance",
  },
  {
    label: "Check-in compliance",
    value: "86%",
    tone: "warning" as const,
    note: "Guest IDs missing in 2 arrivals",
  },
  {
    label: "Critical incidents",
    value: "1",
    tone: "issue" as const,
    note: "Pool pump repair remains unresolved",
  },
];

const adminNotes = [
  "Prioritize payment reminders for 12 confirmed bookings with balances due before arrival.",
  "Reassign one housekeeping team to Villa 3 and Casita 8 to avoid delaying same-day check-ins.",
  "Review transport add-ons and breakfast upsells for the weekend package campaign.",
];

const tarsiMessage =
  "Reservations are healthy today, but 12 balances are still due before arrival and 2 rooms are waiting on final housekeeping clearance.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={tarsiMessage} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, i) => (
          <StatsCard key={i} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RevenueChart />
          <OperationsSnapshot items={operations} />
          <ReservationPipeline items={reservationPipeline} />
        </div>

        <div className="space-y-6">
          <ManagementPriorities items={managementItems} />
          <PropertyHealth items={propertyHealth} />
          <AdminNotes notes={adminNotes} />
        </div>
      </div>

      <BookingTable />
    </div>
  );
};

export default Page;
