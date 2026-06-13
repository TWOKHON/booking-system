"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  CableIcon,
  CheckCircle2Icon,
  EyeIcon,
  GlobeIcon,
  LayoutTemplateIcon,
  MoveHorizontalIcon,
  PanelsTopLeftIcon,
  ScanSearchIcon,
  Settings2Icon,
  SparklesIcon,
  PalmtreeIcon,
  Loader2Icon,
  Trash2Icon,
  AlertTriangleIcon,
} from "lucide-react";
import Link from "next/link";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { HeroBlock } from "@/components/puck/hero-block";
import { HeroCarouselBlock } from "@/components/puck/hero-carousel-block";
import { resortTemplates } from "@/app/site-builder/_lib/puck/resort-templates";

type BuilderWorkspaceViewProps = {
  siteId: string;
  ownerName: string;
  resortName: string;
  previewUrl: string;
  roomCount: number;
  serviceCount: number;
};

type ItemRow = {
  title: string;
  meta: string;
  status: string;
};

function SectionCard({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="border bg-background p-4 shadow-sm">
      <div className="text-zinc-700">{icon}</div>
      <div className="mt-4 text-[11px] font-medium text-muted-foreground uppercase">
        {eyebrow}
      </div>
      <div className="mt-2 text-base font-semibold">{title}</div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function ListPanel({
  title,
  description,
  badge,
  items,
}: {
  title: string;
  description: string;
  badge?: string;
  items: ItemRow[];
}) {
  return (
    <div className="border bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-medium text-muted-foreground uppercase">
            {title}
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
        {badge ? (
          <Badge variant="outline" className="rounded-sm text-[10px]">
            {badge}
          </Badge>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={`${item.title}-${item.status}`}
            className="flex items-start justify-between gap-3 border-t pt-3 first:border-t-0 first:pt-0"
          >
            <div>
              <div className="text-sm font-medium">{item.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {item.meta}
              </div>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BuilderWorkspaceView({
  siteId,
  ownerName,
  resortName,
  previewUrl,
  roomCount,
  serviceCount,
}: BuilderWorkspaceViewProps) {
  const trpc = useTRPC();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const siteBuilderQuery = useQuery(trpc.siteBuilder.get.queryOptions());
  const siteBuilder = siteBuilderQuery.data;
  const isLoading = siteBuilderQuery.isLoading;

  const resetSite = useMutation(
    trpc.siteBuilder.reset.mutationOptions({
      onSuccess: () => {
        toast.success("Site reset successfully");
        try {
          window.location.reload();
        } catch (e) {
          window.location.reload();
        }
      },
      onError: (error) => {
        toast.error(`Failed to reset site: ${error.message}`);
      },
      onSettled: () => {
        setIsDeleting(false);
      },
    })
  );

  const handleDeleteSite = () => {
    setIsDeleting(true);
    resetSite.mutate();
  };

  const hasExistingSite = !!(siteBuilder?.draftData || siteBuilder?.publishedData);
  const isPublished = !!siteBuilder?.publishedData;
  const lastUpdated = siteBuilder?.updatedAt ? new Date(siteBuilder.updatedAt).toLocaleDateString() : null;

  const insightMessage = `${resortName} is currently prepared with ${roomCount} room group${roomCount === 1 ? "" : "s"} and ${serviceCount} guest offer${serviceCount === 1 ? "" : "s"} feeding the public site. Focus next on clean section order, booking-widget handoff, and preview.`;
  const architectureItems: ItemRow[] = [
    {
      title: "Hero, About, Rooms",
      meta: `Top booking story structure for ${roomCount || 1} room group${roomCount === 1 ? "" : "s"}`,
      status: "Included",
    },
    {
      title: "Gallery and Amenities",
      meta: `Trust and experience builders aligned to ${serviceCount || 1} guest offer${serviceCount === 1 ? "" : "s"}`,
      status: "Included",
    },
    {
      title: "Contact and Location",
      meta: "Last-mile conversion support",
      status: "Included",
    },
  ];

  const controlsItems: ItemRow[] = [
    {
      title: "Toggle sections",
      meta: "Show or hide modules",
      status: "Supported",
    },
    {
      title: "Reorder sections",
      meta: "Change content flow",
      status: "Supported",
    },
    {
      title: "Live preview",
      meta: "See before going live",
      status: "Supported",
    },
  ];

  const linkageItems: ItemRow[] = [
    {
      title: "Embedded booking widget",
      meta: "Uses tenant reservation data",
      status: "Core",
    },
    {
      title: "Availability awareness",
      meta: "Public path anchored to system records",
      status: "Core",
    },
    {
      title: "Lead capture handoff",
      meta: "Supports direct inquiry generation",
      status: "Core",
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden rounded-2xl border bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,1),rgba(248,250,252,0.98)_48%,rgba(245,245,244,0.96))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5 rounded-sm">
                <LayoutTemplateIcon className="size-3.5" />
                Website Builder
              </Badge>
              <Badge variant="outline" className="gap-1.5 rounded-sm">
                <ScanSearchIcon className="size-3.5" />
                Owner operations
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              Builder workspace
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Control the no-code public resort site with toggleable sections,
              booking widget connection, and brand-aware editing for{" "}
              {resortName}.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/site-builder/${siteId}`}>
                Open site builder
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          <SectionCard
            eyebrow="Template foundation"
            title="Resort-ready"
            description="Hero, About, Rooms, Gallery, Amenities, Contact"
            icon={<PanelsTopLeftIcon className="size-4" />}
          />
          <SectionCard
            eyebrow="Booking widget"
            title="Connected"
            description="Auto-linked to reservation module"
            icon={<CableIcon className="size-4" />}
          />
          <SectionCard
            eyebrow="Section controls"
            title="Toggle + reorder"
            description="Owner-managed without code"
            icon={<Settings2Icon className="size-4" />}
          />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ListPanel
          title="Section architecture"
          description="Default site areas called out in the MVP."
          items={architectureItems}
        />
        <ListPanel
          title="Builder controls"
          description="Editing actions this workspace should surface."
          items={controlsItems}
        />
        <ListPanel
          title="Booking linkage"
          description="How the website stays connected to operations."
          items={linkageItems}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] font-medium text-muted-foreground uppercase">
              {hasExistingSite ? "Your Site" : "Templates · Starting points"}
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {hasExistingSite ? "Active Site Project" : "Site Templates"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {hasExistingSite
                ? "You have an active site builder project. Continue editing to manage your resort's public presence."
                : "Choose a professionally designed template for your resort management and reservation landing page."}
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5 rounded-sm">
            <PalmtreeIcon className="size-3.5" />
            {hasExistingSite ? "1 Project" : `${resortTemplates.length} Designs`}
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-xl border bg-muted/30">
            <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : hasExistingSite ? (
          <div className="overflow-hidden rounded-xl border bg-background p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <GlobeIcon className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Ready to continue?</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Your site is already in progress. We&apos;ve saved your latest changes
              automatically. Each account manages a single site to keep your
              brand consistent.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href={`/site-builder/${siteId}`}>
                  Continue editing
                  <ArrowUpRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
              {isPublished && (
                <Button variant="outline" size="lg" asChild>
                  <Link
                    href={`/preview?path=/&preview=true`}
                    target="_blank"
                  >
                    View published site
                    <EyeIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="lg" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2Icon className="mr-2 size-4" />
                    Reset Project
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangleIcon className="size-5 text-destructive" />
                      Reset Site Project?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your current draft and published site. 
                      You will be able to start over with a new template. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteSite}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Resetting..." : "Yes, reset project"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 border-t pt-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-3.5 text-emerald-500" />
                Status: {isPublished ? "Live" : "Draft"}
              </div>
              {lastUpdated && (
                <div className="flex items-center gap-1.5">
                  <MoveHorizontalIcon className="size-3.5" />
                  Last updated: {lastUpdated}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {resortTemplates.slice(0, 8).map((template) => {
              const homePageData = template.data["/"];
              const content = homePageData?.content || [];

              const heroBlock = content.find(
                (block) => block.type === "HeroBlock"
              );
              const carouselBlock = content.find(
                (block) => block.type === "HeroCarouselBlock"
              );
              
              const heroProps = heroBlock?.props;
              const carouselProps = carouselBlock?.props;

              return (
                <Link
                  key={template.slug}
                  href={`/site-builder/${siteId}?template=${template.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-xl border bg-background transition-all hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <div className="absolute inset-0 z-10 bg-transparent" />
                    <div className="origin-top-left scale-[0.25] overflow-hidden pointer-events-none" style={{ width: '400%', height: '400%' }}>
                      {heroProps ? (
                        <HeroBlock {...heroProps} />
                      ) : carouselProps ? (
                        <HeroCarouselBlock {...carouselProps} />
                      ) : (
                        <img
                          src={template.image}
                          alt={template.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    {template.label && (
                      <Badge
                        className="absolute top-3 right-3 z-20 rounded-sm shadow-sm"
                        variant="secondary"
                      >
                        {template.label}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      <div
                        className="size-2 rounded-full"
                        style={{ backgroundColor: template.accent }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {template.mood} · {template.location}
                    </p>
                    <div className="mt-auto pt-4">
                      <div className="flex items-center text-[11px] font-medium text-zinc-900 opacity-0 transition-opacity group-hover:opacity-100">
                        Use this template
                        <ArrowUpRightIcon className="ml-1 size-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
