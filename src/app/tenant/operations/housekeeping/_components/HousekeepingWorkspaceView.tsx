"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  DoorOpen,
  Scissors,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import {
  roomStatusColors,
  type RoomStatusSummary,
  type HousekeepingTaskSummary,
  type HousekeepingTaskStatus,
} from "./housekeeping-data";
import { HousekeepingTable } from "./HousekeepingTable";

const taskTone: Record<HousekeepingTaskStatus, string> = {
  Pending: "bg-blue-500",
  "In Progress": "bg-amber-500",
  Completed: "bg-green-600",
  Overdue: "bg-red-500",
};

type KpiCardItem = {
  label: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  tone: keyof typeof toneClasses;
  progress: number | null;
};

const toneClasses = {
  green: {
    icon: "bg-green-50 text-green-700",
    progress: "[&>div]:bg-green-700",
  },
  orange: {
    icon: "bg-orange-50 text-orange-700",
    progress: "[&>div]:bg-orange-600",
  },
  amber: {
    icon: "bg-amber-50 text-amber-700",
    progress: "[&>div]:bg-amber-500",
  },
  red: {
    icon: "bg-red-50 text-red-700",
    progress: "[&>div]:bg-red-600",
  },
};

export function HousekeepingWorkspaceView() {
  const trpc = useTRPC();
  const summaryQuery = useQuery(trpc.housekeeping.summary.queryOptions());
  const summary = summaryQuery.data ?? {
    totalRooms: 0,
    roomStatusSummary: [],
    taskSummary: [],
  };
  const cardByStatus = new Map(
    summary.roomStatusSummary.map((item) => [item.status, item]),
  );
  const kpiCards: KpiCardItem[] = [
    {
      label: "Clean Rooms",
      value: cardByStatus.get("Clean")?.count ?? 0,
      detail: `${cardByStatus.get("Clean")?.percent ?? 0}% of total rooms`,
      icon: CheckCircle2,
      tone: "green",
      progress: cardByStatus.get("Clean")?.percent ?? 0,
    },
    {
      label: "Occupied (Dirty)",
      value: cardByStatus.get("Occupied (Dirty)")?.count ?? 0,
      detail: `${cardByStatus.get("Occupied (Dirty)")?.percent ?? 0}% of total rooms`,
      icon: UserRound,
      tone: "orange",
      progress: cardByStatus.get("Occupied (Dirty)")?.percent ?? 0,
    },
    {
      label: "Vacant (Dirty)",
      value: cardByStatus.get("Vacant (Dirty)")?.count ?? 0,
      detail: `${cardByStatus.get("Vacant (Dirty)")?.percent ?? 0}% of total rooms`,
      icon: DoorOpen,
      tone: "amber",
      progress: cardByStatus.get("Vacant (Dirty)")?.percent ?? 0,
    },
    {
      label: "Out of Order",
      value: cardByStatus.get("Out of Order")?.count ?? 0,
      detail: `${cardByStatus.get("Out of Order")?.percent ?? 0}% of total rooms`,
      icon: Scissors,
      tone: "red",
      progress: cardByStatus.get("Out of Order")?.percent ?? 0,
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1.05fr]">
        <RoomStatusOverview
          roomStatusSummary={summary.roomStatusSummary}
          totalRooms={summary.totalRooms}
        />
        <TaskSummary taskSummary={summary.taskSummary} />
      </section>

      <section className="grid gap-4">
        <HousekeepingTable />
      </section>
    </main>
  );
}

function KpiCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
  progress,
}: {
  label: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  tone: keyof typeof toneClasses;
  progress: number | null;
}) {
  return (
    <div className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl",
            toneClasses[tone].icon,
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-3 text-2xl font-semibold">{value}</p>
          <p className="mt-3 text-sm text-muted-foreground">{detail}</p>
        </div>
      </div>
      {progress !== null ? (
        <Progress
          value={progress}
          className={cn("mt-5 h-1.5", toneClasses[tone].progress)}
        />
      ) : null}
    </div>
  );
}

function RoomStatusOverview({
  roomStatusSummary,
  totalRooms,
}: {
  roomStatusSummary: RoomStatusSummary[];
  totalRooms: number;
}) {
  const gradient = `conic-gradient(${roomStatusSummary
    .filter((item) => item.percent > 0)
    .reduce(
      (segments, item) => {
        const start = segments.cursor;
        const end = start + item.percent;
        segments.parts.push(`${roomStatusColors[item.status]} ${start}% ${end}%`);
        segments.cursor = end;
        return segments;
      },
      { cursor: 0, parts: [] as string[] },
    )
    .parts.join(", ")})`;

  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">Room status overview</h2>
        <p className="text-sm text-muted-foreground">
          Distribution of rooms by status.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[180px_1fr] lg:items-center">
        <div className="relative mx-auto grid size-44 place-items-center rounded-full">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: gradient }}
          />
          <div className="relative grid size-28 place-items-center rounded-full bg-background text-center shadow-sm">
            <div>
              <p className="text-3xl font-semibold">{totalRooms}</p>
              <p className="text-xs text-muted-foreground">Total rooms</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {roomStatusSummary.map((item) => (
            <div
              key={item.status}
              className="grid grid-cols-[1fr_48px_48px] items-center gap-3 border-b py-2 text-sm last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: roomStatusColors[item.status] }}
                />
                <span>{item.status}</span>
              </div>
              <span className="text-right tabular-nums">{item.count}</span>
              <span className="text-right text-muted-foreground tabular-nums">
                {item.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TaskSummary({
  taskSummary,
}: {
  taskSummary: HousekeepingTaskSummary[];
}) {
  const totalTasks = taskSummary.reduce((sum, task) => sum + task.count, 0);
  const completed = taskSummary.find((task) => task.status === "Completed");

  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Task summary</h2>
          <p className="text-sm text-muted-foreground">
            Overview of housekeeping tasks.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/tenant/operations/tasks">View all tasks</Link>
        </Button>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_180px] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total tasks
          </p>
          <p className="mt-2 text-3xl font-semibold">{totalTasks}</p>

          <div className="mt-4 overflow-hidden rounded-lg border">
            {taskSummary.map((task) => (
              <div
                key={task.status}
                className="grid grid-cols-[1fr_48px_48px] items-center gap-3 border-b px-4 py-3 text-sm last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn("size-2.5 rounded-full", taskTone[task.status])}
                  />
                  <span>{task.status}</span>
                </div>
                <span className="text-right tabular-nums">{task.count}</span>
                <span
                  className={cn(
                    "text-right text-muted-foreground tabular-nums",
                    task.status === "Overdue" && "text-red-600",
                  )}
                >
                  {task.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto grid size-36 place-items-center rounded-full">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#2f8f2f 0% ${completed?.percent ?? 0}%, #e5f0e5 ${completed?.percent ?? 0}% 100%)`,
            }}
          />
          <div className="relative grid size-24 place-items-center rounded-full bg-background text-center shadow-sm">
            <div>
              <p className="text-2xl font-semibold">75%</p>
              <p className="text-[11px] text-muted-foreground">Completion rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
