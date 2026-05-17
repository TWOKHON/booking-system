"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircleIcon,
  ArrowUpRightIcon,
  BellRingIcon,
  CheckCircle2Icon,
  HashIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { DiscordChannelsTable } from "./DiscordChannelsTable";

type DiscordConnectState =
  | "idle"
  | "success"
  | "access_denied"
  | "invalid_state"
  | "missing_config"
  | "invalid_request"
  | "create_failed"
  | "token_exchange_failed";

function getConnectStateMessage(state: DiscordConnectState) {
  switch (state) {
    case "success":
      return {
        tone: "success" as const,
        title: "Discord connected",
        body: "The selected Discord channel was connected successfully and is now ready for tenant alert routing.",
      };
    case "access_denied":
      return {
        tone: "error" as const,
        title: "Discord connection was cancelled",
        body: "The Discord authorization flow was cancelled before the channel connection could be completed.",
      };
    case "invalid_state":
      return {
        tone: "error" as const,
        title: "Discord connection could not be verified",
        body: "The authorization state did not match. Start the Discord connection again to continue safely.",
      };
    case "missing_config":
      return {
        tone: "error" as const,
        title: "Discord app configuration is missing",
        body: "Add the ResortCloud Discord app credentials on the server before tenants can connect channels directly.",
      };
    case "invalid_request":
      return {
        tone: "error" as const,
        title: "Discord connection details were incomplete",
        body: "The channel connection request was missing required information. Try starting the connect flow again.",
      };
    case "create_failed":
      return {
        tone: "error" as const,
        title: "Discord channel could not be saved",
        body: "Discord authorization completed, but ResortCloud could not save the connected channel. Review duplicates or try again.",
      };
    case "token_exchange_failed":
      return {
        tone: "error" as const,
        title: "Discord token exchange failed",
        body: "Discord returned an incomplete authorization response. Try again after checking the Discord app settings.",
      };
    default:
      return null;
  }
}

export function DiscordWorkspaceClient({
  ownerName,
  resortName,
  connectState,
  canStartDiscordOAuth,
}: {
  ownerName: string;
  resortName: string;
  connectState: DiscordConnectState;
  canStartDiscordOAuth: boolean;
}) {
  const trpc = useTRPC();
  const discordQuery = useQuery(trpc.discord.list.queryOptions());
  const connectMessage = getConnectStateMessage(connectState);

  const channels = discordQuery.data ?? [];
  const bookingChannelCount = channels.filter(
    (channel) => channel.eventScope === "BOOKINGS",
  ).length;
  const financeChannelCount = channels.filter(
    (channel) => channel.eventScope === "FINANCE",
  ).length;
  const insightMessage = `${resortName} currently has ${channels.length} Discord channel mapping${channels.length === 1 ? "" : "s"} ready for internal alerts. Focus next on keeping booking and operations messages routed to the right team channels.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      {connectMessage ? (
        <section
          className={
            connectMessage.tone === "success"
              ? "flex items-start gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900"
              : "flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-red-900"
          }
        >
          {connectMessage.tone === "success" ? (
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
          ) : (
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
          )}
          <div>
            <p className="text-sm font-medium">{connectMessage.title}</p>
            <p className="mt-1 text-sm">{connectMessage.body}</p>
          </div>
        </section>
      ) : null}

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <HashIcon className="size-3.5" />
                Discord channels
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <SparklesIcon className="size-3.5" />
                Team alert routing
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Route internal booking, operations, finance, and owner alerts into
              the Discord channels your team already watches, without exposing
              workflow builder complexity on the tenant side.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tenant/integrations/notifications">
                Notifications
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/settings/automations">
                Automations
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
              Primary Discord integration owner
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Connected channels
            </div>
            <div className="mt-3 text-xl font-semibold">
              {discordQuery.isPending ? "..." : channels.length}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Tenant Discord webhook routes
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Booking routes
            </div>
            <div className="mt-3 text-xl font-semibold">
              {discordQuery.isPending ? "..." : bookingChannelCount}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Channels focused on reservation
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Finance routes
            </div>
            <div className="mt-3 flex items-center gap-2 text-xl font-semibold">
              {discordQuery.isPending ? "..." : financeChannelCount}
              <BellRingIcon className="size-5 text-zinc-700" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Channels reserved for payment and cash
            </div>
          </div>
        </div>
      </section>

      <DiscordChannelsTable
        channels={channels}
        isLoading={discordQuery.isPending}
        isFetching={discordQuery.isFetching}
        canStartDiscordOAuth={canStartDiscordOAuth}
      />
    </main>
  );
}
