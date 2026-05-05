"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ScrollText } from "lucide-react";
import type { PolicyCategory, PolicyRecord } from "./policies-data";
import { policyCategories } from "./policies-data";

type PoliciesWorkspaceProps = {
  records: PolicyRecord[];
};

const statusTone: Record<PolicyRecord["status"], string> = {
  Active:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  Review:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  Draft:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300",
};

const tableDescription: Record<PolicyCategory, string> = {
  all: "A complete view of every tracked platform, tenant, security, AI, and billing policy.",
  general:
    "Baseline platform rules that shape day-to-day administrative behavior and operational standards.",
  tenant:
    "Policies that govern tenant workspace setup, overrides, and operating boundaries.",
  security:
    "Access, audit, retention, and authentication policies for higher-risk platform actions.",
  ai: "Policies for AI usage, prompt handling, review boundaries, and guest-data safety.",
  billing:
    "Finance and payout rules that protect invoices, reconciliation, and release controls.",
};

const filterByCategory = (
  records: PolicyRecord[],
  category: PolicyCategory,
) => {
  if (category === "all") {
    return records;
  }

  return records.filter((record) => record.category === category);
};

export const PoliciesWorkspace = ({ records }: PoliciesWorkspaceProps) => {
  return (
    <Card className="gap-0 overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1.5">
            <CardTitle>Policy Archive</CardTitle>
            <CardDescription>
              Review policy coverage by category and keep revision status visible
              in one shared admin table.
            </CardDescription>
          </div>

          <Button>
            <Plus className="mr-1 size-4" />
            Create policy
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        <Tabs defaultValue="all" className="space-y-5">
          <div>
            <TabsList variant="line" className="min-w-max gap-2">
              {policyCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <TabsTrigger key={category.value} value={category.value}>
                    <Icon className="size-4" />
                    {category.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {policyCategories.map((category) => {
            const filtered = filterByCategory(records, category.value);

            return (
              <TabsContent
                key={category.value}
                value={category.value}
                className="space-y-4"
              >
                <div className="rounded-3xl border bg-[#f6f7f1] px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#537129]">
                      <ScrollText className="size-4.5" />
                    </div>

                    <div>
                      <p className="font-medium text-[#1E2A17]">
                        {category.label}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#5f6758]">
                        {tableDescription[category.value]}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border bg-background">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="pl-4">Policy</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Scope</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="pr-4">Notes</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filtered.length ? (
                        filtered.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="pl-4">
                              <div className="space-y-1">
                                <p className="font-medium">{record.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {record.id}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{record.owner}</TableCell>
                            <TableCell>{record.scope}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`${statusTone[record.status]} rounded-full px-2 py-0 text-[11px]`}
                              >
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{record.updated}</TableCell>
                            <TableCell className="pr-4">
                              <p className="max-w-[320px] whitespace-normal text-sm leading-6 text-muted-foreground">
                                {record.note}
                              </p>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No policies found for this category.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};
