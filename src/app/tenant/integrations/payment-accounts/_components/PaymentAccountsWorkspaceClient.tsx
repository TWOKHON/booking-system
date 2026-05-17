"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { PaymentAccountsTable } from "./PaymentAccountsTable";

export function PaymentAccountsWorkspaceClient({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const accountsQuery = useQuery(trpc.paymentAccounts.list.queryOptions());

  const accounts = accountsQuery.data ?? [];
  const defaultCount = accounts.filter((account) => account.isDefault).length;
  const cardCount = accounts.filter(
    (account) => account.accountType === "CREDIT_CARD",
  ).length;
  const insightMessage = `${resortName} currently tracks ${accounts.length} payment account${accounts.length === 1 ? "" : "s"} with ${defaultCount} default payout path${defaultCount === 1 ? "" : "s"}. Focus next on keeping guest collection rails clear and easy for your operations team to recognize.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <CreditCardIcon className="size-3.5" />
                Payment accounts
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <SparklesIcon className="size-3.5" />
                Platform-managed rails
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Manage the payment accounts your team uses for guest collections,
              transfers, and settlement visibility inside ResortCloud, without
              exposing third-party payment provider details on the tenant side.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tenant/foundation/billing">
                Billing & renewals
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
              Primary payment settings owner
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Account records
            </div>
            <div className="mt-3 text-xl font-semibold">
              {accountsQuery.isPending ? "..." : accounts.length}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Saved payment rails for the property
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Default accounts
            </div>
            <div className="mt-3 text-xl font-semibold">
              {accountsQuery.isPending ? "..." : defaultCount}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Used as the team’s primary settlement
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Card rails
            </div>
            <div className="mt-3 flex items-center gap-2 text-xl font-semibold">
              {accountsQuery.isPending ? "..." : cardCount}
              <ShieldCheckIcon className="size-5 text-zinc-700" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Credit card collection options recorded
            </div>
          </div>
        </div>
      </section>

      <PaymentAccountsTable
        accounts={accounts}
        isLoading={accountsQuery.isPending}
        isFetching={accountsQuery.isFetching}
      />
    </main>
  );
}
