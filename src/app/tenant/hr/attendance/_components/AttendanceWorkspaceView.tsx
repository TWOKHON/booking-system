import {
  AlertCircleIcon,
  CalendarDaysIcon,
  Clock3Icon,
  DownloadIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AttendanceTable } from "./AttendanceTable";

type AttendanceWorkspaceViewProps = {
  ownerName: string;
  resortName: string;
};

const summaryCards = [
  {
    label: "Present today",
    value: "4",
    detail: "67% checked in",
    icon: UserCheckIcon,
  },
  {
    label: "Late arrivals",
    value: "1",
    detail: "Needs supervisor note",
    icon: Clock3Icon,
  },
  {
    label: "On leave",
    value: "1",
    detail: "Approved schedule",
    icon: CalendarDaysIcon,
  },
  {
    label: "Exceptions",
    value: "2",
    detail: "Late or absent records",
    icon: AlertCircleIcon,
  },
];

export function AttendanceWorkspaceView({
  ownerName,
  resortName,
}: AttendanceWorkspaceViewProps) {
  const insightMessage = `${resortName} has 4 staff checked in today, 1 late arrival, and 1 absence that needs HR follow-up before payroll cutoff.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden rounded-xl border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <UsersIcon className="size-3.5" />
                HR & Attendance
              </Badge>
              <Badge variant="secondary">Daily staffing</Badge>
              <Badge variant="secondary">Payroll ready</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Attendance
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Review employee attendance, shift coverage, late arrivals, leave
              records, and payroll exceptions for {resortName}.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tenant/hr/leave-application">Leave applications</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/hr/payroll">Payroll</Link>
            </Button>
            <Button variant="outline" className="gap-2">
              <DownloadIcon className="size-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-xl border bg-background/90 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs uppercase text-muted-foreground">
                    {card.label}
                  </div>
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="mt-3 text-2xl font-semibold">{card.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {card.detail}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <AttendanceTable />
    </main>
  );
}
