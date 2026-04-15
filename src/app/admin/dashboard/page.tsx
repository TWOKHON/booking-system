"use client";

import { Heading } from "@/components/custom/Heading";
import {
  Users,
  Hotel,
  CalendarCheck,
  Wallet,
} from "lucide-react";
import { StatsCard } from "./_components/StatsCard";
import { RevenueChart } from "./_components/RevenueChart";
import { BookingTable } from "./_components/BookingTable";
import { RevenueGoal } from "./_components/RevenueGoal";
import { TopResorts } from "./_components/TopResorts";

const stats = [
  {
    title: "Total Revenue",
    value: "₱124,500",
    change: "+12.5%",
    icon: Wallet,
  },
  {
    title: "Active Users",
    value: "1,245",
    change: "+5.2%",
    icon: Users,
  },
  {
    title: "Total Resorts",
    value: "18",
    change: "+2 new",
    icon: Hotel,
  },
  {
    title: "Total Bookings",
    value: "342",
    change: "+8.1%",
    icon: CalendarCheck,
  },
];

const Page = () => {
  return (
    <div className="space-y-6">
      <Heading
        title="Dashboard Overview"
        description="Welcome back, Kyle Andre Lim. Here's what's happening across your resort SaaS platform today."
      />

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <StatsCard key={i} {...item} />
        ))}
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart />
          <BookingTable />
        </div>

        <div className="space-y-6">
          <RevenueGoal />
          <TopResorts />
        </div>
      </div>
    </div>
  );
};

export default Page;