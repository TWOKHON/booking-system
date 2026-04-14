"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { CompanyContent } from "@/data/company";
import { Button } from "@/components/ui/button";
import { AnimatedTooltip } from "@/components/animated-ui/AnimatedTooltip";

export function CompanyCareersSection({
  careers,
  team,
}: {
  careers: CompanyContent["careers"];
  team: CompanyContent["team"];
}) {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-3" data-animate="section">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            {careers.eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl font-bold text-zinc-950">
            {careers.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base text-zinc-600">
            {careers.body}
          </p>

          <div className="mt-8">
            <div className="flex w-full flex-row items-center">
              <AnimatedTooltip
                items={team.members.map((member, index) => ({
                  id: index,
                  name: member.name,
                  designation: member.role,
                  image: member.image,
                }))}
              />
              <div className="z-55 flex size-14 items-center justify-center rounded-full border bg-black text-base font-medium text-white">
                +4
              </div>
            </div>
            <div className="mt-3 text-sm text-zinc-500">
              Join a team building operational software with taste and clarity.
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-11 px-4">
              <Link href="/solution">
                See what we are building
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-4">
              <Link href="/pricing">Compare plans</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4 border-l border-zinc-200 pl-0 lg:pl-8">
          {careers.roles.map((role) => (
            <div
              key={role.title}
              className="border border-zinc-200 bg-zinc-50 p-4 last:border-zinc-200"
              data-animate="role-card"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-zinc-950">
                  {role.title}
                </h3>
                <p>•</p>
                <p className="text-sm">{role.meta}</p>
              </div>
              <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
