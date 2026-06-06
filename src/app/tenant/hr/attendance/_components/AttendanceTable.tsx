"use client";
"use no memo";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";
import { AttendanceRecord } from "./attendance-data";
import { getAttendanceColumns } from "./attendance-columns";
import { AttendanceTableToolbar } from "./attendance-table-toolbar";
import { AttendanceTablePagination } from "./attendance-table-pagination";

const globalAttendanceFilter = (
  row: { original: AttendanceRecord },
  _columnId: string,
  value: string
) => {
  const search = value.toLowerCase();
  const item = row.original;

  return [
    item.employee,
    item.role,
    item.department,
    item.shift,
    item.checkIn,
    item.checkOut,
    item.status,
    item.note,
    item.id,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

export const AttendanceTable = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [{ todayIso }] = React.useState(() => ({ todayIso: toIsoDate(new Date()) }));
  const [selectedDateIso, setSelectedDateIso] = React.useState(todayIso);

  const employeesQuery = useQuery(trpc.employees.list.queryOptions());

  const createEmployeeMutation = useMutation(
    trpc.employees.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.employees.list.queryOptions());
        toast.success("Employee added.");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to add employee.");
      },
    })
  );

  const data: AttendanceRecord[] = React.useMemo(() => {
    const employees = employeesQuery.data ?? [];
    return employees.map((employee) => ({
      id: employee.id,
      date: selectedDateIso,
      employee: employee.fullName,
      role: employee.roleTitle || "Employee",
      department: employee.department || "--",
      shift: employee.defaultShift || "--",
      checkIn: "--",
      checkOut: "--",
      hours: "0h",
      status: "Present",
      note: "",
    }));
  }, [employeesQuery.data, selectedDateIso]);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "employee", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo(
    () =>
      getAttendanceColumns({
        onUpdateStatus: undefined,
        onRemove: undefined,
      }),
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: globalAttendanceFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      columnVisibility: {
        date: false,
      },
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Employee attendance list</h2>
          <p className="text-sm text-muted-foreground">
            Search, filter, and update today&apos;s attendance records by employee.
          </p>
        </div>

        <AttendanceTableToolbar
          table={table}
          selectedDateIso={selectedDateIso}
          onSelectedDateIsoChange={setSelectedDateIso}
          onAddEmployee={(payload) =>
            createEmployeeMutation.mutate({
              fullName: payload.employee,
              roleTitle: payload.role,
              department: payload.department,
              defaultShift: payload.shift,
            })
          }
        />

        <div className="overflow-hidden border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {employeesQuery.isLoading
                      ? "Loading employees..."
                      : "No employees found yet. Add an employee to get started."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <AttendanceTablePagination table={table} />
      </div>
    </section>
  );
};
