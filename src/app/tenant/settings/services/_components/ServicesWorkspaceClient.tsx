"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, HotelIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { ServiceSettingsTable } from "./ServiceSettingsTable";

export function ServicesWorkspaceClient({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const servicesQuery = useQuery(trpc.services.list.queryOptions());

  const services = servicesQuery.data ?? [];
  const totalCatalogValue = services.reduce(
    (sum, service) => sum + service.price,
    0,
  );
  const upsellReadyCount = services.filter(
    (service) => service.description.trim().length > 0,
  ).length;
  const insightMessage = `${resortName} currently tracks ${services.length} service records with ${upsellReadyCount} guest-ready offers. Focus next on keeping service pricing, availability, and descriptions aligned for direct selling.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <HotelIcon className="size-3.5" />
                Services offered
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <SparklesIcon className="size-3.5" />
                Guest revenue setup
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Manage your guest-facing services, add-ons, and experiences so
              the team can sell them consistently across direct booking and
              on-property operations.
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
              <Link href="/tenant/settings/rooms">
                Rooms & inventory
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
              Service records
            </div>
            <div className="mt-3 text-xl font-semibold">
              {servicesQuery.isPending ? "..." : services.length}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Active guest-facing catalog entries
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Guest-ready offers
            </div>
            <div className="mt-3 text-xl font-semibold">
              {servicesQuery.isPending ? "..." : upsellReadyCount}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Services with description details ready to sell
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Catalog value
            </div>
            <div className="mt-3 text-xl font-semibold">
              {servicesQuery.isPending
                ? "..."
                : new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                    maximumFractionDigits: 0,
                  }).format(totalCatalogValue)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Combined starting price across listed services
            </div>
          </div>
        </div>
      </section>

      <ServiceSettingsTable
        services={services}
        isLoading={servicesQuery.isPending}
        isFetching={servicesQuery.isFetching}
      />
    </main>
  );
}
