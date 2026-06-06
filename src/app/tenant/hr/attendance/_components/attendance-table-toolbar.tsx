"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Calendar as CalendarIcon, Columns3, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AttendanceRecord } from "./attendance-data";

type AttendanceTableToolbarProps = {
  table: Table<AttendanceRecord>;
  selectedDateIso: string;
  onSelectedDateIsoChange: (isoDate: string) => void;
  onAddEmployee: (payload: {
    employee: string;
    role: string;
    department: string;
    shift: string;
  }) => void;
};

export const AttendanceTableToolbar = ({
  table,
  selectedDateIso,
  onSelectedDateIsoChange,
  onAddEmployee,
}: AttendanceTableToolbarProps) => {
  const [open, setOpen] = React.useState(false);
  const [employee, setEmployee] = React.useState("");
  const [role, setRole] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [shiftStart, setShiftStart] = React.useState("09:00");
  const [shiftEnd, setShiftEnd] = React.useState("17:00");
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [activeDayFilter, setActiveDayFilter] = React.useState<
    "all" | "today" | "yesterday" | "custom"
  >("today");
  const [customDate, setCustomDate] = React.useState<Date>(new Date());

  const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);
  const [{ todayIso, yesterdayIso, maxSelectableDate }] = React.useState(() => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return {
      todayIso: toIsoDate(now),
      yesterdayIso: toIsoDate(yesterday),
      maxSelectableDate: now,
    };
  });

  const applyDateSelection = React.useCallback(
    (mode: "all" | "today" | "yesterday" | "custom", date?: Date) => {
      const column = table.getColumn("date");
      if (!column) return;

      if (mode === "all") {
        column.setFilterValue("");
        onSelectedDateIsoChange(todayIso);
        return;
      }

      if (mode === "today") {
        column.setFilterValue(todayIso);
        onSelectedDateIsoChange(todayIso);
        return;
      }

      if (mode === "yesterday") {
        column.setFilterValue(yesterdayIso);
        onSelectedDateIsoChange(yesterdayIso);
        return;
      }

      const picked = date ?? new Date();
      const iso = toIsoDate(picked);
      column.setFilterValue(iso);
      onSelectedDateIsoChange(iso);
    },
    [onSelectedDateIsoChange, table, todayIso, yesterdayIso]
  );

  React.useEffect(() => {
    // Default to Today on first render.
    applyDateSelection("today");
  }, [applyDateSelection]);

  const canSubmit =
    employee.trim().length > 1 &&
    role.trim().length > 1 &&
    department.trim().length > 1 &&
    shiftStart.trim().length > 1 &&
    shiftEnd.trim().length > 1;

  const submit = () => {
    if (!canSubmit) return;
    const shiftLabel = `${shiftStart} - ${shiftEnd}`;
    onAddEmployee({
      employee: employee.trim(),
      role: role.trim(),
      department: department.trim(),
      shift: shiftLabel,
    });
    setEmployee("");
    setRole("");
    setDepartment("");
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search employee, department, shift, or note..."
            className="pl-9"
          />
        </div>

        <Select
          value={activeDayFilter}
          onValueChange={(value) => {
            const v = value as typeof activeDayFilter;
            setActiveDayFilter(v);
            if (v === "custom") {
              setDatePickerOpen(true);
              applyDateSelection("custom", customDate);
            } else {
              applyDateSelection(v);
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-[155px]">
            <SelectValue placeholder="Filter day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="custom">Pick date...</SelectItem>
            <SelectItem value="all">All days</SelectItem>
          </SelectContent>
        </Select>

        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="justify-start gap-2 sm:h-9"
            >
              <CalendarIcon className="size-4" />
              {activeDayFilter === "custom" ? selectedDateIso : selectedDateIso}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-2">
            <Calendar
              mode="single"
              selected={customDate}
              onSelect={(date) => {
                if (!date) return;
                setCustomDate(date);
                setActiveDayFilter("custom");
                applyDateSelection("custom", date);
                setDatePickerOpen(false);
              }}
              disabled={(date) => date > maxSelectableDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Present">Present</SelectItem>
            <SelectItem value="Late">Late</SelectItem>
            <SelectItem value="On Leave">On Leave</SelectItem>
            <SelectItem value="Absent">Absent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="size-4" />
              Add employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add employee row</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="employeeName">Employee name</Label>
                <Input
                  id="employeeName"
                  value={employee}
                  onChange={(e) => setEmployee(e.target.value)}
                  placeholder="e.g., Jamie Dela Cruz"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employeeRole">Role</Label>
                <Input
                  id="employeeRole"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Front Desk Associate"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employeeDept">Department</Label>
                <Input
                  id="employeeDept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g., Front Office"
                />
              </div>
              <div className="grid gap-2">
                <Label>Shift</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="employeeShiftStart" className="text-xs text-muted-foreground">
                      Start
                    </Label>
                    <Input
                      id="employeeShiftStart"
                      type="time"
                      value={shiftStart}
                      onChange={(e) => setShiftStart(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="employeeShiftEnd" className="text-xs text-muted-foreground">
                      End
                    </Label>
                    <Input
                      id="employeeShiftEnd"
                      type="time"
                      value={shiftEnd}
                      onChange={(e) => setShiftEnd(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submit} disabled={!canSubmit}>
                Add employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns3 className="size-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
