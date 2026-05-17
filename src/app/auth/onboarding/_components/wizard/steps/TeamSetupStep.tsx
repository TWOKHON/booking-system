"use client";

import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { roleSuggestions } from "../data";
import { ActionFooter, StepHeader } from "../shared";
import type { InvitedMember } from "../types";
import { Badge } from "@/components/ui/badge";

export function TeamSetupStep({
  members,
  onMembersChange,
  onBack,
  onNext,
  isSaving = false,
}: {
  members: InvitedMember[];
  onMembersChange: (members: InvitedMember[]) => void;
  onBack: () => void;
  onNext: () => void;
  isSaving?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  function handleAddMember() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !role) {
      toast.error("Name, email, and role are required.");
      return;
    }

    const duplicateMember = members.some(
      (member) => member.email.toLowerCase() === trimmedEmail,
    );

    if (duplicateMember) {
      toast.error("That team member email is already in the invite list.");
      return;
    }

    onMembersChange([
      ...members,
      {
        initials: trimmedName
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join("")
          .slice(0, 4),
        name: trimmedName,
        email: trimmedEmail,
        role,
        status: "Pending",
      },
    ]);
    setName("");
    setEmail("");
    setRole("");
  }

  function handleRemoveMember(memberEmail: string) {
    onMembersChange(members.filter((member) => member.email !== memberEmail));
  }

  return (
    <div className="mx-auto max-w-6xl">
      <StepHeader
        title="Team Setup"
        description="Invite your team members and set their roles to get started."
        onBack={onBack}
      />

      <div className="mt-10 space-y-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Invite Team Members
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px_120px]">
            <Input
              placeholder="Enter full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Input
              placeholder="Enter email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Owner/Admin">Owner/Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Front Desk">Front Desk</SelectItem>
                <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" onClick={handleAddMember} disabled={isSaving}>
              Add
            </Button>
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            Add the actual team members who should be part of this tenant workspace.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Suggested Roles
          </h2>
          <div className="mt-5 space-y-4">
            {roleSuggestions.map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.title}
                  className="rounded-2xl border-zinc-200 py-0 shadow-none"
                >
                  <CardContent className="flex items-center justify-between gap-4 px-5 py-5">
                    <div className="flex items-start gap-5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium tracking-tight text-zinc-950">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <Users className="size-5 text-zinc-500" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Invited Members
          </h2>
          {members.length > 0 ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-4 py-4 text-sm text-zinc-500">
                      Name
                    </TableHead>
                    <TableHead className="px-4 py-4 text-sm text-zinc-500">
                      Email
                    </TableHead>
                    <TableHead className="px-4 py-4 text-sm text-zinc-500">
                      Role
                    </TableHead>
                    <TableHead className="px-4 py-4 text-sm text-zinc-500">
                      Status
                    </TableHead>
                    <TableHead className="px-4 py-4 text-sm text-zinc-500" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow
                      key={`${member.email}-${member.role}`}
                      className="hover:bg-zinc-50"
                    >
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex size-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium">
                            {member.initials}
                          </div>
                          <span className="text-base font-medium text-zinc-950">
                            {member.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-zinc-600">
                        {member.email}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <Badge variant="outline">{member.role}</Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-700">
                          {member.status === "Accepted" ? (
                            <CheckCircle2 className="size-4" />
                          ) : (
                            <CalendarDays className="size-4" />
                          )}
                          {member.status}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="ml-auto size-8"
                          onClick={() => handleRemoveMember(member.email)}
                          disabled={isSaving}
                        >
                          <Trash2 className="size-4 text-zinc-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card className="mt-5 rounded-2xl border-dashed border-zinc-200 py-0 shadow-none">
              <CardContent className="px-5 py-6 text-sm text-zinc-500">
                No team members added yet.
              </CardContent>
            </Card>
          )}
          <p className="mt-3 text-sm text-zinc-500">
            You can manage roles and permissions later from Settings.
          </p>
        </div>

        <ActionFooter
          onBack={onBack}
          onNext={onNext}
          hint="You can always invite more members later."
          disabled={isSaving}
        />
      </div>
    </div>
  );
}
