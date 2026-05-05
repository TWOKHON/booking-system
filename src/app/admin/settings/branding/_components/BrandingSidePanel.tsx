import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  BrandingChannel,
  BrandingCheckpoint,
} from "./branding-data";
import { brandStory } from "./branding-data";

type BrandingSidePanelProps = {
  checkpoints: BrandingCheckpoint[];
  channels: BrandingChannel[];
};

const toneClasses: Record<BrandingCheckpoint["tone"], string> = {
  healthy:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  watch:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
};

export const BrandingSidePanel = ({
  checkpoints,
  channels,
}: BrandingSidePanelProps) => {
  return (
    <div className="space-y-5">
      <Card className="gap-0 overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>Rollout Checkpoints</CardTitle>
          <CardDescription>
            Monitor which touchpoints are ready before the next branding push.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-5">
          {checkpoints.map((item) => (
            <div key={item.title} className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="pr-2 font-medium leading-6">{item.title}</p>
                <Badge
                  className={`${toneClasses[item.tone]} rounded-full px-2 py-0 text-[11px]`}
                  variant="outline"
                >
                  {item.tone === "healthy" ? "Aligned" : "Needs follow-up"}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.detail}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b">
          <CardTitle>Publishing Channels</CardTitle>
          <CardDescription>
            Current release state for each brand-dependent platform surface.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-5">
          {channels.map((item) => (
            <div key={item.title} className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium leading-6">{item.title}</p>
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {item.status}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.note}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b">
          <CardTitle>Brand Notes</CardTitle>
          <CardDescription>
            Shared principles that keep platform branding steady as the product
            grows.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-5">
          {brandStory.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-2xl border bg-muted/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background text-muted-foreground">
                    <Icon className="size-4.5" />
                  </div>

                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
