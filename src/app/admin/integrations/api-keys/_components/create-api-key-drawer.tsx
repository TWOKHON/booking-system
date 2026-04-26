"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ApiKeyRecord } from "./api-keys-data";

type ApiKeyDraft = {
  keyName: string;
  provider: string;
  keyType: ApiKeyRecord["keyType"];
  environment: ApiKeyRecord["environment"];
  accessScope: ApiKeyRecord["accessScope"];
  keyStatus: ApiKeyRecord["keyStatus"];
  maskedKey: string;
  rotationWindow: string;
  assignedTo: string;
  note: string;
};

const createEmptyDraft = (): ApiKeyDraft => ({
  keyName: "",
  provider: "",
  keyType: "Secret Key",
  environment: "Sandbox",
  accessScope: "Read",
  keyStatus: "Review",
  maskedKey: "",
  rotationWindow: "",
  assignedTo: "",
  note: "",
});

type CreateApiKeyDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (record: Omit<ApiKeyRecord, "id">) => void;
};

export const CreateApiKeyDrawer = ({
  open,
  onOpenChange,
  onCreate,
}: CreateApiKeyDrawerProps) => {
  const [draft, setDraft] = React.useState<ApiKeyDraft>(createEmptyDraft);

  const handleChange = <K extends keyof ApiKeyDraft>(field: K, value: ApiKeyDraft[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    if (!draft.keyName || !draft.provider || !draft.maskedKey || !draft.assignedTo) {
      return;
    }

    onCreate({
      keyName: draft.keyName,
      provider: draft.provider,
      keyType: draft.keyType,
      environment: draft.environment,
      accessScope: draft.accessScope,
      keyStatus: draft.keyStatus,
      maskedKey: draft.maskedKey,
      rotationWindow: draft.rotationWindow || "Rotation not set",
      assignedTo: draft.assignedTo,
      lastUsed: "Not used yet",
      note: draft.note || "New API key created from the platform integrations drawer.",
      priority: false,
    });

    setDraft(createEmptyDraft());
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="h-full w-full rounded-none border-l">
        <DrawerHeader>
          <DrawerTitle>Create API Key</DrawerTitle>
          <DrawerDescription>
            Add a new integration credential for payment, OTA, webhook, or platform
            connector access across the resort SaaS environment.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="key-name">Key name</Label>
              <Input
                id="key-name"
                value={draft.keyName}
                onChange={(event) => handleChange("keyName", event.target.value)}
                placeholder="Example: Stripe production billing"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Input
                id="provider"
                value={draft.provider}
                onChange={(event) => handleChange("provider", event.target.value)}
                placeholder="Example: Stripe or Booking.com"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Key type</Label>
              <Select
                value={draft.keyType}
                onValueChange={(value) =>
                  handleChange("keyType", value as ApiKeyRecord["keyType"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select key type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Secret Key">Secret Key</SelectItem>
                  <SelectItem value="Publishable Key">Publishable Key</SelectItem>
                  <SelectItem value="Webhook Key">Webhook Key</SelectItem>
                  <SelectItem value="Sandbox Key">Sandbox Key</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Environment</Label>
              <Select
                value={draft.environment}
                onValueChange={(value) =>
                  handleChange("environment", value as ApiKeyRecord["environment"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Sandbox">Sandbox</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Access scope</Label>
              <Select
                value={draft.accessScope}
                onValueChange={(value) =>
                  handleChange("accessScope", value as ApiKeyRecord["accessScope"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Read">Read</SelectItem>
                  <SelectItem value="Write">Write</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={draft.keyStatus}
                onValueChange={(value) =>
                  handleChange("keyStatus", value as ApiKeyRecord["keyStatus"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Expiring">Expiring</SelectItem>
                  <SelectItem value="Revoked">Revoked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="masked-key">Masked key</Label>
              <Input
                id="masked-key"
                value={draft.maskedKey}
                onChange={(event) => handleChange("maskedKey", event.target.value)}
                placeholder="Example: sk_live_••••••••4k2m"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rotation-window">Rotation window</Label>
              <Input
                id="rotation-window"
                value={draft.rotationWindow}
                onChange={(event) => handleChange("rotationWindow", event.target.value)}
                placeholder="Example: Rotate in 30 days"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned-to">Assigned owner</Label>
            <Input
              id="assigned-to"
              value={draft.assignedTo}
              onChange={(event) => handleChange("assignedTo", event.target.value)}
              placeholder="Enter assignee"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key-note">Configuration note</Label>
            <Textarea
              id="key-note"
              value={draft.note}
              onChange={(event) => handleChange("note", event.target.value)}
              placeholder="Add notes about scope, environment, rotation policy, or intended integration usage."
              className="min-h-28 resize-none"
            />
          </div>
        </div>

        <DrawerFooter className="border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create API key</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
