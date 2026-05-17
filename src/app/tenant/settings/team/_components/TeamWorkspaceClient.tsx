"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, HotelIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { TeamSettingsTable } from "./TeamSettingsTable";

export function TeamWorkspaceClient({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const teamQuery = useQuery(trpc.team.list.queryOptions());

  const members = teamQuery.data ?? [];
  const acceptedCount = members.filter((member) => member.status === "ACCEPTED").length;
  const pendingCount = members.filter((member) => member.status === "PENDING").length;
  const managerCount = members.filter(
    (member) => member.role === "OWNER_ADMIN" || member.role === "MANAGER",
  ).length;
  const insightMessage = `${resortName} currently tracks ${members.length} team access records with ${pendingCount} pending invite${pendingCount === 1 ? "" : "s"}. Focus next on keeping role permissions clear and access limited to the right operational work.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <HotelIcon className="size-3.5" />
                Team access
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <SparklesIcon className="size-3.5" />
                Permission control
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Manage who can access reservations, operations, pricing, and guest
              information so your team works clearly inside ResortCloud.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tenant/settings/property">
                Property setup
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
              Primary workspace owner
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Active seats
            </div>
            <div className="mt-3 text-xl font-semibold">
              {teamQuery.isPending ? "..." : acceptedCount}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Accepted team members with active workspace access
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Pending invites
            </div>
            <div className="mt-3 text-xl font-semibold">
              {teamQuery.isPending ? "..." : pendingCount}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Members still waiting to complete access setup
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Protected roles
            </div>
            <div className="mt-3 flex items-center gap-2 text-xl font-semibold">
              {teamQuery.isPending ? "..." : managerCount}
              <ShieldCheckIcon className="size-5 text-zinc-700" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Owner/admin and manager roles with broader access
            </div>
          </div>
        </div>
      </section>

      <TeamSettingsTable
        members={members}
        isLoading={teamQuery.isPending}
        isFetching={teamQuery.isFetching}
      />
    </main>
  );
}
