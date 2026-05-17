"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  Building2Icon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { PropertiesAnalyticsTable } from "./PropertiesAnalyticsTable";

export function PropertiesAnalyticsWorkspaceClient({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const propertiesQuery = useQuery(
    trpc.propertiesAnalytics.list.queryOptions(),
  );

  const rows = propertiesQuery.data?.rows ?? [];
  const summary = propertiesQuery.data?.summary;
  const insightMessage = `${resortName} currently uses ${summary?.currentPropertyCount ?? 1} of ${summary?.propertyAllowance ?? 1} property slot${summary?.propertyAllowance === 1 ? "" : "s"}, with ${summary?.readyCount ?? 0} portfolio surfaces ready and ${summary?.watchCount ?? 0} still needing attention.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <Building2Icon className="size-3.5" />
                Multi-property
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <SparklesIcon className="size-3.5" />
                Portfolio readiness
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Review whether this tenant workspace is structured well enough to
              expand into multiple properties while keeping inventory,
              operations, finance, and guest-facing standards consistent across
              the portfolio.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tenant/analytics/advanced">
                Advanced analytics
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/foundation/billing">
                Billing & plan
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
              Primary portfolio reviewer
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Property slots
            </div>
            <div className="mt-3 text-xl font-semibold">
              {propertiesQuery.isPending
                ? "..."
                : `${summary?.currentPropertyCount ?? 1}/${summary?.propertyAllowance ?? 1}`}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Current property footprint against plan
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Ready surfaces
            </div>
            <div className="mt-3 text-xl font-semibold">
              {propertiesQuery.isPending ? "..." : (summary?.readyCount ?? 0)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Areas already strong enough to scale
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Workflow readiness
            </div>
            <div className="mt-3 flex items-center gap-2 text-xl font-semibold">
              {propertiesQuery.isPending
                ? "..."
                : (summary?.activeWorkflowCount ?? 0)}
              <ShieldCheckIcon className="size-5 text-zinc-700" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Active workflows that could be repeated
            </div>
          </div>
        </div>
      </section>

      <PropertiesAnalyticsTable
        rows={rows}
        isLoading={propertiesQuery.isPending}
        isFetching={propertiesQuery.isFetching}
      />
    </main>
  );
}
