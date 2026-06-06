"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  DoorOpen,
  MessageSquare,
  PlaneLanding,
  Plus,
  Sparkles,
  UserRound,
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
import { ArrivalsTable } from "./ArrivalsTable";
import type { ArrivalGuest } from "./arrivals-data";

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
  violet: {
    icon: "bg-violet-50 text-violet-700",
    progress: "[&>div]:bg-violet-600",
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

export function ArrivalsWorkspaceView({
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
  const [isMessageOpen, setIsMessageOpen] = React.useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = React.useState(false);
  const [selectedArrivalId, setSelectedArrivalId] = React.useState("");
  const [arrivalForm, setArrivalForm] = React.useState({
    guestName: "",
    reservationCode: "",
    roomId: "",
    arrivalTime: "14:00",
    nights: "1",
    party: "2 adults",
    status: "Due In",
    roomReadiness: "Ready",
    balance: "0",
    notes: "",
  });
  const [guestMessage, setGuestMessage] = React.useState(
    "Welcome to the resort. Our front desk team is ready to assist with your arrival.",
  );
  const summaryQuery = useQuery(
    trpc.arrivals.summary.queryOptions({ date: selectedDate }),
  );
  const arrivalsQuery = useQuery(
    trpc.arrivals.list.queryOptions({ date: selectedDate }),
  );
  const roomsQuery = useQuery(trpc.rooms.list.queryOptions());
  const arrivalsListQueryKey = trpc.arrivals.list.queryKey();
  const arrivalsSummaryQueryKey = trpc.arrivals.summary.queryKey();
  const summary = summaryQuery.data;
  const arrivals = arrivalsQuery.data ?? [];
  const pendingArrivals = arrivals.filter((arrival) => arrival.status !== "Arrived");
  const totalArrivals = summary?.totalArrivals ?? 0;
  const arrived = summary?.arrived ?? 0;
  const roomsReady = summary?.roomsReady ?? 0;
  const openBalances = summary?.openBalances ?? 0;
  const vipArrivals = summary?.vipArrivals ?? 0;
  const readyPercent = summary?.readyPercent ?? 0;
  const arrivalPercent = summary?.arrivalPercent ?? 0;
  const markArrivedMutation = useMutation(
    trpc.arrivals.markArrived.mutationOptions({
      onSuccess: async (arrival) => {
        toast.success(`${arrival.guestName} checked in.`);
        setIsCheckInOpen(false);
        setSelectedArrivalId("");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: arrivalsListQueryKey }),
          queryClient.invalidateQueries({ queryKey: arrivalsSummaryQueryKey }),
        ]);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to start check-in.");
      },
    }),
  );
  const createArrivalMutation = useMutation(
    trpc.arrivals.create.mutationOptions({
      onSuccess: async (arrival) => {
        toast.success(`${arrival.guestName} added to arrivals.`);
        setIsCreateOpen(false);
        setArrivalForm({
          guestName: "",
          reservationCode: "",
          roomId: "",
          arrivalTime: "14:00",
          nights: "1",
          party: "2 adults",
          status: "Due In",
          roomReadiness: "Ready",
          balance: "0",
          notes: "",
        });
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: arrivalsListQueryKey }),
          queryClient.invalidateQueries({ queryKey: arrivalsSummaryQueryKey }),
        ]);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to add arrival.");
      },
    }),
  );
  const kpiCards: KpiCardItem[] = [
    {
      label: "Arrivals Today",
      value: String(totalArrivals),
      detail: `${arrived} checked in`,
      icon: PlaneLanding,
      tone: "blue",
      progress: arrivalPercent,
    },
    {
      label: "Rooms Ready",
      value: String(roomsReady),
      detail: `${readyPercent}% ready for arrival`,
      icon: CheckCircle2,
      tone: "green",
      progress: readyPercent,
    },
    {
      label: "Open Balances",
      value: String(openBalances),
      detail: "Collect before key release",
      icon: CreditCard,
      tone: "red",
      progress: totalArrivals ? Math.round((openBalances / totalArrivals) * 100) : 0,
    },
    {
      label: "VIP Arrivals",
      value: String(vipArrivals),
      detail: "Need manager touchpoint",
      icon: Sparkles,
      tone: "violet",
      progress: null,
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-5">
      <TuroInsightCard
        message={`${resortName} has ${totalArrivals} arrivals today, ${roomsReady} rooms ready, and ${openBalances} balances to resolve before check-in.`}
        userName={ownerName}
      />

      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Arrivals</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage today&apos;s guest arrivals, room readiness, balances, and
            front desk check-in flow.
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
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="size-4" />
            New arrival
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsMessageOpen(true)}
          >
            <MessageSquare className="size-4" />
            Message guests
          </Button>
          <Button
            className="gap-2"
            disabled={arrivalsQuery.isLoading || markArrivedMutation.isPending}
            onClick={() => {
              if (pendingArrivals.length === 0) {
                toast.info("No pending arrivals for the selected date.");
                return;
              }

              setSelectedArrivalId(pendingArrivals[0]?.id ?? "");
              setIsCheckInOpen(true);
            }}
          >
            <DoorOpen className="size-4" />
            Start check-in
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_290px]">
        <ArrivalsTable selectedDate={selectedDate} />

        <aside className="space-y-4">
          <ArrivalTimelinePanel timeline={summary?.timeline ?? []} />
          <ArrivalAlertsPanel alerts={summary?.alerts ?? []} />
          <ReadinessPanel
            readyCount={roomsReady}
            notReady={summary?.notReady ?? []}
          />
        </aside>
      </section>

      <MessageGuestsDialog
        arrivals={arrivals}
        isOpen={isMessageOpen}
        message={guestMessage}
        selectedDate={selectedDate}
        onMessageChange={setGuestMessage}
        onOpenChange={setIsMessageOpen}
      />

      <NewArrivalDialog
        form={arrivalForm}
        isOpen={isCreateOpen}
        isSubmitting={createArrivalMutation.isPending}
        rooms={roomsQuery.data ?? []}
        selectedDate={selectedDate}
        onFormChange={(patch) =>
          setArrivalForm((current) => ({ ...current, ...patch }))
        }
        onOpenChange={setIsCreateOpen}
        onSubmit={() => {
          if (!arrivalForm.guestName.trim()) {
            toast.error("Guest name is required.");
            return;
          }

          if (!arrivalForm.roomId) {
            toast.error("Select a room for this arrival.");
            return;
          }

          createArrivalMutation.mutate({
            guestName: arrivalForm.guestName,
            reservationCode: arrivalForm.reservationCode,
            roomId: arrivalForm.roomId,
            arrivalAt: buildArrivalDate(selectedDate, arrivalForm.arrivalTime),
            nights: Number(arrivalForm.nights) || 1,
            party: arrivalForm.party,
            status: arrivalForm.status as
              | "Due In"
              | "Arrived"
              | "Early"
              | "Delayed"
              | "VIP",
            roomReadiness: arrivalForm.roomReadiness as
              | "Ready"
              | "Inspecting"
              | "Dirty"
              | "Blocked",
            balanceCents: Math.round((Number(arrivalForm.balance) || 0) * 100),
            notes: arrivalForm.notes,
          });
        }}
      />

      <StartCheckInDialog
        arrivals={pendingArrivals}
        isOpen={isCheckInOpen}
        isSubmitting={markArrivedMutation.isPending}
        selectedArrivalId={selectedArrivalId}
        onArrivalChange={setSelectedArrivalId}
        onOpenChange={setIsCheckInOpen}
        onSubmit={() => {
          if (!selectedArrivalId) {
            toast.error("Select an arrival to check in.");
            return;
          }

          markArrivedMutation.mutate({ id: selectedArrivalId });
        }}
      />
    </main>
  );
}

function buildArrivalDate(date: Date, time: string) {
  const [hours = "14", minutes = "00"] = time.split(":");
  const arrivalAt = new Date(date);
  arrivalAt.setHours(Number(hours), Number(minutes), 0, 0);

  return arrivalAt;
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

function MessageGuestsDialog({
  arrivals,
  isOpen,
  message,
  selectedDate,
  onMessageChange,
  onOpenChange,
}: {
  arrivals: ArrivalGuest[];
  isOpen: boolean;
  message: string;
  selectedDate: Date;
  onMessageChange: (value: string) => void;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const recipientCount = arrivals.length;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Message guests</DialogTitle>
          <DialogDescription>
            Send an arrival note to guests scheduled on{" "}
            {formatDateButtonLabel(selectedDate).toLowerCase()}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-3 text-sm">
            <p className="font-medium">{recipientCount} recipients</p>
            <p className="mt-1 text-muted-foreground">
              Guests in the selected arrivals list will receive this message.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrival-message">Message</Label>
            <Textarea
              id="arrival-message"
              value={message}
              rows={5}
              onChange={(event) => onMessageChange(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={recipientCount === 0 || !message.trim()}
            onClick={() => {
              toast.success(`Message queued for ${recipientCount} guests.`);
              onOpenChange(false);
            }}
          >
            Send message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewArrivalDialog({
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
    reservationCode: string;
    roomId: string;
    arrivalTime: string;
    nights: string;
    party: string;
    status: string;
    roomReadiness: string;
    balance: string;
    notes: string;
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
          <DialogTitle>New arrival</DialogTitle>
          <DialogDescription>
            Add a guest arrival for {formatDateButtonLabel(selectedDate).toLowerCase()}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="arrival-guest">Guest name</Label>
            <Input
              id="arrival-guest"
              value={form.guestName}
              onChange={(event) => onFormChange({ guestName: event.target.value })}
              placeholder="Guest full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrival-code">Reservation code</Label>
            <Input
              id="arrival-code"
              value={form.reservationCode}
              onChange={(event) =>
                onFormChange({ reservationCode: event.target.value })
              }
              placeholder="Auto-generated if blank"
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
            <Label htmlFor="arrival-time">Arrival time</Label>
            <Input
              id="arrival-time"
              type="time"
              value={form.arrivalTime}
              onChange={(event) =>
                onFormChange({ arrivalTime: event.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrival-nights">Nights</Label>
            <Input
              id="arrival-nights"
              min={1}
              type="number"
              value={form.nights}
              onChange={(event) => onFormChange({ nights: event.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrival-party">Party</Label>
            <Input
              id="arrival-party"
              value={form.party}
              onChange={(event) => onFormChange({ party: event.target.value })}
              placeholder="2 adults"
            />
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
                {["Due In", "Early", "Delayed", "VIP", "Arrived"].map(
                  (status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Room readiness</Label>
            <Select
              value={form.roomReadiness}
              onValueChange={(roomReadiness) => onFormChange({ roomReadiness })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Ready", "Inspecting", "Dirty", "Blocked"].map(
                  (readiness) => (
                    <SelectItem key={readiness} value={readiness}>
                      {readiness}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="arrival-balance">Open balance (PHP)</Label>
            <Input
              id="arrival-balance"
              min={0}
              step="0.01"
              type="number"
              value={form.balance}
              onChange={(event) => onFormChange({ balance: event.target.value })}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="arrival-notes">Notes</Label>
            <Textarea
              id="arrival-notes"
              rows={3}
              value={form.notes}
              onChange={(event) => onFormChange({ notes: event.target.value })}
              placeholder="Arrival notes, requests, or front desk reminders"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={onSubmit}>
            Add arrival
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StartCheckInDialog({
  arrivals,
  isOpen,
  isSubmitting,
  selectedArrivalId,
  onArrivalChange,
  onOpenChange,
  onSubmit,
}: {
  arrivals: ArrivalGuest[];
  isOpen: boolean;
  isSubmitting: boolean;
  selectedArrivalId: string;
  onArrivalChange: (value: string) => void;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
}) {
  const selectedArrival = arrivals.find(
    (arrival) => arrival.id === selectedArrivalId,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Start check-in</DialogTitle>
          <DialogDescription>
            Select the arrival to mark as checked in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Arrival</Label>
            <Select value={selectedArrivalId} onValueChange={onArrivalChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select guest arrival" />
              </SelectTrigger>
              <SelectContent>
                {arrivals.map((arrival) => (
                  <SelectItem key={arrival.id} value={arrival.id}>
                    {arrival.guestName} - Room {arrival.room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedArrival ? (
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              <p className="font-medium">{selectedArrival.reservationCode}</p>
              <p className="mt-1 text-muted-foreground">
                {selectedArrival.arrivalTime} · {selectedArrival.party} ·{" "}
                {selectedArrival.roomReadiness}
              </p>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!selectedArrivalId || isSubmitting}
            onClick={onSubmit}
          >
            Start check-in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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

function ArrivalTimelinePanel({
  timeline,
}: {
  timeline: Array<{ time: string; label: string; detail: string }>;
}) {
  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Arrival timeline</h2>
          <p className="text-sm text-muted-foreground">Front desk flow by ETA.</p>
        </div>
        <Clock3 className="size-5 text-muted-foreground" />
      </div>

      <div className="mt-5 space-y-4">
        {timeline.length ? timeline.map((item) => (
          <div key={`${item.time}-${item.label}`} className="flex gap-3">
            <div className="w-18 shrink-0 text-xs font-medium text-muted-foreground">
              {item.time}
            </div>
            <div className="border-l pl-3">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
            </div>
          </div>
        )) : (
          <p className="text-sm text-muted-foreground">
            No scheduled arrivals yet.
          </p>
        )}
      </div>
    </section>
  );
}

function ArrivalAlertsPanel({
  alerts,
}: {
  alerts: Array<{ label: string; value: number; tone: string }>;
}) {
  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Arrival alerts</h2>
        <AlertCircle className="size-5 text-muted-foreground" />
      </div>

      <div className="mt-4 space-y-3">
        {alerts.length ? alerts.map((alert) => (
          <div key={alert.label} className="flex items-center gap-3 text-sm">
            <span className={cn("size-2.5 rounded-full", alert.tone)} />
            <span className="w-6 font-semibold tabular-nums">{alert.value}</span>
            <span className="text-muted-foreground">{alert.label}</span>
          </div>
        )) : (
          <p className="text-sm text-muted-foreground">No arrival alerts.</p>
        )}
      </div>
    </section>
  );
}

function ReadinessPanel({
  readyCount,
  notReady,
}: {
  readyCount: number;
  notReady: Array<{ id: string; room: string; roomReadiness: string }>;
}) {
  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-green-50 text-green-700">
          <UserRound className="size-5" />
        </span>
        <div>
          <h2 className="text-base font-semibold">Readiness snapshot</h2>
          <p className="text-sm text-muted-foreground">
            {readyCount} ready, {notReady.length} need follow-up.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {notReady.length ? notReady.map((guest) => (
          <div
            key={guest.id}
            className="flex items-center justify-between gap-3 border p-3 text-sm"
          >
            <span>{guest.room}</span>
            <span className="text-muted-foreground">{guest.roomReadiness}</span>
          </div>
        )) : (
          <p className="text-sm text-muted-foreground">
            All assigned rooms are ready.
          </p>
        )}
      </div>
    </section>
  );
}
