"use client";
import { CircleHelp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { defaultChannels, notificationRows } from "../data";
import { ActionFooter, StepHeader } from "../shared";
import type { OnboardingFormData } from "@/app/auth/onboarding/_lib/schema";

export function CommunicationStep({
  data,
  onChannelChange,
  onPreferenceChange,
  onBack,
  onNext,
  isSaving = false,
}: {
  data: OnboardingFormData["communication"];
  onChannelChange: (
    key: keyof OnboardingFormData["communication"]["channels"],
    enabled: boolean,
  ) => void;
  onPreferenceChange: (
    key: keyof OnboardingFormData["communication"]["preferences"],
    value: Partial<OnboardingFormData["communication"]["preferences"][keyof OnboardingFormData["communication"]["preferences"]]>,
  ) => void;
  onBack: () => void;
  onNext: () => void;
  isSaving?: boolean;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <StepHeader
        title="Communication"
        description="Set up how you and your team will communicate."
        onBack={onBack}
      />

      <div className="mt-10 space-y-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Default Communication Channels
          </h2>
          <p className="mt-2 text-base text-zinc-500">
            Choose the channels you&apos;d like to enable.
          </p>
          <div className="mt-7 space-y-4">
            {defaultChannels.map((channel) => {
              const Icon = channel.icon;

              return (
                <Card
                  key={channel.key}
                  className="rounded-2xl border-zinc-200 py-0 shadow-none"
                >
                  <CardContent className="flex items-center justify-between gap-4 px-5 py-5">
                    <div className="flex items-start gap-5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium tracking-tight text-zinc-950">
                          {channel.title}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {channel.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={data.channels[channel.key]}
                      onCheckedChange={(checked) => onChannelChange(channel.key, checked)}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="border-t border-zinc-200 pt-10">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Notification Preferences
          </h2>
          <p className="mt-2 text-base text-zinc-500">
            Choose what you&apos;d like to be notified about.
          </p>

          <div className="mt-7 space-y-5">
            {notificationRows.map((row) => (
              <div
                key={row.key}
                className="grid items-center gap-4 rounded-2xl border border-transparent px-2 py-1 md:grid-cols-[minmax(0,1fr)_220px]"
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={data.preferences[row.key].enabled}
                    onCheckedChange={(checked) =>
                      onPreferenceChange(row.key, { enabled: Boolean(checked) })
                    }
                    className="mt-2"
                  />
                  <div>
                    <p className="font-medium tracking-tight text-zinc-950">
                      {row.title}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {row.description}
                    </p>
                  </div>
                </div>
                <Select
                  value={data.preferences[row.key].frequency}
                  onValueChange={(value) =>
                    onPreferenceChange(row.key, {
                      frequency:
                        value as OnboardingFormData["communication"]["preferences"][typeof row.key]["frequency"],
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily Summary</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
            <CircleHelp className="size-4" />
            You can update these preferences anytime from Settings.
          </div>
        </div>

        <ActionFooter
          onBack={onBack}
          onNext={onNext}
          hint="This will take less than 1 minute"
          disabled={isSaving}
        />
      </div>
    </div>
  );
}
