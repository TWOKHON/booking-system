import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReviewItem } from "./roles-data";
import { governanceNotes } from "./roles-data";

type RolesSidePanelProps = {
  reviewQueue: ReviewItem[];
};

const reviewTone: Record<string, string> = {
  "Needs review":
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  "Follow-up":
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300",
  Scheduled:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
};

export const RolesSidePanel = ({ reviewQueue }: RolesSidePanelProps) => {
  return (
    <div className="space-y-5">
      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b">
          <CardTitle>Access Review Queue</CardTitle>
          <CardDescription>
            Current role and approval items that still need admin attention.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-5">
          {reviewQueue.map((item) => (
            <div key={item.title} className="rounded-2xl border bg-muted/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="pr-2 font-medium leading-6">{item.title}</p>
                <Badge
                  variant="outline"
                  className={`${reviewTone[item.status]} rounded-full px-2 py-0 text-[11px]`}
                >
                  {item.status}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.meta}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b">
          <CardTitle>Governance Notes</CardTitle>
          <CardDescription>
            Principles that keep shared role management safe across tenants.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-5">
          {governanceNotes.map((item) => (
            <div key={item.title} className="rounded-2xl border bg-muted/10 p-4">
              <p className="font-medium">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.detail}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
