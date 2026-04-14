"use client";

import Image from "next/image";

import type { CompanyContent } from "@/data/company";

export function CompanyTeamSection({
  team,
}: {
  team: CompanyContent["team"];
}) {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-3" data-animate="section">
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-500">{team.eyebrow}</p>
        <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-bold text-zinc-950">
          {team.title}
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base text-zinc-600">
          {team.description}
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {team.members.map((member) => (
          <div
            key={member.name}
            className="overflow-hidden border border-zinc-200 bg-white shadow-lg shadow-zinc-900/5"
            data-animate="team-card"
          >
            <div className={`relative h-105 bg-linear-to-br ${member.accent}`}>
              <div className="absolute inset-0">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover opacity-85"
                />
              </div>
              <div className="absolute inset-x-5 bottom-5 flex items-center justify-between bg-black/60 p-3.5">
                <div>
                  <p className="text-base font-semibold text-white">
                    {member.name}
                  </p>
                  <p className="text-sm text-zinc-300">{member.role}</p>
                </div>
                <Image
                  src="/brands/linkedin.svg"
                  alt="LinkedIn"
                  className="invert"
                  width={25}
                  height={25}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
