"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  BellIcon,
  MessageSquareMoreIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { NotificationsSettingsTable } from "./NotificationsSettingsTable";

export function NotificationsWorkspaceClient({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const notificationsQuery = useQuery(trpc.notifications.list.queryOptions());

  const channels = notificationsQuery.data?.channels ?? [];
  const preferences = notificationsQuery.data?.preferences ?? [];
  const enabledChannelsCount = channels.filter((channel) => channel.enabled).length;
  const enabledPreferencesCount = preferences.filter(
    (preference) => preference.enabled,
  ).length;
  const instantPreferencesCount = preferences.filter(
    (preference) => preference.enabled && preference.frequency === "INSTANT",
  ).length;
  const insightMessage = `${resortName} currently has ${enabledChannelsCount} active delivery channel${enabledChannelsCount === 1 ? "" : "s"} and ${enabledPreferencesCount} enabled notification rule${enabledPreferencesCount === 1 ? "" : "s"}. Focus next on keeping urgent reservations and operations alerts instant.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <BellIcon className="size-3.5" />
                Notifications
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <SparklesIcon className="size-3.5" />
                Delivery controls
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Control how booking, guest, finance, and operations alerts are
              delivered so the right people receive the right updates through
              the right channels.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tenant/settings/automations">
                Automations
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/settings/team">
                Team access
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
              Primary notifications owner
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Delivery channels
            </div>
            <div className="mt-3 text-xl font-semibold">
              {notificationsQuery.isPending ? "..." : enabledChannelsCount}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Active channel types available
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Enabled rules
            </div>
            <div className="mt-3 text-xl font-semibold">
              {notificationsQuery.isPending ? "..." : enabledPreferencesCount}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Notification categories sending updates
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Instant alerts
            </div>
            <div className="mt-3 flex items-center gap-2 text-xl font-semibold">
              {notificationsQuery.isPending ? "..." : instantPreferencesCount}
              <MessageSquareMoreIcon className="size-5 text-zinc-700" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Categories configured for real-time delivery
            </div>
          </div>
        </div>
      </section>

      <NotificationsSettingsTable
        channels={channels}
        preferences={preferences}
        isLoading={notificationsQuery.isPending}
        isFetching={notificationsQuery.isFetching}
      />
    </main>
  );
}
