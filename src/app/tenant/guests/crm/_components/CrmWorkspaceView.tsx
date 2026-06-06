"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Gift,
  HeartHandshake,
  MailPlus,
  Star,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Button } from "@/components/ui/button";
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
import { CrmTable } from "./CrmTable";
import {
  guestLifecycles,
  guestSegments,
  type GuestLifecycle,
  type GuestSegment,
} from "./crm-data";

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

export function CrmWorkspaceView({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [guestForm, setGuestForm] = React.useState({
    guestName: "",
    email: "",
    phone: "",
    segment: "New",
    lifecycle: "Active",
    totalStays: "0",
    lifetimeValue: "0",
    preference: "",
    nextAction: "",
    owner: "Front Desk",
  });
  const summaryQuery = useQuery(trpc.guestCrm.summary.queryOptions());
  const profilesQueryKey = trpc.guestCrm.list.queryKey();
  const summaryQueryKey = trpc.guestCrm.summary.queryKey();
  const summary = summaryQuery.data;
  const totalGuests = summary?.totalGuests ?? 0;
  const vipGuests = summary?.vipGuests ?? 0;
  const upcoming = summary?.upcoming ?? 0;
  const winBack = summary?.winBack ?? 0;
  const repeatPercent = summary?.repeatPercent ?? 0;
  const preferenceCoverage = summary?.preferenceCoverage ?? 0;
  const createGuestMutation = useMutation(
    trpc.guestCrm.create.mutationOptions({
      onSuccess: async (guest) => {
        toast.success(`${guest.guestName} added to CRM.`);
        setIsCreateOpen(false);
        setGuestForm({
          guestName: "",
          email: "",
          phone: "",
          segment: "New",
          lifecycle: "Active",
          totalStays: "0",
          lifetimeValue: "0",
          preference: "",
          nextAction: "",
          owner: "Front Desk",
        });
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: profilesQueryKey }),
          queryClient.invalidateQueries({ queryKey: summaryQueryKey }),
        ]);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to add guest profile.");
      },
    }),
  );
  const kpiCards: KpiCardItem[] = [
    {
      label: "Guest Profiles",
      value: String(totalGuests),
      detail: `${repeatPercent}% repeat guest base`,
      icon: UsersRound,
      tone: "blue",
      progress: repeatPercent,
    },
    {
      label: "VIP Guests",
      value: String(vipGuests),
      detail: "High-touch relationship list",
      icon: Star,
      tone: "violet",
      progress: totalGuests ? Math.round((vipGuests / totalGuests) * 100) : 0,
    },
    {
      label: "Upcoming Stays",
      value: String(upcoming),
      detail: "Need pre-arrival personalization",
      icon: CalendarDays,
      tone: "green",
      progress: totalGuests ? Math.round((upcoming / totalGuests) * 100) : 0,
    },
    {
      label: "Preference Coverage",
      value: `${preferenceCoverage}%`,
      detail: `${winBack} win-back profile${winBack === 1 ? "" : "s"}`,
      icon: HeartHandshake,
      tone: "amber",
      progress: preferenceCoverage,
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-5">
      <TuroInsightCard
        message={`${resortName} has ${vipGuests} VIP profile${vipGuests === 1 ? "" : "s"}, ${upcoming} upcoming CRM-linked stay${upcoming === 1 ? "" : "s"}, and ${winBack} win-back opportunity${winBack === 1 ? "" : "ies"} to prioritize.`}
        userName={ownerName}
      />

      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Guest CRM</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Build guest memory, segment relationships, and turn stay history
            into personalized service and repeat bookings.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => {
              void summaryQuery.refetch();
              toast.info("CRM activity refreshed.");
            }}
          >
            <TrendingUp className="size-4" />
            Activity
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => toast.success("Campaign draft queued.")}
          >
            <MailPlus className="size-4" />
            Campaign
          </Button>
          <Button
            className="gap-2"
            onClick={() => setIsCreateOpen(true)}
          >
            <Gift className="size-4" />
            Add guest
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </section>

      <CrmTable />

      <AddGuestDialog
        form={guestForm}
        isOpen={isCreateOpen}
        isSubmitting={createGuestMutation.isPending}
        onFormChange={(patch) =>
          setGuestForm((current) => ({ ...current, ...patch }))
        }
        onOpenChange={setIsCreateOpen}
        onSubmit={() => {
          if (!guestForm.guestName.trim()) {
            toast.error("Guest name is required.");
            return;
          }

          if (!guestForm.email.trim()) {
            toast.error("Guest email is required.");
            return;
          }

          createGuestMutation.mutate({
            guestName: guestForm.guestName,
            email: guestForm.email,
            phone: guestForm.phone,
            segment: guestForm.segment as GuestSegment,
            lifecycle: guestForm.lifecycle as GuestLifecycle,
            totalStays: Number(guestForm.totalStays) || 0,
            lifetimeValueCents:
              Math.round((Number(guestForm.lifetimeValue) || 0) * 100),
            preference: guestForm.preference,
            nextAction: guestForm.nextAction,
            owner: guestForm.owner,
          });
        }}
      />
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

function AddGuestDialog({
  form,
  isOpen,
  isSubmitting,
  onFormChange,
  onOpenChange,
  onSubmit,
}: {
  form: {
    guestName: string;
    email: string;
    phone: string;
    segment: string;
    lifecycle: string;
    totalStays: string;
    lifetimeValue: string;
    preference: string;
    nextAction: string;
    owner: string;
  };
  isOpen: boolean;
  isSubmitting: boolean;
  onFormChange: (patch: Partial<typeof form>) => void;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>Add guest profile</DialogTitle>
          <DialogDescription>
            Create a CRM profile with relationship signals and follow-up context.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="crm-guest-name">Guest name</Label>
            <Input
              id="crm-guest-name"
              value={form.guestName}
              onChange={(event) => onFormChange({ guestName: event.target.value })}
              placeholder="Guest full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crm-email">Email</Label>
            <Input
              id="crm-email"
              type="email"
              value={form.email}
              onChange={(event) => onFormChange({ email: event.target.value })}
              placeholder="guest@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crm-phone">Phone</Label>
            <Input
              id="crm-phone"
              value={form.phone}
              onChange={(event) => onFormChange({ phone: event.target.value })}
              placeholder="+63..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crm-owner">Owner</Label>
            <Input
              id="crm-owner"
              value={form.owner}
              onChange={(event) => onFormChange({ owner: event.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Segment</Label>
            <Select
              value={form.segment}
              onValueChange={(segment) => onFormChange({ segment })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {guestSegments.map((segment) => (
                  <SelectItem key={segment} value={segment}>
                    {segment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Lifecycle</Label>
            <Select
              value={form.lifecycle}
              onValueChange={(lifecycle) => onFormChange({ lifecycle })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {guestLifecycles.map((lifecycle) => (
                  <SelectItem key={lifecycle} value={lifecycle}>
                    {lifecycle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="crm-total-stays">Total stays</Label>
            <Input
              id="crm-total-stays"
              min={0}
              type="number"
              value={form.totalStays}
              onChange={(event) =>
                onFormChange({ totalStays: event.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crm-ltv">Lifetime value (PHP)</Label>
            <Input
              id="crm-ltv"
              min={0}
              step="0.01"
              type="number"
              value={form.lifetimeValue}
              onChange={(event) =>
                onFormChange({ lifetimeValue: event.target.value })
              }
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="crm-preference">Preference signal</Label>
            <Textarea
              id="crm-preference"
              rows={3}
              value={form.preference}
              onChange={(event) =>
                onFormChange({ preference: event.target.value })
              }
              placeholder="Room, dining, arrival, service, or amenity preferences"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="crm-action">Next action</Label>
            <Textarea
              id="crm-action"
              rows={3}
              value={form.nextAction}
              onChange={(event) =>
                onFormChange({ nextAction: event.target.value })
              }
              placeholder="Follow-up, campaign, recovery, or personalization action"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={onSubmit}>
            Add guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
