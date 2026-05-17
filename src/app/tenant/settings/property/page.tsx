import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowUpRightIcon,
  HotelIcon,
  SparklesIcon,
} from "lucide-react";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import {
  PropertySettingsTable,
  type PropertySettingRecord,
} from "./_components/PropertySettingsTable";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function toStatus(value: string | null | undefined, optional = false) {
  if (value && value.trim().length > 0) {
    return "Complete" as const;
  }

  return optional ? ("Optional" as const) : ("Review" as const);
}

function toReadablePlan(
  plan: "FREE_TRIAL" | "STARTER" | "GROWTH" | "ENTERPRISE",
) {
  return plan
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function toReadableBilling(cycle: "MONTHLY" | "YEARLY") {
  return cycle === "YEARLY" ? "Yearly" : "Monthly";
}

function toReadableOnboarding(status: "PENDING" | "IN_PROGRESS" | "COMPLETED") {
  if (status === "IN_PROGRESS") return "In Progress";
  if (status === "COMPLETED") return "Completed";
  return "Pending";
}

function toReadablePaymentMethod(
  method: "CREDIT_CARD" | "BANK_TRANSFER" | "E_WALLET" | "CASH_DEPOSIT" | null,
) {
  if (!method) return "Not set";
  return method
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const appUser = await db.appUser.findUnique({
    where: {
      authUserId: session.user.id,
    },
    include: {
      tenantProfile: true,
    },
  });

  if (!appUser?.tenantProfile) {
    redirect("/tenant/dashboard");
  }

  const tenantProfile = appUser.tenantProfile;
  const ownerName =
    appUser.displayName || `${appUser.firstName} ${appUser.lastName}`.trim();
  const resortName =
    tenantProfile.resortName?.trim() ||
    tenantProfile.businessName?.trim() ||
    "your resort";
  const locationLine = [tenantProfile.municipality, tenantProfile.province]
    .filter(Boolean)
    .join(", ");
  const tableData: PropertySettingRecord[] = [
    {
      id: "resort-name",
      label: "Resort name",
      value: tenantProfile.resortName || "Not set",
      category: "Identity",
      status: toStatus(tenantProfile.resortName),
      notes: "The primary guest-facing property name across ResortCloud.",
    },
    {
      id: "property-type",
      label: "Property type",
      value: tenantProfile.propertyType || "Not set",
      category: "Identity",
      status: toStatus(tenantProfile.propertyType),
      notes:
        "Used to position the resort and keep the workspace categorized clearly.",
    },
    {
      id: "phone-number",
      label: "Property phone",
      value: tenantProfile.phoneNumber || "Not set",
      category: "Identity",
      status: toStatus(tenantProfile.phoneNumber),
      notes: "Front-desk or main property contact number.",
    },
    {
      id: "website",
      label: "Website URL",
      value: tenantProfile.website || "Not set",
      category: "Identity",
      status: toStatus(tenantProfile.website, true),
      notes: "Useful for direct booking and brand discovery.",
    },
    {
      id: "short-description",
      label: "Short description",
      value: tenantProfile.shortDescription || "Not set",
      category: "Identity",
      status: toStatus(tenantProfile.shortDescription, true),
      notes: "A quick pitch shown across property-facing experiences.",
    },
    {
      id: "full-address",
      label: "Full address",
      value: tenantProfile.fullAddress || "Not set",
      category: "Location",
      status: toStatus(tenantProfile.fullAddress),
      notes: "Street-level property address from onboarding.",
    },
    {
      id: "region",
      label: "Region",
      value: tenantProfile.region || "Not set",
      category: "Location",
      status: toStatus(tenantProfile.region),
      notes: "Top-level geographic grouping for the property.",
    },
    {
      id: "province",
      label: "Province",
      value: tenantProfile.province || "Not set",
      category: "Location",
      status: toStatus(tenantProfile.province),
      notes: "Used with municipality and barangay for PH property records.",
    },
    {
      id: "municipality",
      label: "Municipality / City",
      value: tenantProfile.municipality || "Not set",
      category: "Location",
      status: toStatus(tenantProfile.municipality),
      notes: "The city or municipality where the property operates.",
    },
    {
      id: "barangay",
      label: "Barangay",
      value: tenantProfile.barangay || "Not set",
      category: "Location",
      status: toStatus(tenantProfile.barangay),
      notes:
        "Smallest PH local address segment currently tracked in onboarding.",
    },
    {
      id: "subscription-plan",
      label: "Subscription plan",
      value: toReadablePlan(tenantProfile.subscriptionPlan),
      category: "Commercial",
      status: "Complete",
      notes: "Current ResortCloud plan tied to this tenant workspace.",
    },
    {
      id: "billing-cycle",
      label: "Billing cycle",
      value: toReadableBilling(tenantProfile.billingCycle),
      category: "Commercial",
      status: "Complete",
      notes: "Current billing cadence attached to the plan.",
    },
    {
      id: "payment-method",
      label: "Billing payment method",
      value: toReadablePaymentMethod(tenantProfile.paymentMethod),
      category: "Commercial",
      status: tenantProfile.paymentMethod ? "Complete" : "Review",
      notes: "Saved tenant billing rail for the ResortCloud subscription.",
    },
    {
      id: "billing-email",
      label: "Billing email",
      value: tenantProfile.billingEmail || "Not set",
      category: "Commercial",
      status: toStatus(tenantProfile.billingEmail),
      notes: "The address used for invoices and billing-related notices.",
    },
    {
      id: "billing-country",
      label: "Billing country",
      value: tenantProfile.billingCountry || "Philippines",
      category: "Commercial",
      status: "Complete",
      notes: "Current billing country configured during onboarding.",
    },
    {
      id: "onboarding-status",
      label: "Onboarding status",
      value: toReadableOnboarding(tenantProfile.onboardingStatus),
      category: "Operations",
      status:
        tenantProfile.onboardingStatus === "COMPLETED" ? "Complete" : "Review",
      notes: "Useful for checking whether property setup is fully finalized.",
    },
    {
      id: "updated-at",
      label: "Last property update",
      value: new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Manila",
      }).format(tenantProfile.updatedAt),
      category: "Operations",
      status: "Complete",
      notes: "Latest tenant profile update saved in the workspace.",
    },
  ];

  const completionCount = tableData.filter(
    (item) => item.status === "Complete",
  ).length;
  const reviewCount = tableData.filter(
    (item) => item.status === "Review",
  ).length;
  const insightMessage = `${resortName} is currently mapped with ${completionCount} completed property fields${locationLine ? ` in ${locationLine}` : ""}. Focus next on the ${reviewCount} field${reviewCount === 1 ? "" : "s"} still marked for review.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <HotelIcon className="size-3.5" />
                Property settings
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <SparklesIcon className="size-3.5" />
                Owner control center
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Review your core property identity, location, billing readiness,
              and setup quality in one place before you move deeper into rooms,
              channel distribution, and service catalog management.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/tenant/settings/rooms">
                Manage rooms
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/settings/channels">
                Configure channels
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
              Location
            </div>
            <div className="mt-3 text-xl font-semibold">
              {tenantProfile.municipality || "Not set"}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {tenantProfile.province || "Complete address setup"}
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Setup completion
            </div>
            <div className="mt-3 text-xl font-semibold">
              {completionCount}/{tableData.length}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {reviewCount} field{reviewCount === 1 ? "" : "s"} still need
              review
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Plan state
            </div>
            <div className="mt-3 text-xl font-semibold">
              {toReadablePlan(tenantProfile.subscriptionPlan)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {toReadableBilling(tenantProfile.billingCycle)} billing cadence
            </div>
          </div>
        </div>
      </section>

      <section className="grid w-full gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <PropertySettingsTable data={tableData} />

        <div className="space-y-6 xl:w-[320px]">
          <Card className="w-full rounded-2xl border py-0 shadow-sm">
            <CardContent className="p-5">
              <div>
                <h2 className="text-lg font-semibold">Setup sequence</h2>
                <p className="text-sm text-muted-foreground">
                  Recommended order for completing the rest of the property
                  workspace.
                </p>
              </div>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm font-medium">
                    1. Finalize property identity
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Confirm resort details, address, and public-facing copy stay
                    accurate.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">2. Build room inventory</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add room types and sellable units before mapping channels.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    3. Connect channels and services
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Align inventory exposure and guest add-ons with how the
                    resort sells.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full rounded-2xl border py-0 shadow-sm">
            <CardContent className="p-5">
              <div>
                <h2 className="text-lg font-semibold">Connected areas</h2>
                <p className="text-sm text-muted-foreground">
                  Continue to the modules that complete guest-facing property
                  setup.
                </p>
              </div>
              <Separator className="my-5" />
              <div className="space-y-3">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                >
                  <Link href="/tenant/settings/rooms">
                    Rooms & Inventory
                    <ArrowUpRightIcon className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                >
                  <Link href="/tenant/settings/channels">
                    Channel Setup
                    <ArrowUpRightIcon className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                >
                  <Link href="/tenant/settings/services">
                    Services Offered
                    <ArrowUpRightIcon className="size-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
