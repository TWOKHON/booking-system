import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { FAQS_CONTENT } from "@/constants";
import { PlusIcon } from "lucide-react";
import { AnimatedTabs } from "@/components/animated-ui/AnimatedTabs";

function CategoryAccordion({
  items,
}: {
  items: (typeof FAQS_CONTENT)[0]["items"];
}) {
  return (
    <div className="w-full overflow-y-auto h-full rounded-2xl p-8 bg-muted/40">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-0"
      >
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger
                data-slot="accordion-trigger"
                className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-45"
              >
                {item.question}
                <PlusIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200" />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

const tabs = FAQS_CONTENT.map((faqCategory) => ({
  title: faqCategory.category,
  value: faqCategory.category,
  content: <CategoryAccordion items={faqCategory.items} />,
}));

export function FaqsSection() {
  return (
    <section className="pt-40 pb-30 max-w-7xl px-6 mx-auto">
      <div className="text-center">
        <h3 className="text-4xl font-bold text-center">
          Frequently Asked Questions
        </h3>
        <p className="text-center mt-5">
          Everything you need to know about managing your resort with
          ResortCloud.
        </p>
      </div>
      <div className="h-90 relative flex flex-col w-full items-start justify-start mt-15">
        <AnimatedTabs tabs={tabs} />
      </div>
    </section>
  );
}