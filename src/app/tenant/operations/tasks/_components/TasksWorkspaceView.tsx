"use client";

import * as React from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DateRange } from "react-day-picker";
import {
  Bed,
  Building2,
  CalendarDays,
  Check,
  Circle,
  ExternalLink,
  Plus,
  Search,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import {
  taskStatuses,
  taskTypes,
  type StaffTask,
  type TaskPriority,
  type TaskStatus,
  type TaskType,
} from "./tasks-data";

const statusConfig: Record<
  TaskStatus,
  { dot: string; accent: string }
> = {
  Pending: { dot: "bg-blue-600", accent: "border-blue-100" },
  "In Progress": { dot: "bg-amber-500", accent: "border-amber-100" },
  Completed: { dot: "bg-green-600", accent: "border-green-100" },
};

const priorityTone: Record<TaskPriority, string> = {
  Low: "text-green-700",
  Medium: "text-amber-600",
  High: "text-red-600",
};

const taskIconConfig: Record<TaskType, { icon: LucideIcon; tone: string }> = {
  "Clean Room": { icon: Bed, tone: "bg-green-50 text-green-700" },
  "Deep Clean": { icon: Bed, tone: "bg-green-50 text-green-700" },
  "Inspect Room": { icon: Bed, tone: "bg-green-50 text-green-700" },
  Maintenance: { icon: Wrench, tone: "bg-red-50 text-red-700" },
  "Turn Down Service": {
    icon: Building2,
    tone: "bg-purple-50 text-purple-700",
  },
  Other: { icon: Building2, tone: "bg-zinc-100 text-zinc-600" },
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const compactDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const startOfDay = (date: Date) => {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
};

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const createDefaultDateRange = (): DateRange => {
  const today = startOfDay(new Date());

  return {
    from: addDays(today, -6),
    to: today,
  };
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDateRange = (range: DateRange | undefined) => {
  if (!range?.from) {
    return "All dates";
  }

  if (!range.to) {
    return dateFormatter.format(range.from);
  }

  const sameYear = range.from.getFullYear() === range.to.getFullYear();

  if (sameYear) {
    return `${compactDateFormatter.format(range.from)} - ${dateFormatter.format(range.to)}`;
  }

  return `${dateFormatter.format(range.from)} - ${dateFormatter.format(range.to)}`;
};

const isTaskInDateRange = (
  task: StaffTask,
  range: DateRange | undefined,
) => {
  if (!range?.from || !task.scheduleDate) {
    return true;
  }

  const taskDateKey = task.scheduleDate;
  const fromKey = toDateKey(range.from);
  const toKey = toDateKey(range.to ?? range.from);

  return taskDateKey >= fromKey && taskDateKey <= toKey;
};

export function TasksWorkspaceView({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const tasksQuery = useQuery(trpc.operationTasks.list.queryOptions());
  const employeesQuery = useQuery(trpc.employees.list.queryOptions());
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [assigneeFilter, setAssigneeFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("priority");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() =>
    createDefaultDateRange(),
  );
  const [activeTaskId, setActiveTaskId] = React.useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const tasks = React.useMemo(() => tasksQuery.data ?? [], [tasksQuery.data]);
  const assigneeOptions = React.useMemo(() => {
    const names = new Set<string>();

    for (const employee of employeesQuery.data ?? []) {
      names.add(employee.fullName);
    }

    for (const task of tasks) {
      names.add(task.assignee);
    }

    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [employeesQuery.data, tasks]);
  const updateStatusMutation = useMutation(
    trpc.operationTasks.updateStatus.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.operationTasks.list.queryOptions(),
        );
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update task status.");
      },
    }),
  );
  const filteredTasks = tasks
    .filter((task) => isTaskInDateRange(task, dateRange))
    .filter((task) => {
      const haystack = [
        task.roomNo,
        task.roomType,
        task.title,
        task.description,
        task.status,
        task.assignee,
        task.priority,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(search.toLowerCase());
    })
    .filter((task) => statusFilter === "all" || task.status === statusFilter)
    .filter((task) => typeFilter === "all" || task.title === typeFilter)
    .filter(
      (task) => assigneeFilter === "all" || task.assignee === assigneeFilter,
    )
    .sort((a, b) => {
      if (sortBy === "room") return Number(a.roomNo) - Number(b.roomNo);
      if (sortBy === "assignee") return a.assignee.localeCompare(b.assignee);

      return priorityRank[b.priority] - priorityRank[a.priority];
    });
  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id));
  };
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTaskId(null);

    const taskId = String(event.active.id);
    const nextStatus = event.over?.id as TaskStatus | undefined;

    if (!nextStatus || !taskStatuses.includes(nextStatus)) {
      return;
    }

    const task = tasks.find((item) => item.id === taskId);

    if (!task || task.status === nextStatus) {
      return;
    }

    updateStatusMutation.mutate({
      id: task.id,
      status: nextStatus,
    });
  };
  const handleDragCancel = () => {
    setActiveTaskId(null);
  };

  return (
    <main className="flex flex-1 flex-col gap-4">
      <TuroInsightCard
        message={`${resortName} has ${tasks.length} housekeeping tasks on the board across pending, in progress, and completed work.`}
        userName={ownerName}
      />

      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Staff task board
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View and manage housekeeping tasks by status. Drag and drop to
            update progress.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start gap-2">
                <CalendarDays className="size-4" />
                {formatDateRange(dateRange)}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-2">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                buttonVariant="ghost"
              />
              <div className="flex items-center justify-between border-t px-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDateRange(undefined)}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDateRange(createDefaultDateRange())}
                >
                  Last 7 days
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button asChild>
            <Link href="/tenant/operations/tasks/create">
              <Plus className="size-4" />
              Create task
            </Link>
          </Button>
        </div>
      </section>

      <section className="rounded-xl border bg-background p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <div className="relative w-full xl:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks, room number or type..."
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-42.5">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                {taskStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-45">
                <SelectValue placeholder="All task types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All task types</SelectItem>
                {taskTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-full md:w-45">
                <SelectValue placeholder="All assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All assignees</SelectItem>
                {assigneeOptions.map((assignee) => (
                  <SelectItem key={assignee} value={assignee}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-45">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="room">Room number</SelectItem>
                  <SelectItem value="assignee">Assignee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            {taskStatuses.map((status) => (
              <TaskColumn
                key={status}
                status={status}
                tasks={filteredTasks.filter((task) => task.status === status)}
                count={tasks.filter((task) => task.status === status).length}
                activeTaskId={activeTaskId}
                isLoading={tasksQuery.isLoading}
              />
            ))}
          </div>
        </DndContext>

        <div className="mt-5 flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1 to {Math.min(filteredTasks.length, 4)} of{" "}
            {filteredTasks.length} tasks
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" disabled>
              1
            </Button>
            <Button variant="outline" size="icon-sm">
              2
            </Button>
            <Button variant="outline" size="icon-sm">
              3
            </Button>
            <span className="px-2 text-sm text-muted-foreground">...</span>
            <Button variant="outline" size="icon-sm">
              7
            </Button>
          </div>
          <Select defaultValue="4">
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4 / page</SelectItem>
              <SelectItem value="8">8 / page</SelectItem>
              <SelectItem value="12">12 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>
    </main>
  );
}

function TaskColumn({
  status,
  tasks,
  count,
  activeTaskId,
  isLoading,
}: {
  status: TaskStatus;
  tasks: StaffTask[];
  count: number;
  activeTaskId: string | null;
  isLoading?: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: status });
  const visibleTasks = tasks.slice(0, 4);
  const hiddenCount = Math.max(tasks.length - visibleTasks.length, 0);

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "min-h-140 rounded-xl border bg-muted/20 p-4 transition-colors",
        isOver && "border-primary/40 bg-primary/5",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={cn("size-2.5 rounded-full", statusConfig[status].dot)}
          />
          <h2 className="text-sm font-semibold">{status}</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {count}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
            Loading tasks...
          </div>
        ) : visibleTasks.length ? (
          visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isDragging={activeTaskId === task.id}
            />
          ))
        ) : (
          <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
            No tasks in this status.
          </div>
        )}
      </div>

      {hiddenCount > 0 ? (
        <button className="mt-4 w-full text-center text-sm font-medium text-blue-700">
          + {hiddenCount} more tasks
        </button>
      ) : null}
    </section>
  );
}

function TaskCard({
  task,
  isDragging,
}: {
  task: StaffTask;
  isDragging: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });
  const iconConfig = taskIconConfig[task.title];
  const Icon = iconConfig.icon;
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "block touch-none rounded-lg border bg-background p-4 shadow-xs transition",
        isDragging && "cursor-grabbing opacity-60 shadow-lg",
        !isDragging && "cursor-grab hover:border-foreground/20 hover:shadow-sm",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-full",
              iconConfig.tone,
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1 text-xs font-semibold">
              <span>{task.roomNo}</span>
              <span className="text-muted-foreground">-</span>
              <span className="text-muted-foreground">{task.roomType}</span>
            </div>
            <h3 className="mt-1 text-sm font-semibold">{task.title}</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              {task.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {task.dueLabel ? (
            <span className="whitespace-nowrap text-xs text-muted-foreground">
              {task.dueLabel}
            </span>
          ) : null}
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            className="cursor-pointer text-muted-foreground hover:text-foreground"
            onPointerDown={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <Link href={`/tenant/operations/tasks/${task.id}`}>
              <ExternalLink className="size-4" />
              <span className="sr-only">Open task</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-muted text-xs font-medium">
            {task.initials}
          </span>
          <span className="text-sm text-muted-foreground">{task.assignee}</span>
        </div>
        <TaskState task={task} />
      </div>
    </article>
  );
}

function TaskState({ task }: { task: StaffTask }) {
  if (task.status === "Completed") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-700">
        <Check className="size-3.5" />
        {task.completedAt}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        priorityTone[task.priority],
      )}
    >
      <Circle className="size-3 fill-current" />
      {task.priority}
    </span>
  );
}

const priorityRank: Record<TaskPriority, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};
