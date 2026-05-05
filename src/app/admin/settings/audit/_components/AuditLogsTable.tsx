"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, ShieldCheck } from "lucide-react";
import type { AuditLogRecord } from "./audit-data";

type AuditLogsTableProps = {
  records: AuditLogRecord[];
};

const statusTone: Record<AuditLogRecord["status"], string> = {
  Recorded:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  Flagged:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  Review:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300",
};

export const AuditLogsTable = ({ records }: AuditLogsTableProps) => {
  return (
    <Card className="gap-0 overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1.5">
            <CardTitle>Audit Log Archive</CardTitle>
            <CardDescription>
              Platform activity history covering who acted, what changed, where
              it happened, the source IP, and when the event was recorded.
            </CardDescription>
          </div>

          <Button variant="outline">
            <Download className="mr-1 size-4" />
            Export logs
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-5">
        <div className="rounded-3xl border bg-[#f6f7f1] px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#537129]">
              <ShieldCheck className="size-4.5" />
            </div>

            <div>
              <p className="font-medium text-[#1E2A17]">Audit visibility</p>
              <p className="mt-1 text-sm leading-6 text-[#5f6758]">
                Use this table to trace elevated access changes, security
                events, and policy-sensitive admin actions across the platform.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border bg-background">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>IP address</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="pr-4">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="pl-4">
                    <div className="space-y-1">
                      <p className="font-medium">{record.actor}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.role} · {record.id}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-[260px] whitespace-normal text-sm leading-6">
                      {record.action}
                    </p>
                  </TableCell>
                  <TableCell>{record.area}</TableCell>
                  <TableCell>{record.ipAddress}</TableCell>
                  <TableCell>{record.timestamp}</TableCell>
                  <TableCell className="pr-4">
                    <Badge
                      variant="outline"
                      className={`${statusTone[record.status]} rounded-full px-2 py-0 text-[11px]`}
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
