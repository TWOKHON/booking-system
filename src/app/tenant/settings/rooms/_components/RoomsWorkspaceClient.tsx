"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  GlobeIcon,
  HotelIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { RoomSettingsTable } from "./RoomSettingsTable";

export function RoomsWorkspaceClient({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const roomsQuery = useQuery(trpc.rooms.list.queryOptions());

  const rooms = roomsQuery.data ?? [];
  const totalSellableUnits = rooms.reduce(
    (sum, room) => sum + room.sellableUnits,
    0,
  );
  const insightMessage = `${resortName} currently tracks ${rooms.length} room records with ${totalSellableUnits} sellable units. Focus next on keeping room details, pricing, and availability.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <HotelIcon className="size-3.5" />
                Rooms & inventory
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <SparklesIcon className="size-3.5" />
                Sellable setup
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Manage room types, sellable units, nightly pricing, and booking
              details so your inventory stays ready to sell directly on
              ResortCloud.
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
              <Link href="/tenant/settings/channels">
                Channel setup
                <GlobeIcon className="size-4" />
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
              Room records
            </div>
            <div className="mt-3 text-xl font-semibold">
              {roomsQuery.isPending ? "..." : rooms.length}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              All new rooms are active by default
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Sellable units
            </div>
            <div className="mt-3 text-xl font-semibold">
              {roomsQuery.isPending ? "..." : totalSellableUnits}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Units available across current room types
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Live on ResortCloud
            </div>
            <div className="mt-3 text-xl font-semibold">
              {roomsQuery.isPending ? "..." : `${rooms.length}/${rooms.length}`}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              All rooms publish directly to your platform
            </div>
          </div>
        </div>
      </section>

      <RoomSettingsTable
        rooms={rooms}
        isLoading={roomsQuery.isPending}
        isFetching={roomsQuery.isFetching}
      />
    </main>
  );
}
