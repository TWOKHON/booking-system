import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeftIcon, BotIcon } from "lucide-react";
import { WorkflowEditor } from "@/components/custom/workflows/WorkflowEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type WorkflowPageProps = {
  params: Promise<{ workflowId: string }>;
};

function toReadableDomain(
  domain: "RESERVATIONS" | "OPERATIONS" | "COMMUNICATIONS" | "REVENUE",
) {
  return domain.charAt(0) + domain.slice(1).toLowerCase();
}

function toReadableStatus(status: "ACTIVE" | "DRAFT" | "REVIEW" | "PAUSED") {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default async function Page({ params }: WorkflowPageProps) {
  const { workflowId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const appUser = await db.appUser.findUnique({
    where: { authUserId: session.user.id },
    include: {
      tenantProfile: true,
    },
  });

  if (!appUser?.tenantProfile) {
    redirect("/tenant/dashboard");
  }

  const workflow = await db.tenantAutomationWorkflow.findFirst({
    where: {
      id: workflowId,
      tenantProfileId: appUser.tenantProfile.id,
    },
  });

  if (!workflow) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <Button asChild variant="ghost" className="-ml-3 mb-2">
              <Link href="/tenant/settings/automations">
                <ArrowLeftIcon className="size-4" />
                Back to automations
              </Link>
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <BotIcon className="size-3.5" />
                Workflow builder
              </Badge>
              <Badge variant="secondary">{toReadableDomain(workflow.domain)}</Badge>
              <Badge variant="outline">{toReadableStatus(workflow.status)}</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {workflow.name}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {workflow.note?.trim() ||
                "Use the canvas below to map how this automation should move between triggers, logic, and actions."}
            </p>
          </div>
          <div className="border bg-background/90 px-4 py-3 text-sm">
            <div className="text-xs uppercase text-muted-foreground">
              Trigger label
            </div>
            <div className="mt-2 font-medium">{workflow.triggerLabel}</div>
            <div className="mt-4 text-xs uppercase text-muted-foreground">
              Assigned owner
            </div>
            <div className="mt-2 font-medium">
              {workflow.assignedTo?.trim() || "Unassigned"}
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-[72vh] overflow-hidden rounded-2xl border bg-background shadow-sm">
        <WorkflowEditor workflowId={workflow.id} />
      </section>
    </main>
  );
}
