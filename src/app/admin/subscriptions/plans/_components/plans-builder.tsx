"use client";
"use no memo";

import * as React from "react";
import {
  BadgeCheck,
  CircleDollarSign,
  Crown,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type PlanForm = {
  id: string;
  title: string;
  key: string;
  description: string;
  monthlyBaseFee: string;
  annualBaseFee: string;
  features: string[];
  isRecommended: boolean;
  hasFreeTrial: boolean;
  freeTrialDays: string;
  isActive: boolean;
};

const createSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

const createEmptyPlan = (title = "New Plan"): PlanForm => ({
  id: `plan-${Math.random().toString(36).slice(2, 9)}`,
  title,
  key: createSlug(title),
  description: "",
  monthlyBaseFee: "",
  annualBaseFee: "",
  features: [""],
  isRecommended: false,
  hasFreeTrial: false,
  freeTrialDays: "",
  isActive: true,
});

const initialPlans: PlanForm[] = [
  {
    id: "plan-starter",
    title: "Starter",
    key: "starter",
    description:
      "For single-property resort teams that need a reliable reservations, room inventory, and guest operations workspace to start selling and managing daily stays.",
    monthlyBaseFee: "2499",
    annualBaseFee: "24990",
    features: [
      "1 resort workspace",
      "Reservations and front desk tools",
      "Basic room inventory management",
      "Email support",
    ],
    isRecommended: false,
    hasFreeTrial: true,
    freeTrialDays: "7",
    isActive: true,
  },
  {
    id: "plan-growth",
    title: "Growth",
    key: "growth",
    description:
      "For expanding resort operators that need stronger operational coverage, analytics visibility, and more staff access across multiple departments.",
    monthlyBaseFee: "5999",
    annualBaseFee: "59990",
    features: [
      "Up to 3 resort workspaces",
      "Operations, housekeeping, and maintenance boards",
      "Analytics and reporting access",
      "Priority support",
    ],
    isRecommended: true,
    hasFreeTrial: true,
    freeTrialDays: "14",
    isActive: true,
  },
];

const formatCurrency = (value: string) => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue) || !value) return "Not set";

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

export const PlansBuilder = () => {
  const [plans, setPlans] = React.useState<PlanForm[]>(initialPlans);
  const [selectedPlanId, setSelectedPlanId] = React.useState(initialPlans[0].id);

  const selectedPlan =
    plans.find((plan) => plan.id === selectedPlanId) ?? plans[0] ?? null;

  const updatePlan = React.useCallback(
    (planId: string, updater: (plan: PlanForm) => PlanForm) => {
      setPlans((current) =>
        current.map((plan) => (plan.id === planId ? updater(plan) : plan))
      );
    },
    []
  );

  const handleTitleChange = React.useCallback(
    (planId: string, title: string) => {
      updatePlan(planId, (plan) => ({
        ...plan,
        title,
        key: createSlug(title),
      }));
    },
    [updatePlan]
  );

  const handleFieldChange = React.useCallback(
    <K extends keyof PlanForm>(planId: string, field: K, value: PlanForm[K]) => {
      updatePlan(planId, (plan) => ({ ...plan, [field]: value }));
    },
    [updatePlan]
  );

  const handleFeatureChange = React.useCallback(
    (planId: string, featureIndex: number, value: string) => {
      updatePlan(planId, (plan) => ({
        ...plan,
        features: plan.features.map((feature, index) =>
          index === featureIndex ? value : feature
        ),
      }));
    },
    [updatePlan]
  );

  const addFeature = React.useCallback(
    (planId: string) => {
      updatePlan(planId, (plan) => ({
        ...plan,
        features: [...plan.features, ""],
      }));
    },
    [updatePlan]
  );

  const removeFeature = React.useCallback(
    (planId: string, featureIndex: number) => {
      updatePlan(planId, (plan) => ({
        ...plan,
        features:
          plan.features.length === 1
            ? [""]
            : plan.features.filter((_, index) => index !== featureIndex),
      }));
    },
    [updatePlan]
  );

  const addPlan = React.useCallback(() => {
    const newPlan = createEmptyPlan(`Plan ${plans.length + 1}`);
    setPlans((current) => [...current, newPlan]);
    setSelectedPlanId(newPlan.id);
  }, [plans.length]);

  const removePlan = React.useCallback(
    (planId: string) => {
      if (plans.length === 1) return;

      const nextPlans = plans.filter((plan) => plan.id !== planId);
      setPlans(nextPlans);

      if (selectedPlanId === planId) {
        setSelectedPlanId(nextPlans[0].id);
      }
    },
    [plans, selectedPlanId]
  );

  if (!selectedPlan) return null;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
      <Card className="border bg-white shadow-sm dark:bg-neutral-900">
        <CardHeader className="pb-3">
          <CardTitle>Plans Array</CardTitle>
          <CardDescription>
            Create and manage multiple SaaS plans for tenant subscriptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={addPlan} className="w-full">
            <Plus className="size-4" />
            Add plan
          </Button>

          <div className="space-y-3">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlanId(plan.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedPlanId === plan.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:bg-muted/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{plan.title || "Untitled plan"}</p>
                      {plan.isRecommended ? (
                        <Badge variant="outline" className="bg-amber-100 text-amber-700">
                          Recommended
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">{plan.key || "no-key"}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(plan.monthlyBaseFee)} monthly
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={
                      plan.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border bg-white shadow-sm dark:bg-neutral-900">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Manage plan details for the selected subscription offer.
                </CardDescription>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removePlan(selectedPlan.id)}
                disabled={plans.length === 1}
              >
                <Trash2 className="size-4" />
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plan-title">Title</Label>
                <Input
                  id="plan-title"
                  value={selectedPlan.title}
                  onChange={(event) =>
                    handleTitleChange(selectedPlan.id, event.target.value)
                  }
                  placeholder="Enter plan title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan-key">Key</Label>
                <Input
                  id="plan-key"
                  value={selectedPlan.key}
                  readOnly
                  className="bg-muted/50"
                  placeholder="Auto-generated key"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="plan-description">Description</Label>
                <span className="text-xs text-muted-foreground">
                  {selectedPlan.description.length}/500
                </span>
              </div>
              <Textarea
                id="plan-description"
                value={selectedPlan.description}
                maxLength={500}
                onChange={(event) =>
                  handleFieldChange(
                    selectedPlan.id,
                    "description",
                    event.target.value
                  )
                }
                placeholder="Describe the target customer, operational value, and overall fit of this plan."
                className="min-h-32 resize-none"
              />
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="monthly-fee">Monthly Base Fee</Label>
                <Input
                  id="monthly-fee"
                  type="number"
                  min="0"
                  value={selectedPlan.monthlyBaseFee}
                  onChange={(event) =>
                    handleFieldChange(
                      selectedPlan.id,
                      "monthlyBaseFee",
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual-fee">Annual Base Fee</Label>
                <Input
                  id="annual-fee"
                  type="number"
                  min="0"
                  value={selectedPlan.annualBaseFee}
                  onChange={(event) =>
                    handleFieldChange(
                      selectedPlan.id,
                      "annualBaseFee",
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Inclusions and Features</p>
                  <p className="text-sm text-muted-foreground">
                    Add the capabilities that tenants will receive under this plan.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFeature(selectedPlan.id)}
                >
                  <Plus className="size-4" />
                  Add feature
                </Button>
              </div>

              <div className="space-y-3">
                {selectedPlan.features.map((feature, index) => (
                  <div key={`${selectedPlan.id}-feature-${index}`} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(event) =>
                        handleFeatureChange(selectedPlan.id, index, event.target.value)
                      }
                      placeholder={`Feature ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => removeFeature(selectedPlan.id, index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
              <ToggleBlock
                title="Recommended Plan"
                description="Highlight this plan as the preferred option in the subscription showcase."
                checked={selectedPlan.isRecommended}
                onCheckedChange={(checked) =>
                  handleFieldChange(selectedPlan.id, "isRecommended", checked)
                }
              />

              <ToggleBlock
                title="Active Plan"
                description="Control whether this plan is available for tenant subscription and upgrades."
                checked={selectedPlan.isActive}
                onCheckedChange={(checked) =>
                  handleFieldChange(selectedPlan.id, "isActive", checked)
                }
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <ToggleBlock
                title="Free Trial"
                description="Enable a trial period before recurring billing begins for this plan."
                checked={selectedPlan.hasFreeTrial}
                onCheckedChange={(checked) => {
                  handleFieldChange(selectedPlan.id, "hasFreeTrial", checked);
                  if (!checked) {
                    handleFieldChange(selectedPlan.id, "freeTrialDays", "");
                  }
                }}
              />

              <div className="max-w-xs space-y-2">
                <Label htmlFor="trial-days">Trial Days</Label>
                <Input
                  id="trial-days"
                  type="number"
                  min="1"
                  disabled={!selectedPlan.hasFreeTrial}
                  value={selectedPlan.freeTrialDays}
                  onChange={(event) =>
                    handleFieldChange(
                      selectedPlan.id,
                      "freeTrialDays",
                      event.target.value
                    )
                  }
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-white shadow-sm dark:bg-neutral-900">
          <CardHeader>
            <CardTitle>Plan Notes</CardTitle>
            <CardDescription>
              Use this workspace to shape pricing tiers before wiring them to billing or tenant onboarding flows.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button type="button">Save Plan Set</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPlans(initialPlans);
                setSelectedPlanId(initialPlans[0].id);
              }}
            >
              Reset Draft
            </Button>
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              {plans.length} plan{plans.length > 1 ? "s" : ""} in draft
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="border bg-white shadow-sm dark:bg-neutral-900 xl:sticky xl:top-6 xl:self-start">
        <CardHeader>
          <CardTitle>Plans Preview</CardTitle>
          <CardDescription>
            Live preview of how your SaaS subscription offers are shaping up.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-[840px] pr-3">
            <div className="space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-3xl border p-5 ${
                    plan.id === selectedPlanId
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold">
                          {plan.title || "Untitled plan"}
                        </p>
                        {plan.isRecommended ? (
                          <Badge className="bg-amber-100 text-amber-700" variant="outline">
                            <Crown className="mr-1 size-3.5" />
                            Recommended
                          </Badge>
                        ) : null}
                        {plan.hasFreeTrial ? (
                          <Badge className="bg-blue-100 text-blue-700" variant="outline">
                            <Sparkles className="mr-1 size-3.5" />
                            {plan.freeTrialDays || "0"} day trial
                          </Badge>
                        ) : null}
                      </div>

                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        {plan.key || "no-key"}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className={
                        plan.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-700"
                      }
                    >
                      {plan.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="mt-4 grid gap-3 rounded-2xl bg-muted/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Monthly</p>
                        <p className="text-xl font-semibold">
                          {formatCurrency(plan.monthlyBaseFee)}
                        </p>
                      </div>
                      <CircleDollarSign className="size-5 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Annual</p>
                      <p className="text-base font-medium">
                        {formatCurrency(plan.annualBaseFee)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground">
                    {plan.description || "No description added yet."}
                  </p>

                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Included Features</p>
                    <div className="space-y-2">
                      {plan.features.filter(Boolean).length > 0 ? (
                        plan.features
                          .filter((feature) => feature.trim().length > 0)
                          .map((feature, index) => (
                            <div key={`${plan.id}-preview-feature-${index}`} className="flex gap-2">
                              <BadgeCheck className="mt-0.5 size-4 text-emerald-600" />
                              <p className="text-sm">{feature}</p>
                            </div>
                          ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No features added yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

type ToggleBlockProps = {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const ToggleBlock = ({
  title,
  description,
  checked,
  onCheckedChange,
}: ToggleBlockProps) => {
  return (
    <div className="rounded-2xl border bg-muted/20 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    </div>
  );
};
