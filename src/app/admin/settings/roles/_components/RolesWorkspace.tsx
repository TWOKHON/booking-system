"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserCog2 } from "lucide-react";
import type {
  AccessAssignment,
  PermissionGroup,
  RoleTemplate,
} from "./roles-data";

type RolesWorkspaceProps = {
  templates: RoleTemplate[];
  permissionGroups: PermissionGroup[];
  assignments: AccessAssignment[];
};

const statusTone: Record<string, string> = {
  Healthy:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  Review:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  Watch:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300",
};

export const RolesWorkspace = ({
  templates,
  permissionGroups,
  assignments,
}: RolesWorkspaceProps) => {
  return (
    <div className="space-y-5">
      <Card className="gap-0 overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1.5">
              <CardTitle>Role Templates</CardTitle>
              <CardDescription>
                Standardize access around reusable permission bundles so tenant
                and platform teams stay aligned.
              </CardDescription>
            </div>

            <Button>
              <UserCog2 className="mr-1 size-4" />
              Create role template
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-5">
          <div className="grid gap-4 xl:grid-cols-2">
            {templates.map((template) => (
              <div
                key={template.name}
                className="rounded-3xl border bg-muted/10 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold">{template.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {template.audience}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={`${template.tone} rounded-full px-2 text-[11px]`}
                  >
                    {template.seatCount}
                  </Badge>
                </div>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {template.summary}
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      Permission coverage
                    </p>
                    <p className="text-sm font-medium">{template.coverage}%</p>
                  </div>
                  <Progress value={template.coverage} className="h-1.5" />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {template.permissions.map((permission) => (
                    <Badge
                      key={permission}
                      variant="outline"
                      className="rounded-full"
                    >
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden">
        <CardHeader className="border-b">
          <div className="space-y-1.5">
            <CardTitle>Permission Matrix</CardTitle>
            <CardDescription>
              Review which role templates can access the most sensitive
              operational and billing actions.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          <div className="rounded-3xl border bg-background">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Permission</TableHead>
                  <TableHead>Owner Admin</TableHead>
                  <TableHead>Operations Lead</TableHead>
                  <TableHead>Finance Manager</TableHead>
                  <TableHead className="pr-4">Support Agent</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {permissionGroups.flatMap((group) => [
                  <TableRow
                    key={`${group.label}-heading`}
                    className="bg-muted/30 hover:bg-muted/30"
                  >
                    <TableCell colSpan={5} className="px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {group.label}
                      </p>
                    </TableCell>
                  </TableRow>,
                  ...group.permissions.map((permission) => (
                    <TableRow key={`${group.label}-${permission.name}`}>
                      <TableCell className="pl-4 pr-6">
                        <p className="font-medium">{permission.name}</p>
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={permission.ownerAdmin} />
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={permission.operationsLead} />
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={permission.financeManager} />
                      </TableCell>
                      <TableCell className="pr-4">
                        <Checkbox checked={permission.supportAgent} />
                      </TableCell>
                    </TableRow>
                  )),
                ])}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="justify-between gap-3 border-t bg-background">
          <p className="text-xs text-muted-foreground">
            High-risk actions remain limited to approved billing, audit, and
            platform-owner roles.
          </p>

          <Button variant="outline">Export matrix</Button>
        </CardFooter>
      </Card>

      <Card className="gap-0 overflow-hidden">
        <CardHeader className="border-b">
          <div className="space-y-1.5">
            <CardTitle>Assignments and Controls</CardTitle>
            <CardDescription>
              Watch active access assignments and keep escalation controls in
              one place.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          <div className="space-y-3">
              {assignments.map((item) => (
                <div
                  key={item.name}
                  className="rounded-3xl border bg-muted/10 px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Avatar size="lg">
                        <AvatarFallback>{item.initials}</AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.role} - {item.scope}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`${statusTone[item.status]} rounded-full px-2 text-[11px]`}
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
};
