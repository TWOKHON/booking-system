"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { completeTenantOnboardingAction, saveTenantOnboardingAction } from "../actions";
import {
  defaultOnboardingFormData,
  onboardingLocalDraftSchema,
  type OnboardingFormData,
} from "../_lib/schema";
import { ShellHeader, SideLayout } from "./wizard/shared";
import { CommunicationStep } from "./wizard/steps/CommunicationStep";
import { CompleteStep } from "./wizard/steps/CompleteStep";
import { PlanBillingStep } from "./wizard/steps/PlanBillingStep";
import { PropertyDetailsStep } from "./wizard/steps/PropertyDetailsStep";
import { TeamSetupStep } from "./wizard/steps/TeamSetupStep";
import { WelcomeStep } from "./wizard/steps/WelcomeStep";

const ONBOARDING_DRAFT_VERSION = 3;

function mergeOnboardingDraft(
  base: OnboardingFormData,
  draft: Partial<OnboardingFormData>,
): OnboardingFormData {
  return {
    ...base,
    ...draft,
    property: {
      ...base.property,
      ...draft.property,
    },
    planBilling: {
      ...base.planBilling,
      ...draft.planBilling,
    },
    teamSetup: {
      ...base.teamSetup,
      ...draft.teamSetup,
    },
    communication: {
      ...base.communication,
      ...draft.communication,
      channels: {
        ...base.communication.channels,
        ...draft.communication?.channels,
      },
      preferences: {
        ...base.communication.preferences,
        ...draft.communication?.preferences,
      },
    },
  };
}

function readLocalDraft(rawDraft: string, initialData: OnboardingFormData) {
  const parsedJson = JSON.parse(rawDraft) as {
    data?: Partial<OnboardingFormData>;
    currentStep?: unknown;
  };

  const mergedData = mergeOnboardingDraft(
    mergeOnboardingDraft(defaultOnboardingFormData, initialData),
    parsedJson.data ?? {},
  );
  const parsedDraft = onboardingLocalDraftSchema.safeParse({
    version: ONBOARDING_DRAFT_VERSION,
    data: mergedData,
    currentStep: parsedJson.currentStep,
  });

  return parsedDraft.success ? parsedDraft.data : null;
}

export function OnboardingWizard({
  initialData,
  initialStep,
  storageKey,
}: {
  initialData: OnboardingFormData;
  initialStep: number;
  storageKey: string;
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState(initialData);
  const [isSaving, startSaving] = useTransition();
  const [isCompleting, startCompleting] = useTransition();
  const hasLoadedDraftRef = useRef(false);

  useEffect(() => {
    try {
      const rawDraft = window.localStorage.getItem(storageKey);

      if (!rawDraft) {
        hasLoadedDraftRef.current = true;
        return;
      }

      const parsedDraft = readLocalDraft(rawDraft, initialData);

      if (!parsedDraft) {
        window.localStorage.removeItem(storageKey);
        hasLoadedDraftRef.current = true;
        return;
      }

      setFormData(parsedDraft.data);
      setCurrentStep(parsedDraft.currentStep);
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      hasLoadedDraftRef.current = true;
    }
  }, [initialData, storageKey]);

  useEffect(() => {
    if (!hasLoadedDraftRef.current) {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: ONBOARDING_DRAFT_VERSION,
        data: formData,
        currentStep,
      }),
    );
  }, [currentStep, formData, storageKey]);

  function goToStep(stepIndex: number) {
    setCurrentStep(stepIndex);
  }

  function saveAndMoveToStep(targetStep: number) {
    startSaving(async () => {
      const result = await saveTenantOnboardingAction({
        data: formData,
        currentStep: targetStep,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setCurrentStep(targetStep);
    });
  }

  function previousStep() {
    setCurrentStep((value) => Math.max(value - 1, 0));
  }

  function goToPropertyDetails() {
    setCurrentStep(1);
  }

  function updatePropertyField(
    field: keyof OnboardingFormData["property"],
    value: string,
  ) {
    setFormData((current) => ({
      ...current,
      property: {
        ...current.property,
        [field]: value,
      },
    }));
  }

  function updatePlanBillingField(
    field: keyof OnboardingFormData["planBilling"],
    value: string,
  ) {
    setFormData((current) => ({
      ...current,
      planBilling: {
        ...current.planBilling,
        [field]: value,
      },
    }));
  }

  function updateTeamMembers(members: OnboardingFormData["teamSetup"]["members"]) {
    setFormData((current) => ({
      ...current,
      teamSetup: {
        ...current.teamSetup,
        members,
      },
    }));
  }

  function updateChannel(
    key: keyof OnboardingFormData["communication"]["channels"],
    enabled: boolean,
  ) {
    setFormData((current) => ({
      ...current,
      communication: {
        ...current.communication,
        channels: {
          ...current.communication.channels,
          [key]: enabled,
        },
      },
    }));
  }

  function updatePreference(
    key: keyof OnboardingFormData["communication"]["preferences"],
    value: Partial<OnboardingFormData["communication"]["preferences"][typeof key]>,
  ) {
    setFormData((current) => ({
      ...current,
      communication: {
        ...current.communication,
        preferences: {
          ...current.communication.preferences,
          [key]: {
            ...current.communication.preferences[key],
            ...value,
          },
        },
      },
    }));
  }

  function completeOnboarding() {
    startCompleting(async () => {
      try {
        await completeTenantOnboardingAction({
          data: formData,
        });
        window.localStorage.removeItem(storageKey);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "We couldn't complete your onboarding right now.",
        );
      }
    });
  }

  return (
    <main className="min-h-screen">
      <div>
        <ShellHeader />
        <SideLayout currentStep={currentStep}>
          {currentStep === 0 ? (
            <WelcomeStep onNext={goToPropertyDetails} isSaving={isSaving} />
          ) : null}
          {currentStep === 1 ? (
            <PropertyDetailsStep
              data={formData.property}
              onBack={previousStep}
              onNext={() => saveAndMoveToStep(2)}
              onChange={updatePropertyField}
              isSaving={isSaving}
            />
          ) : null}
          {currentStep === 2 ? (
            <TeamSetupStep
              members={formData.teamSetup.members}
              onMembersChange={updateTeamMembers}
              onBack={previousStep}
              onNext={() => saveAndMoveToStep(3)}
              isSaving={isSaving}
            />
          ) : null}
          {currentStep === 3 ? (
            <PlanBillingStep
              data={formData.planBilling}
              onBack={previousStep}
              onNext={() => saveAndMoveToStep(4)}
              onChange={updatePlanBillingField}
              isSaving={isSaving}
            />
          ) : null}
          {currentStep === 4 ? (
            <CommunicationStep
              data={formData.communication}
              onChannelChange={updateChannel}
              onPreferenceChange={updatePreference}
              onBack={previousStep}
              onNext={() => saveAndMoveToStep(5)}
              isSaving={isSaving}
            />
          ) : null}
          {currentStep === 5 ? (
            <CompleteStep
              data={formData}
              onEditStep={goToStep}
              onComplete={completeOnboarding}
              isCompleting={isCompleting}
            />
          ) : null}
        </SideLayout>
      </div>
    </main>
  );
}
