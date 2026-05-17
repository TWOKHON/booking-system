import Link from "next/link";
import { headers } from "next/headers";
import { ArrowUpRightIcon, CheckCircle2Icon, CircleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  tenantWorkspaceAccent,
  tenantWorkspaceRegistry,
  type TenantWorkspacePath,
} from "@/components/custom/tenant/TenantMvpShared";

export async function TenantWorkspacePage({ path }: { path: TenantWorkspacePath }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUser = session?.user?.id
    ? await db.appUser.findUnique({
        where: { authUserId: session.user.id },
        include: {
          tenantProfile: {
            select: {
              resortName: true,
              businessName: true,
            },
          },
        },
      })
    : null;

  const content = tenantWorkspaceRegistry[path];
  const primaryInsight = content.spotlightPoints[0] ?? content.spotlightBody;
  const leadingMetric = content.metrics[0];
  const ownerName = currentUser?.displayName?.trim() || session?.user.name?.trim() || "Resort Owner";
  const workspaceName =
    currentUser?.tenantProfile?.resortName?.trim() ||
    currentUser?.tenantProfile?.businessName?.trim() ||
    "your resort";
  const insightMessage = leadingMetric
    ? `${content.spotlightTitle} for ${workspaceName}: ${primaryInsight} Focus metric: ${leadingMetric.label} is ${leadingMetric.value}.`
    : `${content.spotlightTitle} for ${workspaceName}: ${primaryInsight}`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard
        message={insightMessage}
        userName={ownerName}
      />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                {tenantWorkspaceAccent.icon}
                {content.eyebrow}
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                {tenantWorkspaceAccent.tag}
                {tenantWorkspaceAccent.chip}
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                {tenantWorkspaceAccent.secondaryTag}
                {tenantWorkspaceAccent.secondaryChip}
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              {content.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              {content.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={path}>
                {content.primaryAction}
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/help">{content.secondaryAction}</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {content.metrics.map((metric) => (
            <div key={metric.label} className="border bg-background/90 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {metric.label}
              </div>
              <div className="mt-3 text-2xl font-semibold">{metric.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{metric.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="border bg-background p-5 shadow-sm md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {tenantWorkspaceAccent.automationChip}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{content.spotlightTitle}</h2>
            </div>
            <Badge variant="outline" className="gap-1.5">
              {tenantWorkspaceAccent.tertiaryTag}
              {tenantWorkspaceAccent.tertiaryChip}
            </Badge>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {content.spotlightBody}
          </p>
          <div className="mt-6 space-y-3">
            {content.spotlightPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 border-l-2 border-zinc-900 pl-4">
                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-zinc-900" />
                <p className="text-sm text-foreground/85">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border bg-background p-5 shadow-sm md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Service health
              </p>
              <h2 className="mt-2 text-xl font-semibold">Operator notes</h2>
            </div>
            <Badge variant="secondary" className="gap-1.5">
              {tenantWorkspaceAccent.quaternaryTag}
              {tenantWorkspaceAccent.quaternaryChip}
            </Badge>
          </div>
          <div className="mt-5 space-y-4">
            <div className="border bg-zinc-50/70 p-4 dark:bg-zinc-900/30">
              <div className="flex items-start gap-3">
                <CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-medium">Keep the work queue tight</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Items tied to arrivals, room readiness, and live guest issues should stay ahead of admin cleanup.
                  </p>
                </div>
              </div>
            </div>
            <div className="border p-4">
              <p className="text-sm font-medium">Tenant-side focus areas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline">Guest experience</Badge>
                <Badge variant="outline">Operational speed</Badge>
                <Badge variant="outline">Direct revenue</Badge>
                <Badge variant="outline">Property controls</Badge>
              </div>
            </div>
            <div className="border p-4">
              <p className="text-sm font-medium">Recommended flow</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Review the dashboard first, then reservations and operations, then finish with revenue and settings adjustments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {content.panels.map((panel) => (
          <div key={panel.title} className="border bg-background p-5 shadow-sm md:p-6">
            <div>
              <h2 className="text-lg font-semibold">{panel.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {panel.description}
              </p>
            </div>
            <Separator className="my-4" />
            <div className="space-y-3">
              {panel.items.map((item) => (
                <div key={`${panel.title}-${item.title}`} className="border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.meta}</p>
                    </div>
                    <Badge variant="secondary">{item.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
