"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { MaintenanceTable } from "./MaintenanceTable";

const kpiCards: Array<{
  label: string;
  value: number;
  detail: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  tone: keyof typeof toneClasses;
}> = [
  {
    label: "Total Requests",
    value: 38,
    detail: "vs May 20 - May 26",
    change: "11%",
    trend: "up",
    icon: Wrench,
    tone: "blue",
  },
  {
    label: "In Progress",
    value: 12,
    detail: "vs May 20 - May 26",
    change: "9%",
    trend: "up",
    icon: Clock,
    tone: "amber",
  },
  {
    label: "Completed",
    value: 22,
    detail: "vs May 20 - May 26",
    change: "16%",
    trend: "up",
    icon: CheckCircle2,
    tone: "green",
  },
  {
    label: "Overdue",
    value: 4,
    detail: "vs May 20 - May 26",
    change: "33%",
    trend: "down",
    icon: AlertTriangle,
    tone: "red",
  },
  {
    label: "Preventive Due",
    value: 7,
    detail: "vs May 20 - May 26",
    change: "13%",
    trend: "up",
    icon: ShieldCheck,
    tone: "violet",
  },
];

const toneClasses = {
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  green: "bg-green-50 text-green-700",
  red: "bg-red-50 text-red-700",
  violet: "bg-violet-50 text-violet-700",
};

export function MaintenanceWorkspaceView({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const requestsQuery = useQuery(trpc.maintenance.list.queryOptions());
  const requests = React.useMemo(
    () => requestsQuery.data ?? [],
    [requestsQuery.data],
  );
  const openRequests = requests.filter(
    (request) => request.status !== "Completed",
  ).length;
  const overdueRequests = requests.filter(
    (request) => request.status === "Overdue",
  ).length;
  const inProgress = requests.filter(
    (request) => request.status === "In Progress",
  ).length;
  const completed = requests.filter((request) => request.status === "Completed").length;
  const preventiveDue = requests.filter(
    (request) => request.category === "Preventive maintenance",
  ).length;
  const liveKpiCards = [
    { ...kpiCards[0], value: requests.length },
    { ...kpiCards[1], value: inProgress },
    { ...kpiCards[2], value: completed },
    { ...kpiCards[3], value: overdueRequests },
    { ...kpiCards[4], value: preventiveDue },
  ];

  return (
    <main className="flex flex-1 flex-col gap-5">
      <TuroInsightCard
        message={`${resortName} has ${openRequests} open maintenance requests, including ${overdueRequests} overdue item${overdueRequests === 1 ? "" : "s"} that need follow-up.`}
        userName={ownerName}
      />

      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Maintenance</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track and manage maintenance requests, preventive tasks, and asset
            upkeep across the property.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" className="justify-start gap-2">
            <CalendarDays className="size-4" />
            May 27 - Jun 2, 2026
          </Button>
          <Button asChild className="gap-2">
            <Link href="/tenant/operations/maintenance/create">
              <Plus className="size-4" />
              New request
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {liveKpiCards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-4">
        <MaintenanceTable />
      </section>
    </main>
  );
}

function KpiCard({
  label,
  value,
  detail,
  change,
  trend,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  detail: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  tone: keyof typeof toneClasses;
}) {
  return (
    <div className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl",
            toneClasses[tone],
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-3 text-2xl font-semibold">{value}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground">{detail}</span>
        <span
          className={cn(
            "font-semibold",
            trend === "up" ? "text-green-700" : "text-red-600",
          )}
        >
          {trend === "up" ? "+" : "+"}
          {change}
        </span>
      </div>
    </div>
  );
}
