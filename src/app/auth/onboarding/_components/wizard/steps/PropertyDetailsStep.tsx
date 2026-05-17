"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAddressData } from "@/lib/address-selection";
import type { OnboardingFormData } from "@/app/auth/onboarding/_lib/schema";
import { ActionFooter, LabeledField, StepHeader } from "../shared";

export function PropertyDetailsStep({
  data,
  onChange,
  onBack,
  onNext,
  isSaving = false,
}: {
  data: OnboardingFormData["property"];
  onChange: (field: keyof OnboardingFormData["property"], value: string) => void;
  onBack: () => void;
  onNext: () => void;
  isSaving?: boolean;
}) {
  const [selectedRegion, setSelectedRegion] = useState(data.region);
  const [selectedProvince, setSelectedProvince] = useState(data.province);
  const [selectedMunicipality, setSelectedMunicipality] = useState(data.municipality);
  const [selectedBarangay, setSelectedBarangay] = useState(data.barangay);
  const {
    regionOptions,
    provinceOptions,
    municipalityOptions,
    barangayOptions,
  } = useAddressData(selectedRegion, selectedProvince, selectedMunicipality);

  return (
    <div className="mx-auto max-w-6xl">
      <StepHeader
        title="Property Details"
        description="Let's start by adding your resort information."
        onBack={onBack}
      />

      <div className="mt-10 space-y-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
            Basic Information
          </h2>
          <div className="mt-8 space-y-7">
            <LabeledField label="Resort Name *">
              <Input
                placeholder="Enter resort name"
                value={data.resortName}
                onChange={(event) => onChange("resortName", event.target.value)}
              />
            </LabeledField>

            <LabeledField label="Property Type *">
              <Input
                placeholder="Enter property type e.g. Private Resort, Event Venue"
                value={data.propertyType}
                onChange={(event) => onChange("propertyType", event.target.value)}
              />
            </LabeledField>

            <LabeledField label="Full Address *">
              <Input
                placeholder="Enter block, lot number, street, subdivision, village"
                value={data.fullAddress}
                onChange={(event) => onChange("fullAddress", event.target.value)}
              />
            </LabeledField>

            <div className="grid gap-6 md:grid-cols-2">
              <LabeledField label="Region *">
                <Select
                  value={selectedRegion}
                  onValueChange={(value) => {
                    setSelectedRegion(value);
                    setSelectedProvince("");
                    setSelectedMunicipality("");
                    setSelectedBarangay("");
                    onChange("region", value);
                    onChange("province", "");
                    onChange("municipality", "");
                    onChange("barangay", "");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regionOptions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </LabeledField>

              <LabeledField label="Province *">
                <Select
                  value={selectedProvince}
                  onValueChange={(value) => {
                    setSelectedProvince(value);
                    setSelectedMunicipality("");
                    setSelectedBarangay("");
                    onChange("province", value);
                    onChange("municipality", "");
                    onChange("barangay", "");
                  }}
                  disabled={!selectedRegion}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinceOptions.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </LabeledField>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <LabeledField label="Municipality / City *">
                <Select
                  value={selectedMunicipality}
                  onValueChange={(value) => {
                    setSelectedMunicipality(value);
                    setSelectedBarangay("");
                    onChange("municipality", value);
                    onChange("barangay", "");
                  }}
                  disabled={!selectedProvince}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select municipality / city" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalityOptions.map((municipality) => (
                      <SelectItem key={municipality} value={municipality}>
                        {municipality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </LabeledField>

              <LabeledField label="Barangay *">
                <Select
                  value={selectedBarangay}
                  onValueChange={(value) => {
                    setSelectedBarangay(value);
                    onChange("barangay", value);
                  }}
                  disabled={!selectedMunicipality}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select barangay" />
                  </SelectTrigger>
                  <SelectContent>
                    {barangayOptions.map((barangay) => (
                      <SelectItem key={barangay} value={barangay}>
                        {barangay}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </LabeledField>
            </div>

            <LabeledField label="Phone Number *">
              <Input
                placeholder="Enter phone number"
                value={data.phoneNumber}
                onChange={(event) => onChange("phoneNumber", event.target.value)}
              />
            </LabeledField>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Additional Information
          </h2>
          <div className="mt-8 space-y-7">
            <LabeledField label="Website" optional>
              <Input
                placeholder="Enter website URL"
                value={data.website}
                onChange={(event) => onChange("website", event.target.value)}
              />
            </LabeledField>

            <LabeledField label="Short Description" optional>
              <div className="relative">
                <Textarea
                  placeholder="Briefly describe your resort"
                  className="min-h-30"
                  value={data.shortDescription}
                  onChange={(event) => onChange("shortDescription", event.target.value)}
                />
                <span className="absolute bottom-3 right-3 text-sm text-zinc-400">
                  {data.shortDescription.length} / 200
                </span>
              </div>
            </LabeledField>
          </div>
        </div>

        <ActionFooter
          onBack={onBack}
          onNext={onNext}
          hint="You can always edit these details later."
          disabled={isSaving}
        />
      </div>
    </div>
  );
}
