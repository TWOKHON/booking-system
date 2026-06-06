"use client";

import * as React from "react";
import {
  CalculatorIcon,
  CalendarDaysIcon,
  PlusIcon,
  DownloadIcon,
  ShieldCheckIcon,
  TriangleAlertIcon,
} from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTRPC } from "@/trpc/client";
import { PayrollTable } from "./PayrollTable";
import type { PayrollRow, PayrollStatus } from "./payroll-data";

type PayrollWorkspaceViewProps = {
  ownerName: string;
  resortName: string;
  tenantLogoUrl?: string | null;
  tenantAddress?: string | null;
  tenantPhone?: string | null;
};

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

export function PayrollWorkspaceView({
  ownerName,
  resortName,
  tenantLogoUrl,
  tenantAddress,
  tenantPhone,
}: PayrollWorkspaceViewProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const runsQuery = useQuery(trpc.payroll.listRuns.queryOptions());
  const latestRunId = runsQuery.data?.[0]?.id ?? null;
  const runQuery = useQuery({
    ...trpc.payroll.getRun.queryOptions({ runId: latestRunId ?? "" }),
    enabled: Boolean(latestRunId),
  });
  const [open, setOpen] = React.useState(false);
  const [{ maxSelectableDate }] = React.useState(() => ({ maxSelectableDate: new Date() }));
  const [periodStart, setPeriodStart] = React.useState<Date>(new Date());
  const [periodEnd, setPeriodEnd] = React.useState<Date>(new Date());
  const [startOpen, setStartOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);

  const createRunMutation = useMutation(
    trpc.payroll.createRun.mutationOptions({
      onSuccess: async () => {
        toast.success("Payroll created.");
        setOpen(false);
        await queryClient.invalidateQueries(trpc.payroll.listRuns.queryOptions());
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create payroll.");
      },
    })
  );

  const rows = React.useMemo<PayrollRow[]>(() => {
    const lines = runQuery.data?.lines ?? [];
    return lines.map((line) => ({
      id: line.id,
      employee: {
        id: line.employee.id,
        fullName: line.employee.fullName,
        department: line.employee.department,
        defaultShift: line.employee.defaultShift,
        hourlyRateCents: line.employee.hourlyRateCents,
      },
      regularMinutes: line.regularMinutes,
      overtimeMinutes: line.overtimeMinutes,
      undertimeMinutes: line.undertimeMinutes,
      holidayMinutes: line.holidayMinutes,
      grossPayCents: line.grossPayCents,
      deductionsCents: line.deductionsCents,
      netPayCents: line.netPayCents,
      status: (
        line.status === "READY"
          ? "READY"
          : line.status === "NEEDS_REVIEW"
            ? "NEEDS_REVIEW"
            : "NEEDS_REVIEW"
      ) satisfies PayrollStatus,
      notes: line.notes,
    }));
  }, [runQuery.data?.lines]);

  const readyCount = rows.filter((r) => r.status === "READY").length;
  const needsReviewCount = rows.filter((r) => r.status === "NEEDS_REVIEW").length;
  const blockedCount = rows.filter((r) => r.status === "BLOCKED").length;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard
        message={`${resortName} payroll is showing ${needsReviewCount} record(s) that need review before export. Set hourly rate and shift to unlock pay computation. Holidays apply double pay by default.`}
        userName={ownerName}
      />

      <section className="overflow-hidden rounded-xl border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <CalculatorIcon className="size-3.5" />
                HR & Payroll
              </Badge>
              <Badge variant="secondary">Readiness</Badge>
              <Badge variant="secondary">Exports</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Payroll
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Validate employee setup, review payroll blockers, and export summaries.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tenant/hr/attendance">Attendance</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/hr/leave-application">Leave applications</Link>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusIcon className="size-4" />
                  Create payroll
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create payroll</DialogTitle>
                  <DialogDescription>
                    Select a payroll period to generate a payroll run (export coming next).
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Period start</Label>
                    <Popover open={startOpen} onOpenChange={setStartOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start gap-2">
                          <CalendarDaysIcon className="size-4" />
                          {toIsoDate(periodStart)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-2">
                        <Calendar
                          mode="single"
                          selected={periodStart}
                          onSelect={(d) => {
                            if (!d) return;
                            setPeriodStart(d);
                            if (toIsoDate(periodEnd) < toIsoDate(d)) setPeriodEnd(d);
                            setStartOpen(false);
                          }}
                          disabled={(date) => date > maxSelectableDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-2">
                    <Label>Period end</Label>
                    <Popover open={endOpen} onOpenChange={setEndOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start gap-2">
                          <CalendarDaysIcon className="size-4" />
                          {toIsoDate(periodEnd)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-2">
                        <Calendar
                          mode="single"
                          selected={periodEnd}
                          onSelect={(d) => {
                            if (!d) return;
                            if (toIsoDate(d) < toIsoDate(periodStart)) {
                              toast.error("End date cannot be before start date.");
                              return;
                            }
                            setPeriodEnd(d);
                            setEndOpen(false);
                          }}
                          disabled={(date) => date > maxSelectableDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      createRunMutation.mutate({
                        periodStart: toIsoDate(periodStart),
                        periodEnd: toIsoDate(periodEnd),
                      });
                    }}
                    disabled={createRunMutation.isPending}
                  >
                    {createRunMutation.isPending ? "Creating..." : "Create payroll"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="gap-2">
              <DownloadIcon className="size-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border bg-background/90 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase text-muted-foreground">
                Ready
              </div>
              <ShieldCheckIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-3 text-2xl font-semibold">{readyCount}</div>
            <div className="mt-2 text-sm text-muted-foreground">No blockers</div>
          </div>
          <div className="rounded-xl border bg-background/90 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase text-muted-foreground">
                Needs review
              </div>
              <TriangleAlertIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-3 text-2xl font-semibold">{needsReviewCount}</div>
            <div className="mt-2 text-sm text-muted-foreground">Missing setup</div>
          </div>
          <div className="rounded-xl border bg-background/90 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase text-muted-foreground">
                Blocked
              </div>
              <TriangleAlertIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-3 text-2xl font-semibold">{blockedCount}</div>
            <div className="mt-2 text-sm text-muted-foreground">Exceptions</div>
          </div>
          <div className="rounded-xl border bg-background/90 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase text-muted-foreground">
                Export mode
              </div>
              <DownloadIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-3 text-2xl font-semibold">CSV</div>
            <div className="mt-2 text-sm text-muted-foreground">Accounting-ready</div>
          </div>
        </div>
      </section>

      <PayrollTable
        data={rows}
        isLoading={runsQuery.isLoading || runQuery.isLoading}
        tenantName={resortName}
        tenantLogoUrl={tenantLogoUrl}
        tenantAddress={tenantAddress}
        tenantPhone={tenantPhone}
        payPeriodLabel={
          runQuery.data
            ? `${runQuery.data.periodStart} - ${runQuery.data.periodEnd}`
            : "--"
        }
        payDate={runQuery.data?.periodEnd ?? "--"}
        emptyLabel={
          latestRunId
            ? "No payroll lines found."
            : "No payroll runs yet. Create payroll to get started."
        }
      />
    </main>
  );
}
