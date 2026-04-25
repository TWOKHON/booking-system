import { BriefcaseBusiness, Clock3, ShieldAlert, Users } from "lucide-react";
import { HrRecord } from "./hr-data";

type HrSummaryProps = {
  data: HrRecord[];
};

export const HrSummary = ({ data }: HrSummaryProps) => {
  const onShift = data.filter((item) => item.workforceStatus === "On Shift").length;
  const watchOrCritical = data.filter(
    (item) => item.staffingRisk === "Watch" || item.staffingRisk === "Critical"
  ).length;
  const openRoles = data.filter((item) => item.workforceStatus === "Open Role").length;
  const attendanceFlags = data.filter(
    (item) => item.attendanceStatus === "Late" || item.attendanceStatus === "Leave"
  ).length;

  const cards = [
    {
      title: "Tracked Workforce",
      value: String(data.length),
      meta: "Live staffing and roster records currently monitored across tenant resort teams",
      icon: Users,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      title: "Active On Shift",
      value: String(onShift),
      meta: "Employees currently clocked or scheduled into active operating coverage",
      icon: Clock3,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Open Roles",
      value: String(openRoles),
      meta: "Vacant positions that are still affecting staffing balance or service coverage",
      icon: BriefcaseBusiness,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      title: "Workforce Risk",
      value: `${watchOrCritical} / ${attendanceFlags}`,
      meta: "Staffing watch cases compared against attendance exceptions needing HR follow-up",
      icon: ShieldAlert,
      tone: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="mt-3 text-2xl font-semibold">{card.value}</p>
              </div>
              <div
                className={`flex size-10 items-center justify-center rounded-full ${card.tone}`}
              >
                <Icon className="size-5" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{card.meta}</p>
          </div>
        );
      })}
    </div>
  );
};
