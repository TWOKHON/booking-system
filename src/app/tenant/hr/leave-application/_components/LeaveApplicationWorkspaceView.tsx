"use client";

import * as React from "react";
import { CalendarDaysIcon, ClipboardListIcon, SendIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTRPC } from "@/trpc/client";
import { LeaveApplicationsTable } from "./LeaveApplicationsTable";
import type { LeaveApplication } from "./leave-applications-data";

type LeaveApplicationWorkspaceViewProps = {
  ownerName: string;
  resortName: string;
};

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

export function LeaveApplicationWorkspaceView({
  ownerName,
  resortName,
}: LeaveApplicationWorkspaceViewProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const employeesQuery = useQuery(trpc.employees.list.queryOptions());
  const leaveQuery = useQuery(trpc.leaveApplications.list.queryOptions());

  const createLeaveMutation = useMutation(
    trpc.leaveApplications.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Leave request submitted.");
        await queryClient.invalidateQueries(trpc.leaveApplications.list.queryOptions());
      },
      onError: (err) => {
        toast.error(err.message || "Failed to submit leave request.");
      },
    })
  );

  const bulkUpdateMutation = useMutation(
    trpc.leaveApplications.bulkUpdateStatus.mutationOptions({
      onSuccess: async (res) => {
        toast.success(`Updated ${res.updatedCount} request(s).`);
        await queryClient.invalidateQueries(trpc.leaveApplications.list.queryOptions());
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update leave requests.");
      },
    })
  );

  const [open, setOpen] = React.useState(false);
  const [employeeId, setEmployeeId] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [leaveType, setLeaveType] = React.useState("Vacation Leave");
  const [fromDate, setFromDate] = React.useState<Date>(new Date());
  const [toDate, setToDate] = React.useState<Date>(new Date());
  const [fromOpen, setFromOpen] = React.useState(false);
  const [toOpen, setToOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");

  const canSubmit =
    employeeId.trim().length > 1 &&
    leaveType.trim().length > 1 &&
    toIsoDate(toDate) >= toIsoDate(fromDate) &&
    reason.trim().length > 3;

  const submit = () => {
    if (!canSubmit) return;
    createLeaveMutation.mutate({
      employeeId,
      leaveType,
      startDate: toIsoDate(fromDate),
      endDate: toIsoDate(toDate),
      reason,
    });
    setOpen(false);
    setEmployeeId("");
    setDepartment("");
    setLeaveType("Vacation Leave");
    setFromDate(new Date());
    setToDate(new Date());
    setReason("");
  };

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard
        message={`Review and approve leave requests for ${resortName}. Keep staffing coverage stable by resolving pending items early.`}
        userName={ownerName}
      />

      <section className="overflow-hidden rounded-xl border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <ClipboardListIcon className="size-3.5" />
                HR & Leave
              </Badge>
              <Badge variant="secondary">Approvals</Badge>
              <Badge variant="secondary">Coverage</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Leave Applications
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Review leave requests, track approvals, and protect daily staffing coverage.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tenant/hr/attendance">Attendance</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/hr/payroll">Payroll</Link>
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <SendIcon className="size-4" />
                  Request leave
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Request leave</DialogTitle>
                  <DialogDescription>
                    Create a leave request for an employee. Future dates are allowed.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Employee</Label>
                    <Select
                      value={employeeId}
                      onValueChange={(v) => {
                        setEmployeeId(v);
                        const emp = (employeesQuery.data ?? []).find((e) => e.id === v);
                        setDepartment(emp?.department ?? "");
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            employeesQuery.isLoading
                              ? "Loading employees..."
                              : "Select employee"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {(employeesQuery.data ?? []).map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="leaveDepartment">Department</Label>
                    <Input
                      id="leaveDepartment"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g., Housekeeping"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Leave type</Label>
                    <Select value={leaveType} onValueChange={setLeaveType}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vacation Leave">Vacation Leave</SelectItem>
                        <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                        <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                        <SelectItem value="Unpaid Leave">Unpaid Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>From</Label>
                      <Popover open={fromOpen} onOpenChange={setFromOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start gap-2">
                            <CalendarDaysIcon className="size-4" />
                            {toIsoDate(fromDate)}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-2">
                          <Calendar
                            mode="single"
                            selected={fromDate}
                            onSelect={(d) => {
                              if (!d) return;
                              setFromDate(d);
                              if (toIsoDate(toDate) < toIsoDate(d)) {
                                setToDate(d);
                              }
                              setFromOpen(false);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="grid gap-2">
                      <Label>To</Label>
                      <Popover open={toOpen} onOpenChange={setToOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start gap-2">
                            <CalendarDaysIcon className="size-4" />
                            {toIsoDate(toDate)}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-2">
                          <Calendar
                            mode="single"
                            selected={toDate}
                            onSelect={(d) => {
                              if (!d) return;
                              if (toIsoDate(d) < toIsoDate(fromDate)) {
                                toast.error("End date cannot be before start date.");
                                return;
                              }
                              setToDate(d);
                              setToOpen(false);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="leaveReason">Reason</Label>
                    <Textarea
                      id="leaveReason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Add a short reason for the request..."
                      rows={4}
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
              <Button onClick={submit} disabled={!canSubmit}>
                    {createLeaveMutation.isPending ? "Submitting..." : "Submit request"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <LeaveApplicationsTable
        data={(leaveQuery.data ?? []) as LeaveApplication[]}
        onBulkApprove={(ids) => bulkUpdateMutation.mutate({ ids, status: "APPROVED" })}
        onBulkReject={(ids) => bulkUpdateMutation.mutate({ ids, status: "REJECTED" })}
      />
    </main>
  );
}
