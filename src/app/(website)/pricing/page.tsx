"use client";

import { PricingSection } from "@/components/custom/sections/PricingSection";
import { AddOnsSection } from "@/components/custom/sections/AddOnSection";
import { PricingCompareTable } from "@/components/custom/PricingCompareTable";

const Page = () => {
  return (
    <div className="pt-25">
      <PricingSection />
      <PricingCompareTable />
      <AddOnsSection />
    </div>
  )
}

export default Page
