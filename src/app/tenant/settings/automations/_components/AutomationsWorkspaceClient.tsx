"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  BotIcon,
  HotelIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { AutomationSettingsTable } from "./AutomationSettingsTable";

export function AutomationsWorkspaceClient({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const automationsQuery = useQuery(trpc.automations.list.queryOptions());

  const workflows = automationsQuery.data ?? [];
  const activeCount = workflows.filter(
    (workflow) => workflow.status === "ACTIVE",
  ).length;
  const draftCount = workflows.filter(
    (workflow) => workflow.status === "DRAFT",
  ).length;
  const priorityCount = workflows.filter((workflow) => workflow.priority).length;
  const insightMessage = `${resortName} currently tracks ${workflows.length} automation workflow${workflows.length === 1 ? "" : "s"}, with ${activeCount} active and ${draftCount} still in draft. Focus next on promoting the highest-impact guest and operations flows into stable live runs.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <BotIcon className="size-3.5" />
                Automations
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <SparklesIcon className="size-3.5" />
                Workflow builder
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Manage guest messaging, arrival operations, revenue nudges, and
              task automations from one workflow workspace, then open each flow
              in the visual builder when it is ready for deeper logic.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tenant/settings/team">
                Team access
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/settings/services">
                Services offered
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">Owner</div>
            <div className="mt-3 text-xl font-semibold">{ownerName}</div>
            <div className="mt-2 text-xs text-muted-foreground">
              Primary workflow approver
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Workflow records
            </div>
            <div className="mt-3 text-xl font-semibold">
              {automationsQuery.isPending ? "..." : workflows.length}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Tenant workflows tracked inside ResortCloud
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Active now
            </div>
            <div className="mt-3 text-xl font-semibold">
              {automationsQuery.isPending ? "..." : activeCount}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Workflows currently allowed to run live
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Priority flows
            </div>
            <div className="mt-3 flex items-center gap-2 text-xl font-semibold">
              {automationsQuery.isPending ? "..." : priorityCount}
              <HotelIcon className="size-5 text-zinc-700" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Marked as high-value automations for the property
            </div>
          </div>
        </div>
      </section>

      <AutomationSettingsTable
        workflows={workflows}
        isLoading={automationsQuery.isPending}
        isFetching={automationsQuery.isFetching}
      />
    </main>
  );
}
