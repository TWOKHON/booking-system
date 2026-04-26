"use client";
"use no memo";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grip, HelpCircle, OctagonAlertIcon, Plus, Trash2 } from "lucide-react";
import { Hint } from "@/components/custom/Hint";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type PlanForm = {
  id: string;
  title: string;
  key: string;
  description: string;
  monthlyBaseFee: string;
  hasAnnualBaseFee: boolean;
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
  hasAnnualBaseFee: false,
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
    hasAnnualBaseFee: true,
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
    hasAnnualBaseFee: true,
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

type SortableFeatureRowProps = {
  featureId: string;
  feature: string;
  index: number;
  onFeatureChange: (value: string) => void;
  onRemove: () => void;
};

const SortableFeatureRow = ({
  featureId,
  feature,
  index,
  onFeatureChange,
  onRemove,
}: SortableFeatureRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: featureId });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "flex gap-2",
        isDragging && "z-10 rounded-xl bg-background/95 shadow-lg",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <Grip className="size-4" />
      </Button>
      <Input
        value={feature}
        onChange={(event) => onFeatureChange(event.target.value)}
        placeholder={`Feature ${index + 1}`}
      />
      <Button
        type="button"
        variant="destructive"
        size="icon-sm"
        onClick={onRemove}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
};

export const PlansBuilder = () => {
  const [plans, setPlans] = React.useState<PlanForm[]>(initialPlans);
  const [selectedPlanId, setSelectedPlanId] = React.useState(
    initialPlans[0].id,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const selectedPlan =
    plans.find((plan) => plan.id === selectedPlanId) ?? plans[0] ?? null;
  const selectedMonthlyBaseFee = Number(selectedPlan?.monthlyBaseFee ?? "");
  const selectedAnnualBaseFee = Number(selectedPlan?.annualBaseFee ?? "");
  const selectedAnnualYearlyTotal =
    selectedAnnualBaseFee > 0 ? selectedAnnualBaseFee * 12 : null;
  const hasInvalidAnnualMonthlyEquivalent =
    !!selectedPlan?.hasAnnualBaseFee &&
    selectedMonthlyBaseFee > 0 &&
    selectedAnnualBaseFee > selectedMonthlyBaseFee;

  const updatePlan = React.useCallback(
    (planId: string, updater: (plan: PlanForm) => PlanForm) => {
      setPlans((current) =>
        current.map((plan) => (plan.id === planId ? updater(plan) : plan)),
      );
    },
    [],
  );

  const handleTitleChange = React.useCallback(
    (planId: string, title: string) => {
      updatePlan(planId, (plan) => ({
        ...plan,
        title,
        key: createSlug(title),
      }));
    },
    [updatePlan],
  );

  const handleFieldChange = React.useCallback(
    <K extends keyof PlanForm>(
      planId: string,
      field: K,
      value: PlanForm[K],
    ) => {
      updatePlan(planId, (plan) => ({ ...plan, [field]: value }));
    },
    [updatePlan],
  );

  const handleFeatureChange = React.useCallback(
    (planId: string, featureIndex: number, value: string) => {
      updatePlan(planId, (plan) => ({
        ...plan,
        features: plan.features.map((feature, index) =>
          index === featureIndex ? value : feature,
        ),
      }));
    },
    [updatePlan],
  );

  const addFeature = React.useCallback(
    (planId: string) => {
      updatePlan(planId, (plan) => ({
        ...plan,
        features: [...plan.features, ""],
      }));
    },
    [updatePlan],
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
    [updatePlan],
  );

  const reorderFeatures = React.useCallback(
    (planId: string, activeIndex: number, overIndex: number) => {
      if (activeIndex === overIndex) return;

      updatePlan(planId, (plan) => ({
        ...plan,
        features: arrayMove(plan.features, activeIndex, overIndex),
      }));
    },
    [updatePlan],
  );

  const handleFeatureDragEnd = React.useCallback(
    (planId: string, event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const activeIndex = Number(String(active.id).split("-").at(-1));
      const overIndex = Number(String(over.id).split("-").at(-1));

      if (Number.isNaN(activeIndex) || Number.isNaN(overIndex)) return;

      reorderFeatures(planId, activeIndex, overIndex);
    },
    [reorderFeatures],
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
    [plans, selectedPlanId],
  );

  if (!selectedPlan) return null;

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Card className="h-fit border bg-white shadow-sm dark:bg-neutral-900 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Subscription Plans</CardTitle>
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
                        <p className="font-medium">
                          {plan.title || "Untitled plan"}
                        </p>
                        {plan.isRecommended ? (
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-700"
                          >
                            Recommended
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {plan.key || "no-key"}
                      </p>
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

        <div className="space-y-5 lg:col-span-3">
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
                  <Label htmlFor="plan-key">
                    Key{" "}
                    <Hint
                      triggerChildren={<HelpCircle className="size-3" />}
                      contentChildren={
                        <p>Use this in your workspace as a unique ID</p>
                      }
                    ></Hint>
                  </Label>
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
                      event.target.value,
                    )
                  }
                  placeholder="Describe the target customer, operational value, and overall fit of this plan."
                  className="min-h-32 resize-none"
                />
              </div>

              <div className="flex items-start gap-2">
                <Switch
                  checked={selectedPlan.hasFreeTrial}
                  onCheckedChange={(checked) => {
                    handleFieldChange(selectedPlan.id, "hasFreeTrial", checked);
                    if (!checked) {
                      handleFieldChange(selectedPlan.id, "freeTrialDays", "");
                    }
                  }}
                  className="mt-1"
                />

                <div>
                  <h2 className="font-medium">Free trial</h2>
                  <p className="mb-1.5 text-xs text-muted-foreground">
                    Enable a trial period before recurring billing begins for
                    this plan.
                  </p>
                  <div className="relative">
                    <Input
                      id="trial-days"
                      min="1"
                      disabled={!selectedPlan.hasFreeTrial}
                      value={selectedPlan.freeTrialDays}
                      onChange={(event) =>
                        handleFieldChange(
                          selectedPlan.id,
                          "freeTrialDays",
                          event.target.value,
                        )
                      }
                      placeholder="0"
                    />
                    <span className="absolute inset-y-0 right-3 mt-2 rounded-l-none text-xs text-muted-foreground hover:bg-transparent focus-visible:ring-ring/50">
                      days
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Switch
                  checked={selectedPlan.isActive}
                  onCheckedChange={(checked) =>
                    handleFieldChange(selectedPlan.id, "isActive", checked)
                  }
                  className="mt-1"
                />

                <div>
                  <h2 className="font-medium">Publicly available</h2>
                  <p className="mb-1.5 text-xs text-muted-foreground">
                    Control whether this plan is available for tenant
                    subscription and upgrades.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Switch
                  checked={selectedPlan.isRecommended}
                  onCheckedChange={(checked) =>
                    handleFieldChange(selectedPlan.id, "isRecommended", checked)
                  }
                  className="mt-1"
                />

                <div>
                  <h2 className="font-medium">Recommended plan</h2>
                  <p className="mb-1.5 text-xs text-muted-foreground">
                    Highlight this plan as the preferred option in the
                    subscription showcase.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-white shadow-sm dark:bg-neutral-900">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>Pricing Details</CardTitle>
                  <CardDescription>
                    Manage pricing and limits for this plan.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-2">
                <Switch checked={true} disabled className="mt-1" />

                <div>
                  <h2 className="font-medium">Monthly base fee</h2>
                  <p className="mb-1.5 text-xs text-muted-foreground">
                    A fixed amount charged every month when subscribed on a
                    monthly basis
                  </p>
                  <div className="relative">
                    <Input
                      id="monthly-fee"
                      type="number"
                      min="0"
                      value={selectedPlan.monthlyBaseFee}
                      onChange={(event) =>
                        handleFieldChange(
                          selectedPlan.id,
                          "monthlyBaseFee",
                          event.target.value,
                        )
                      }
                      placeholder="0.00"
                      className="pl-7"
                    />
                    <span className="absolute inset-y-0 left-3 mt-1.5 rounded-l-none text-sm text-muted-foreground hover:bg-transparent focus-visible:ring-ring/50">
                      ₱
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <OctagonAlertIcon className="size-3" />
                    Customers will be charged in PHP PESO.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Switch
                  checked={selectedPlan.hasAnnualBaseFee}
                  onCheckedChange={(checked) =>
                    handleFieldChange(
                      selectedPlan.id,
                      "hasAnnualBaseFee",
                      checked,
                    )
                  }
                  className="mt-1"
                />

                <div>
                  <h2 className="font-medium">Annual base fee</h2>
                  <p className="mb-1.5 text-xs text-muted-foreground">
                    A fixed amount charged every year when subscribed on an
                    annual basis
                  </p>

                  {selectedPlan.hasAnnualBaseFee && (
                    <>
                      <div className="relative">
                        <Input
                          id="annual-fee"
                          type="number"
                          min="0"
                          value={selectedPlan.annualBaseFee}
                          onChange={(event) =>
                            handleFieldChange(
                              selectedPlan.id,
                              "annualBaseFee",
                              event.target.value,
                            )
                          }
                          placeholder="0.00"
                          className={cn(
                            "pl-7",
                            hasInvalidAnnualMonthlyEquivalent &&
                              "border-destructive focus-visible:ring-destructive/30",
                          )}
                        />
                        <span className="absolute inset-y-0 left-3 mt-1.5 rounded-l-none text-sm text-muted-foreground hover:bg-transparent focus-visible:ring-ring/50">
                          ₱
                        </span>
                      </div>
                      <div
                        className={cn(
                          "mt-1.5 flex items-center gap-1 text-xs text-muted-foreground",
                          hasInvalidAnnualMonthlyEquivalent &&
                            "text-destructive",
                        )}
                      >
                        <OctagonAlertIcon className="size-3 shrink-0" />
                        {selectedAnnualBaseFee > 0 &&
                        selectedAnnualYearlyTotal !== null
                          ? `${formatCurrency(selectedPlan.annualBaseFee)} per month x 12 = ${formatCurrency(selectedAnnualYearlyTotal.toFixed(2))} per year.`
                          : "Enter the monthly equivalent for annual billing and the yearly charge will be computed automatically."}
                      </div>
                      {hasInvalidAnnualMonthlyEquivalent ? (
                        <p className="mt-1 text-xs text-destructive">
                          The annual monthly base fee must be equal to or less
                          than the monthly base fee.
                        </p>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-white shadow-sm dark:bg-neutral-900">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>Inclusions and features</CardTitle>
                  <CardDescription>
                    Add the capabilities that tenants will receive under this
                    plan.
                  </CardDescription>
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
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) =>
                  handleFeatureDragEnd(selectedPlan.id, event)
                }
              >
                <SortableContext
                  items={selectedPlan.features.map(
                    (_, index) => `${selectedPlan.id}-feature-${index}`,
                  )}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {selectedPlan.features.map((feature, index) => (
                      <SortableFeatureRow
                        key={`${selectedPlan.id}-feature-${index}`}
                        featureId={`${selectedPlan.id}-feature-${index}`}
                        feature={feature}
                        index={index}
                        onFeatureChange={(value) =>
                          handleFeatureChange(selectedPlan.id, index, value)
                        }
                        onRemove={() => removeFeature(selectedPlan.id, index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="sticky bottom-0 isolate bg-background py-4 after:pointer-events-none after:absolute after:bottom-full after:-z-10 after:h-10 after:w-full after:bg-linear-to-t after:from-background after:to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Plan Notes</CardTitle>
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              {plans.length} plan{plans.length > 1 ? "s" : ""} in draft
            </Badge>
          </div>
          <CardDescription>
            Use this workspace to shape pricing tiers before wiring them to
            billing or tenant onboarding flows.
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
        </CardContent>
      </Card>
    </div>
  );
};
