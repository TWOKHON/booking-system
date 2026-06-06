"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bed,
  Building2,
  Check,
  Clock,
  Paperclip,
  Upload,
  Wrench,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import {
  taskTypes,
  type StaffTask,
  type TaskPriority,
  type TaskType,
} from "./tasks-data";

type TaskFormViewProps = {
  taskId: string;
};

type TaskFormState = {
  taskType: TaskType | "Other" | "";
  status: "Pending" | "In Progress" | "Completed";
  priority: TaskPriority;
  roomId: string;
  room: string;
  roomType: string;
  description: string;
  employeeId: string;
  assignee: string;
  scheduleDate: string;
  scheduleTime: string;
  notifyAssignee: boolean;
  reportedBy: string;
  source: string;
  notes: string;
};

const priorityOptions: Array<{ value: TaskPriority; dot: string }> = [
  { value: "Low", dot: "bg-green-600" },
  { value: "Medium", dot: "bg-amber-500" },
  { value: "High", dot: "bg-red-600" },
];

const taskTypeDetails: Record<
  TaskType | "Other",
  { icon: LucideIcon; tone: string; title: string; description: string }
> = {
  "Clean Room": {
    icon: Bed,
    tone: "bg-green-50 text-green-700",
    title: "Clean Room",
    description: "Standard cleaning and tidying",
  },
  "Deep Clean": {
    icon: Bed,
    tone: "bg-amber-50 text-amber-700",
    title: "Deep Clean",
    description: "Thorough cleaning of room",
  },
  "Inspect Room": {
    icon: Building2,
    tone: "bg-orange-50 text-orange-700",
    title: "Inspection",
    description: "Room inspection and assessment",
  },
  Maintenance: {
    icon: Wrench,
    tone: "bg-red-50 text-red-700",
    title: "Maintenance",
    description: "Maintenance issue in room",
  },
  "Turn Down Service": {
    icon: Building2,
    tone: "bg-purple-50 text-purple-700",
    title: "Turndown Service",
    description: "Evening turndown and amenities",
  },
  Other: {
    icon: Building2,
    tone: "bg-zinc-100 text-zinc-600",
    title: "Other",
    description: "Other housekeeping task",
  },
};

export function TaskFormView({ taskId }: TaskFormViewProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const isCreate = taskId === "create";
  const taskQuery = useQuery({
    ...trpc.operationTasks.get.queryOptions({ id: taskId }),
    enabled: !isCreate,
  });
  const roomsQuery = useQuery(trpc.rooms.list.queryOptions());
  const employeesQuery = useQuery(trpc.employees.list.queryOptions());
  const existingTask = taskQuery.data ?? null;
  const [form, setForm] = React.useState<TaskFormState>(() =>
    createInitialState(existingTask),
  );
  const roomOptions = React.useMemo(
    () => roomsQuery.data ?? [],
    [roomsQuery.data],
  );
  const employeeOptions = React.useMemo(
    () => employeesQuery.data ?? [],
    [employeesQuery.data],
  );
  const selectedRoom = roomOptions.find((room) => room.id === form.roomId);
  const selectedEmployee = employeeOptions.find(
    (employee) => employee.id === form.employeeId,
  );
  const title = isCreate ? "Create task" : "Update task";
  const createTaskMutation = useMutation(
    trpc.operationTasks.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Task created.");
        await queryClient.invalidateQueries(trpc.operationTasks.list.queryOptions());
        router.push("/tenant/operations/tasks");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create task.");
      },
    }),
  );
  const updateTaskMutation = useMutation(
    trpc.operationTasks.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Task updated.");
        await queryClient.invalidateQueries(trpc.operationTasks.list.queryOptions());
        await queryClient.invalidateQueries(
          trpc.operationTasks.get.queryOptions({ id: taskId }),
        );
        router.push("/tenant/operations/tasks");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update task.");
      },
    }),
  );

  React.useEffect(() => {
    if (existingTask) {
      setForm(createInitialState(existingTask));
    }
  }, [existingTask]);

  React.useEffect(() => {
    if (selectedRoom) {
      setForm((current) => ({
        ...current,
        room: selectedRoom.roomName,
        roomType: selectedRoom.category,
      }));
    }
  }, [selectedRoom]);

  React.useEffect(() => {
    if (selectedEmployee) {
      setForm((current) => ({
        ...current,
        assignee: selectedEmployee.fullName,
      }));
    }
  }, [selectedEmployee]);

  React.useEffect(() => {
    if (form.roomId || !form.room || roomOptions.length === 0) {
      return;
    }

    const matchedRoom = roomOptions.find((room) => room.roomName === form.room);

    if (matchedRoom) {
      setForm((current) => ({
        ...current,
        roomId: matchedRoom.id,
        room: matchedRoom.roomName,
        roomType: matchedRoom.category,
      }));
    }
  }, [form.room, form.roomId, roomOptions]);

  React.useEffect(() => {
    if (form.employeeId || !form.assignee || employeeOptions.length === 0) {
      return;
    }

    const matchedEmployee = employeeOptions.find(
      (employee) => employee.fullName === form.assignee,
    );

    if (matchedEmployee) {
      setForm((current) => ({
        ...current,
        employeeId: matchedEmployee.id,
        assignee: matchedEmployee.fullName,
      }));
    }
  }, [employeeOptions, form.assignee, form.employeeId]);

  const update = <K extends keyof TaskFormState>(
    key: K,
    value: TaskFormState[K],
  ) => setForm((current) => ({ ...current, [key]: value }));
  const canSubmit =
    form.taskType !== "" &&
    form.roomId.trim().length > 0 &&
    form.roomType.trim().length > 0 &&
    form.description.trim().length >= 3 &&
    form.employeeId.trim().length > 0 &&
    form.reportedBy.trim().length > 0;
  const isSaving = createTaskMutation.isPending || updateTaskMutation.isPending;

  const handleSubmit = () => {
    if (!canSubmit || form.taskType === "") {
      return;
    }

    const payload = {
      taskType: form.taskType,
      priority: form.priority,
      roomId: form.roomId,
      employeeId: form.employeeId,
      description: form.description,
      scheduleDate: form.scheduleDate,
      scheduleTime: form.scheduleTime,
      notifyAssignee: form.notifyAssignee,
      reportedBy: form.reportedBy,
      source: form.source,
      notes: form.notes,
    };

    if (isCreate) {
      createTaskMutation.mutate(payload);
      return;
    }

    updateTaskMutation.mutate({
      ...payload,
      id: taskId,
      status: form.status,
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-5">
      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isCreate
              ? "Create a new housekeeping task and assign it to the appropriate room and staff."
              : "Update housekeeping task details, assignment, schedule, and supporting notes."}
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/tenant/operations/tasks">
              <X className="size-4" />
              Cancel
            </Link>
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || isSaving}>
            <Check className="size-4" />
            {isSaving
              ? "Saving..."
              : isCreate
                ? "Create task"
                : "Update task"}
          </Button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <FormSection title="Task details">
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Task type" required>
                <Select
                  value={form.taskType}
                  onValueChange={(value: TaskType) => update("taskType", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Priority">
                <Select
                  value={form.priority}
                  onValueChange={(value: TaskPriority) => update("priority", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={cn("size-2 rounded-full", priority.dot)}
                          />
                          {priority.value}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Room" required>
                <Select
                  value={form.roomId}
                  onValueChange={(value) => update("roomId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        roomsQuery.isLoading
                          ? "Loading rooms..."
                          : "Search by room number or name"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {roomOptions.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.roomName} - {room.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Room type">
                <Input
                  value={form.roomType}
                  disabled
                  placeholder="Select room first"
                />
              </Field>
            </div>

            <Field label="Description" required>
              <div className="relative">
                <Textarea
                  value={form.description}
                  maxLength={500}
                  onChange={(event) => update("description", event.target.value)}
                  placeholder="Describe the task, issue, or request..."
                  className="min-h-36 resize-none pr-16"
                />
                <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                  {form.description.length} / 500
                </span>
              </div>
            </Field>
          </FormSection>

          <FormSection title="Assignment">
            <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
              <Field label="Assign to" required>
                <Select
                  value={form.employeeId}
                  onValueChange={(value) => update("employeeId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        employeesQuery.isLoading
                          ? "Loading employees..."
                          : "Select staff member or team"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeOptions.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Schedule">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    type="date"
                    value={form.scheduleDate}
                    onChange={(event) => update("scheduleDate", event.target.value)}
                  />
                  <div className="relative">
                    <Input
                      type="time"
                      value={form.scheduleTime}
                      onChange={(event) =>
                        update("scheduleTime", event.target.value)
                      }
                    />
                    <Clock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={form.notifyAssignee}
                onCheckedChange={(value) => update("notifyAssignee", !!value)}
              />
              Notify assignee via system notification
            </label>
          </FormSection>

          <FormSection title="Additional information">
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Reported by">
                <Select
                  value={form.reportedBy}
                  onValueChange={(value) => update("reportedBy", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Front Desk">Front Desk</SelectItem>
                    <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                    <SelectItem value="Guest Services">Guest Services</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Source">
                <Select
                  value={form.source}
                  onValueChange={(value) => update("source", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Front desk request">
                      Front desk request
                    </SelectItem>
                    <SelectItem value="Guest request">Guest request</SelectItem>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                    <SelectItem value="Internal task">Internal task</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Notes (optional)">
                <div className="relative">
                  <Textarea
                    value={form.notes}
                    maxLength={300}
                    onChange={(event) => update("notes", event.target.value)}
                    placeholder="Add any additional notes..."
                    className="min-h-32 resize-none pr-16"
                  />
                  <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                    {form.notes.length} / 300
                  </span>
                </div>
              </Field>

              <Field label="Photos (optional)">
                <div className="grid min-h-32 place-items-center rounded-lg border border-dashed bg-muted/20 p-5 text-center">
                  <div>
                    <Upload className="mx-auto size-5 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">Upload photos</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG up to 5MB each
                    </p>
                  </div>
                </div>
              </Field>
            </div>

            <Field label="Attachments (optional)">
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" variant="outline" size="sm" className="gap-2">
                  <Paperclip className="size-4" />
                  Add attachment
                </Button>
                <span className="text-xs text-muted-foreground">
                  PDF, DOC, XLS up to 10MB
                </span>
              </div>
            </Field>
          </FormSection>
        </div>

        <aside className="space-y-5">
          <TaskSummaryPanel form={form} />
          <TaskTypesPanel
            selectedType={form.taskType}
            onSelect={(value) => update("taskType", value)}
          />
          <GuidelinesPanel />
        </aside>
      </section>
    </main>
  );
}

function createInitialState(task: StaffTask | null): TaskFormState {
  return {
    taskType: task?.title ?? "",
    status: task?.status ?? "Pending",
    priority: task?.priority ?? "Medium",
    roomId: task?.roomId ?? "",
    room: task?.roomNo ?? "",
    roomType: task?.roomType ?? "",
    description: task?.description ?? "",
    employeeId: task?.employeeId ?? "",
    assignee: task?.assignee ?? "",
    scheduleDate: task?.scheduleDate ?? "",
    scheduleTime: task?.scheduleTime ?? "",
    notifyAssignee: task?.notifyAssignee ?? false,
    reportedBy: task?.reportedBy ?? "Front Desk",
    source: task?.source ?? "",
    notes: task?.notes ?? "",
  };
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-sm">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </Label>
      {children}
    </div>
  );
}

function TaskSummaryPanel({ form }: { form: TaskFormState }) {
  const rows = [
    ["Task type", form.taskType || "-"],
    ["Priority", form.priority || "-"],
    ["Room", form.room || "-"],
    ["Assign to", form.assignee || "-"],
    [
      "Schedule",
      [form.scheduleDate, form.scheduleTime].filter(Boolean).join(" ") || "-",
    ],
  ];

  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <h2 className="text-base font-semibold">Task summary</h2>
      <div className="mt-4 space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TaskTypesPanel({
  selectedType,
  onSelect,
}: {
  selectedType: TaskType | "Other" | "";
  onSelect: (type: TaskType | "Other") => void;
}) {
  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <h2 className="text-base font-semibold">Task types</h2>
      <RadioGroup
        value={selectedType}
        onValueChange={(value) => onSelect(value as TaskType | "Other")}
        className="mt-4 gap-3"
      >
        {taskTypes.map((type) => {
          const detail = taskTypeDetails[type];
          const Icon = detail.icon;
          return (
            <label
              key={type}
              className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-muted/50"
            >
              <RadioGroupItem value={type} className="mt-2" />
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full",
                  detail.tone,
                )}
              >
                <Icon className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-medium">{detail.title}</span>
                <span className="text-xs text-muted-foreground">
                  {detail.description}
                </span>
              </span>
            </label>
          );
        })}
        <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-muted/50">
          <RadioGroupItem value="Other" className="mt-2" />
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-600">
            <Building2 className="size-4" />
          </span>
          <span>
            <span className="block text-sm font-medium">Other</span>
            <span className="text-xs text-muted-foreground">
              Other housekeeping task
            </span>
          </span>
        </label>
      </RadioGroup>
    </section>
  );
}

function GuidelinesPanel() {
  return (
    <section className="rounded-xl border bg-green-50 p-5 text-green-950 shadow-sm">
      <h2 className="text-base font-semibold">Guidelines</h2>
      <ul className="mt-4 space-y-3 text-sm">
        <li>Provide clear descriptions for faster resolution.</li>
        <li>Assign tasks to the right staff or team.</li>
        <li>Use appropriate priority levels.</li>
        <li>Add photos if available for better context.</li>
      </ul>
    </section>
  );
}
