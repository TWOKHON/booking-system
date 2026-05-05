"use client";

import { FileUpload } from "@/components/animated-ui/FileUpload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ImageUp, PaintBucket, UploadCloud } from "lucide-react";
import type { BrandingThemeOption } from "./branding-data";

type BrandingWorkspaceProps = {
  themeOptions: BrandingThemeOption[];
};

export const BrandingWorkspace = ({
  themeOptions,
}: BrandingWorkspaceProps) => {
  return (
    <div className="space-y-5">
      <Card className="gap-0 overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1.5">
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>
                Define the shared visual kit used across the admin workspace,
                guest booking pages, and outbound touchpoints.
              </CardDescription>
            </div>

            <Badge
              variant="outline"
              className="rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              Master preset
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand name</Label>
              <Input
                id="brand-name"
                defaultValue="Alrio Resort System"
                placeholder="Enter platform brand name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-style">Brand style preset</Label>
              <Select defaultValue="signature">
                <SelectTrigger id="brand-style" className="w-full">
                  <SelectValue placeholder="Select a preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signature">Alrio Signature</SelectItem>
                  <SelectItem value="coastal">Coastal Escape</SelectItem>
                  <SelectItem value="minimal">Minimal Resort</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand-voice">Brand voice</Label>
            <Textarea
              id="brand-voice"
              className="min-h-28"
              defaultValue="Confident, warm, and hospitality-led. Messaging should feel polished enough for premium resort operators while staying simple for day-to-day admin workflows."
            />
          </div>

          <div className="rounded-2xl border bg-muted/20 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Color tokens</p>
                <p className="text-xs text-muted-foreground">
                  Keep the approved palette compact and easy to scan.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">4 core colors</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {themeOptions.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border bg-background p-3"
                >
                  <div
                    className="h-12 rounded-xl border"
                    style={{ backgroundColor: item.value }}
                  />
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <div className="rounded-2xl border bg-background px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Primary use
              </p>
              <p className="mt-2 text-sm font-medium">Operational admin shell</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Calm surfaces, direct actions, and hospitality-led polish.
              </p>
            </div>

            <div className="rounded-2xl border bg-background px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Accessibility
              </p>
              <p className="mt-2 text-sm font-medium">Contrast approved</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Current palette is ready for shared product and email use.
              </p>
            </div>

            <div className="rounded-2xl border bg-background px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Rollout mode
              </p>
              <p className="mt-2 text-sm font-medium">Master brand controls</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Tenant overrides remain limited to approved supporting accents.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap justify-between gap-3 border-t bg-background">
          <p className="text-xs text-muted-foreground">
            Last updated by Kyle Andre at 10:42 AM.
          </p>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Reset draft</Button>
            <Button>Save brand settings</Button>
          </div>
        </CardFooter>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="gap-0 overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1.5">
                <CardTitle>Asset Uploads</CardTitle>
                <CardDescription>
                  Upload approved brand files directly for shared use across
                  admin, booking, and communication surfaces.
                </CardDescription>
              </div>

              <Badge
                variant="outline"
                className="rounded-full border-border bg-muted/40 px-3 py-1"
              >
                PNG, SVG, JPG
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 pt-5">
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-3xl border bg-muted/10 p-4">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-background text-muted-foreground">
                    <UploadCloud className="size-4.5" />
                  </div>

                  <div>
                    <p className="font-medium">Primary logo</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Horizontal wordmark for the admin header and guest booking
                      masthead.
                    </p>
                  </div>
                </div>

                <FileUpload
                  title="Upload primary logo"
                  description="Use a clean SVG or transparent PNG for crisp display."
                />
              </div>

              <div className="rounded-3xl border bg-muted/10 p-4">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-background text-muted-foreground">
                    <PaintBucket className="size-4.5" />
                  </div>

                  <div>
                    <p className="font-medium">Monogram mark</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Compact lockup for favicon usage, mobile headers, and app
                      launcher tiles.
                    </p>
                  </div>
                </div>

                <FileUpload
                  title="Upload monogram mark"
                  description="Best for square exports and simplified icon treatments."
                />
              </div>
            </div>

            <div className="rounded-3xl border bg-muted/10 p-4">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-background text-muted-foreground">
                  <ImageUp className="size-4.5" />
                </div>

                <div>
                  <p className="font-medium">Campaign and social banner</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Wide artwork used for promo headers, announcement banners,
                    and outbound campaigns.
                  </p>
                </div>
              </div>

              <FileUpload
                title="Upload social banner"
                description="Use a wide high-resolution image for email and marketing placements."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 overflow-hidden">
          <CardHeader className="border-b">
            <div className="space-y-1.5">
              <CardTitle>Asset Guidelines</CardTitle>
              <CardDescription>
                Keep file handoff consistent so every surface renders cleanly.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-5">
            <div className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background text-emerald-700">
                  <CheckCircle2 className="size-4.5" />
                </div>
                <div>
                  <p className="font-medium">Recommended exports</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Prefer SVG for logos and transparent PNG for fallback app or
                    email surfaces.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/10 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Minimum sizes
              </p>
              <div className="mt-3 space-y-3">
                <div className="rounded-xl bg-background px-3 py-2">
                  <p className="text-sm font-medium">Logo</p>
                  <p className="text-sm text-muted-foreground">
                    1200px wide export for crisp header and email usage
                  </p>
                </div>

                <div className="rounded-xl bg-background px-3 py-2">
                  <p className="text-sm font-medium">Monogram</p>
                  <p className="text-sm text-muted-foreground">
                    512 x 512 square export for launcher and favicon family
                  </p>
                </div>

                <div className="rounded-xl bg-background px-3 py-2">
                  <p className="text-sm font-medium">Social banner</p>
                  <p className="text-sm text-muted-foreground">
                    1600 x 900 landscape export for campaign placements
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-[#f6f7f1] p-4">
              <p className="text-sm font-medium text-[#1E2A17]">
                Upload flow
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5f6758]">
                Assets are staged first, reviewed against the master palette,
                then released to booking pages and communication templates.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="gap-0 overflow-hidden">
        <CardHeader className="border-b">
          <div className="space-y-1.5">
            <CardTitle>Publishing Rules</CardTitle>
            <CardDescription>
              Configure where approved brand assets should be applied after
              upload.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-5">
          <div className="flex items-center justify-between gap-4 rounded-2xl border bg-muted/10 px-5 py-4">
            <div className="space-y-1">
              <p className="font-medium">Apply to guest booking pages</p>
              <p className="text-sm text-muted-foreground">
                Sync the palette, logo, and CTA styles to public reservation
                flows.
              </p>
            </div>
            <Switch defaultChecked aria-label="Apply to guest booking pages" />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl border bg-muted/10 px-5 py-4">
            <div className="space-y-1">
              <p className="font-medium">Apply to transactional emails</p>
              <p className="text-sm text-muted-foreground">
                Update receipt, confirmation, and reminder templates with the
                active visual kit.
              </p>
            </div>
            <Switch defaultChecked aria-label="Apply to transactional emails" />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl border bg-muted/10 px-5 py-4">
            <div className="space-y-1">
              <p className="font-medium">Allow tenant-level accent overrides</p>
              <p className="text-sm text-muted-foreground">
                Keep the core master brand while letting resorts swap a limited
                supporting accent for campaigns.
              </p>
            </div>
            <Switch aria-label="Allow tenant-level accent overrides" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
