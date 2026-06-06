"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  MessageSquarePlus,
  Sparkles,
  TimerReset,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
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
import { GuestRequestsTable } from "./GuestRequestsTable";
import {
  requestPriorities,
  requestStatuses,
  requestTypes,
  type GuestRequestPriority,
  type GuestRequestStatus,
  type GuestRequestType,
} from "./guest-requests-data";

const toneClasses = {
  green: {
    icon: "bg-green-50 text-green-700",
    progress: "[&>div]:bg-green-700",
  },
  blue: {
    icon: "bg-blue-50 text-blue-700",
    progress: "[&>div]:bg-blue-700",
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

type KpiCardItem = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: keyof typeof toneClasses;
  progress: number | null;
};

export function GuestRequestsWorkspaceView({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = React.useState(() => new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [requestForm, setRequestForm] = React.useState({
    guestName: "",
    roomId: "",
    type: "Amenity",
    title: "",
    detail: "",
    priority: "Medium",
    status: "New",
    assignedTo: "Front Desk",
    dueTime: "14:00",
    revenueTag: "",
  });
  const summaryQuery = useQuery(
    trpc.guestRequests.summary.queryOptions({ date: selectedDate }),
  );
  const roomsQuery = useQuery(trpc.rooms.list.queryOptions());
  const requestsQueryKey = trpc.guestRequests.list.queryKey();
  const summaryQueryKey = trpc.guestRequests.summary.queryKey();
  const summary = summaryQuery.data;
  const totalRequests = summary?.totalRequests ?? 0;
  const openRequests = summary?.openRequests ?? 0;
  const escalated = summary?.escalated ?? 0;
  const waitingOverThirty = summary?.waitingOverThirty ?? 0;
  const revenueRequests = summary?.revenueRequests ?? 0;
  const responsePercent = summary?.responsePercent ?? 0;
  const createRequestMutation = useMutation(
    trpc.guestRequests.create.mutationOptions({
      onSuccess: async (request) => {
        toast.success(`${request.requestNumber} created.`);
        setIsCreateOpen(false);
        setRequestForm({
          guestName: "",
          roomId: "",
          type: "Amenity",
          title: "",
          detail: "",
          priority: "Medium",
          status: "New",
          assignedTo: "Front Desk",
          dueTime: "14:00",
          revenueTag: "",
        });
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: requestsQueryKey }),
          queryClient.invalidateQueries({ queryKey: summaryQueryKey }),
        ]);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create guest request.");
      },
    }),
  );
  const acknowledgeAllMutation = useMutation(
    trpc.guestRequests.acknowledgeAll.mutationOptions({
      onSuccess: async (result) => {
        toast.success(`${result.count} request${result.count === 1 ? "" : "s"} acknowledged.`);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: requestsQueryKey }),
          queryClient.invalidateQueries({ queryKey: summaryQueryKey }),
        ]);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to acknowledge guest requests.");
      },
    }),
  );
  const kpiCards: KpiCardItem[] = [
    {
      label: "Open Requests",
      value: String(openRequests),
      detail: `${waitingOverThirty} waiting over 30 mins`,
      icon: UsersRound,
      tone: "blue",
      progress: totalRequests ? Math.round((openRequests / totalRequests) * 100) : 0,
    },
    {
      label: "Response Health",
      value: `${responsePercent}%`,
      detail: "Within service target",
      icon: TimerReset,
      tone: "green",
      progress: responsePercent,
    },
    {
      label: "Escalated",
      value: String(escalated),
      detail: "Needs manager attention",
      icon: AlertCircle,
      tone: "red",
      progress: totalRequests ? Math.round((escalated / totalRequests) * 100) : 0,
    },
    {
      label: "Revenue Tags",
      value: String(revenueRequests),
      detail: "Requests with upsell potential",
      icon: Sparkles,
      tone: "amber",
      progress: null,
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-5">
      <TuroInsightCard
        message={`${resortName} has ${openRequests} open guest requests, ${escalated} escalation, and ${revenueRequests} request${revenueRequests === 1 ? "" : "s"} tagged for revenue follow-up.`}
        userName={ownerName}
      />

      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Guest requests
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage in-stay service requests, response ownership, escalations,
            and guest recovery follow-through.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start gap-2">
                <CalendarDays className="size-4" />
                {formatDateButtonLabel(selectedDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (!date) return;
                  setSelectedDate(date);
                  setIsDatePickerOpen(false);
                }}
              />
              <div className="border-t p-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedDate(new Date());
                    setIsDatePickerOpen(false);
                  }}
                >
                  Today
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            className="gap-2"
            disabled={acknowledgeAllMutation.isPending}
            onClick={() => acknowledgeAllMutation.mutate({ date: selectedDate })}
          >
            <CheckCircle2 className="size-4" />
            Acknowledge all
          </Button>
          <Button
            className="gap-2"
            onClick={() => setIsCreateOpen(true)}
          >
            <MessageSquarePlus className="size-4" />
            New request
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </section>

      <GuestRequestsTable selectedDate={selectedDate} />

      <NewGuestRequestDialog
        form={requestForm}
        isOpen={isCreateOpen}
        isSubmitting={createRequestMutation.isPending}
        rooms={roomsQuery.data ?? []}
        selectedDate={selectedDate}
        onFormChange={(patch) =>
          setRequestForm((current) => ({ ...current, ...patch }))
        }
        onOpenChange={setIsCreateOpen}
        onSubmit={() => {
          if (!requestForm.guestName.trim()) {
            toast.error("Guest name is required.");
            return;
          }

          if (!requestForm.title.trim()) {
            toast.error("Request title is required.");
            return;
          }

          if (!requestForm.detail.trim()) {
            toast.error("Request details are required.");
            return;
          }

          createRequestMutation.mutate({
            guestName: requestForm.guestName,
            roomId: requestForm.roomId,
            type: requestForm.type as GuestRequestType,
            title: requestForm.title,
            detail: requestForm.detail,
            priority: requestForm.priority as GuestRequestPriority,
            status: requestForm.status as GuestRequestStatus,
            assignedTo: requestForm.assignedTo,
            requestedAt: selectedDate,
            dueAt: buildDateTime(selectedDate, requestForm.dueTime),
            revenueTag: requestForm.revenueTag,
          });
        }}
      />
    </main>
  );
}

function formatDateButtonLabel(date: Date) {
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  if (isToday) return "Today";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function buildDateTime(date: Date, time: string) {
  const [hours = "14", minutes = "00"] = time.split(":");
  const result = new Date(date);
  result.setHours(Number(hours), Number(minutes), 0, 0);

  return result;
}

function KpiCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
  progress,
}: KpiCardItem) {
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

function NewGuestRequestDialog({
  form,
  isOpen,
  isSubmitting,
  rooms,
  selectedDate,
  onFormChange,
  onOpenChange,
  onSubmit,
}: {
  form: {
    guestName: string;
    roomId: string;
    type: string;
    title: string;
    detail: string;
    priority: string;
    status: string;
    assignedTo: string;
    dueTime: string;
    revenueTag: string;
  };
  isOpen: boolean;
  isSubmitting: boolean;
  rooms: Array<{ id: string; roomName: string; category: string }>;
  selectedDate: Date;
  onFormChange: (patch: Partial<typeof form>) => void;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>New guest request</DialogTitle>
          <DialogDescription>
            Add an in-stay request for{" "}
            {formatDateButtonLabel(selectedDate).toLowerCase()}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="guest-request-name">Guest name</Label>
            <Input
              id="guest-request-name"
              value={form.guestName}
              onChange={(event) =>
                onFormChange({ guestName: event.target.value })
              }
              placeholder="Guest full name"
            />
          </div>

          <div className="space-y-2">
            <Label>Room</Label>
            <Select
              value={form.roomId}
              onValueChange={(roomId) => onFormChange({ roomId })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.roomName} - {room.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(type) => onFormChange({ type })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {requestTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={form.priority}
              onValueChange={(priority) => onFormChange({ priority })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {requestPriorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(status) => onFormChange({ status })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {requestStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-request-due">Due time</Label>
            <Input
              id="guest-request-due"
              type="time"
              value={form.dueTime}
              onChange={(event) => onFormChange({ dueTime: event.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-request-assigned">Assigned to</Label>
            <Input
              id="guest-request-assigned"
              value={form.assignedTo}
              onChange={(event) =>
                onFormChange({ assignedTo: event.target.value })
              }
              placeholder="Front Desk"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-request-revenue">Revenue tag</Label>
            <Input
              id="guest-request-revenue"
              value={form.revenueTag}
              onChange={(event) =>
                onFormChange({ revenueTag: event.target.value })
              }
              placeholder="Upsell, recovery, paid add-on"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="guest-request-title">Request title</Label>
            <Input
              id="guest-request-title"
              value={form.title}
              onChange={(event) => onFormChange({ title: event.target.value })}
              placeholder="Extra towels, airport transfer, AC issue..."
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="guest-request-detail">Details</Label>
            <Textarea
              id="guest-request-detail"
              rows={4}
              value={form.detail}
              onChange={(event) => onFormChange({ detail: event.target.value })}
              placeholder="Describe the request, guest preference, or service issue."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={onSubmit}>
            Create request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
