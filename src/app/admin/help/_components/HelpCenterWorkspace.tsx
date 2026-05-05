"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Search, ArrowRight } from "lucide-react";
import type { HelpCategory, QuickLink } from "./help-data";

type HelpCenterWorkspaceProps = {
  quickLinks: QuickLink[];
  categories: HelpCategory[];
};

export const HelpCenterWorkspace = ({
  quickLinks,
  categories,
}: HelpCenterWorkspaceProps) => {
  return (
    <div className="space-y-5">
      <Card className="gap-0 overflow-hidden">
        <CardHeader className="border-b">
          <div className="space-y-1.5">
            <CardTitle>Find Help Faster</CardTitle>
            <CardDescription>
              Search support topics, admin workflows, and governance guidance
              across the help center.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          <div className="rounded-3xl border bg-[#f6f7f1] p-4">
            <InputGroup className="h-11 rounded-2xl bg-white">
              <InputGroupAddon>
                <InputGroupText>
                  <Search className="size-4" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search help articles, settings guides, or support topics..."
              />
            </InputGroup>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Branding setup", "Role approvals", "Audit logs", "AI policy"].map(
                (term) => (
                  <Button key={term} variant="outline" size="sm">
                    {term}
                  </Button>
                ),
              )}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border bg-muted/10 p-5"
                >
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-background text-[#537129]">
                    <Icon className="size-4.5" />
                  </div>

                  <p className="mt-4 text-base font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>

                  <Button variant="ghost" className="mt-4 px-0 text-[#537129]">
                    {item.cta}
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden">
        <CardHeader className="border-b">
          <div className="space-y-1.5">
            <CardTitle>Help Topics</CardTitle>
            <CardDescription>
              Browse the most common admin help categories and open the answers
              that matter to your workflow.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div key={category.id} className="rounded-3xl border bg-background">
                <div className="border-b px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted/40 text-[#537129]">
                      <Icon className="size-4.5" />
                    </div>

                    <div>
                      <p className="text-base font-semibold">{category.label}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-2">
                  <Accordion type="single" collapsible className="w-full">
                    {category.articles.map((article, index) => (
                      <AccordionItem
                        key={article.question}
                        value={`${category.id}-${index}`}
                      >
                        <AccordionTrigger className="py-4 text-sm">
                          {article.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {article.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
