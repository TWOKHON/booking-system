"use client";
"use no memo";

import * as React from "react";
import {
  BanknoteIcon,
  CalendarDaysIcon,
  ClockIcon,
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  IdCardIcon,
  LandmarkIcon,
  TimerIcon,
} from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPayrollColumns } from "./payroll-columns";
import type { PayrollRow } from "./payroll-data";
import { PayrollTableToolbar } from "./PayrollTableToolbar";
import { PayrollTablePagination } from "./PayrollTablePagination";
import { Button } from "@/components/ui/button";

const globalPayrollFilter = (
  row: { original: PayrollRow },
  _columnId: string,
  value: string,
) => {
  const search = value.toLowerCase();
  const item = row.original;
  return [
    item.employee.fullName,
    item.employee.department,
    item.employee.defaultShift,
    item.status,
    item.notes,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

export function PayrollTable({
  data,
  isLoading,
  emptyLabel,
  tenantName,
  tenantLogoUrl,
  tenantAddress,
  tenantPhone,
  payPeriodLabel,
  payDate,
}: {
  data: PayrollRow[];
  isLoading: boolean;
  emptyLabel: string;
  tenantName: string;
  tenantLogoUrl?: string | null;
  tenantAddress?: string | null;
  tenantPhone?: string | null;
  payPeriodLabel: string;
  payDate: string;
}) {
  const [selectedPayslip, setSelectedPayslip] = React.useState<PayrollRow | null>(
    null,
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "employee", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const payrollColumns = React.useMemo(
    () =>
      getPayrollColumns({
        onOpenPayslip: setSelectedPayslip,
      }),
    [],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: payrollColumns,
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
    globalFilterFn: globalPayrollFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Payroll readiness list</h2>
          <p className="text-sm text-muted-foreground">
            Review which employees are ready for payroll export and which need setup updates.
          </p>
        </div>

        <PayrollTableToolbar table={table} />

        <div className="overflow-hidden border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={payrollColumns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading payroll...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={payrollColumns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyLabel}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <PayrollTablePagination table={table} />
      </div>

      <PayslipDialog
        row={selectedPayslip}
        tenantName={tenantName}
        tenantLogoUrl={tenantLogoUrl}
        tenantAddress={tenantAddress}
        tenantPhone={tenantPhone}
        payPeriodLabel={payPeriodLabel}
        payDate={payDate}
        onOpenChange={(open) => {
          if (!open) setSelectedPayslip(null);
        }}
      />
    </section>
  );
}

function formatMoney(cents: number) {
  return `PHP ${(cents / 100).toFixed(2)}`;
}

function formatOptionalMoney(cents: number | null) {
  return cents == null ? "--" : formatMoney(cents);
}

function formatHours(minutes: number) {
  return `${(minutes / 60).toFixed(2)}h`;
}

function formatDecimalHours(minutes: number) {
  return (minutes / 60).toFixed(2);
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function TenantLogo({
  logoUrl,
  tenantName,
}: {
  logoUrl?: string | null;
  tenantName: string;
}) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={`${tenantName} logo`}
        className="size-12 rounded-md object-contain"
      />
    );
  }

  return (
    <div className="grid size-12 place-items-center rounded-md border border-zinc-300 bg-white text-sm font-semibold">
      {getInitials(tenantName)}
    </div>
  );
}

function PayslipDialog({
  row,
  tenantName,
  tenantLogoUrl,
  tenantAddress,
  tenantPhone,
  payPeriodLabel,
  payDate,
  onOpenChange,
}: {
  row: PayrollRow | null;
  tenantName: string;
  tenantLogoUrl?: string | null;
  tenantAddress?: string | null;
  tenantPhone?: string | null;
  payPeriodLabel: string;
  payDate: string;
  onOpenChange: (open: boolean) => void;
}) {
  const generatedAt = React.useMemo(
    () =>
      new Date().toLocaleString("en-PH", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    [],
  );
  const handleDownloadPdf = React.useCallback(() => {
    requestAnimationFrame(() => {
      window.print();
    });
  }, []);

  const hourlyRateLabel =
    row?.employee.hourlyRateCents == null
      ? "--"
      : formatMoney(row.employee.hourlyRateCents);
  const regularPayCents =
    row?.employee.hourlyRateCents == null
      ? null
      : Math.round((row.regularMinutes / 60) * row.employee.hourlyRateCents);
  const overtimeRateCents =
    row?.employee.hourlyRateCents == null
      ? null
      : Math.round(row.employee.hourlyRateCents * 1.25);
  const overtimePayCents =
    overtimeRateCents == null || !row
      ? null
      : Math.round((row.overtimeMinutes / 60) * overtimeRateCents);
  const holidayRateCents =
    row?.employee.hourlyRateCents == null
      ? null
      : row.employee.hourlyRateCents * 2;
  const holidayPayCents =
    holidayRateCents == null || !row
      ? null
      : Math.round((row.holidayMinutes / 60) * holidayRateCents);

  return (
    <Dialog open={Boolean(row)} onOpenChange={onOpenChange}>
      <DialogContent className="payslip-print-root overflow-hidden p-0 sm:max-w-3xl">
        <style>{payslipPrintStyles}</style>
        <DialogHeader className="payslip-screen-header border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-zinc-100 text-zinc-800">
              <FileTextIcon className="size-5" />
            </div>
            <div>
              <DialogTitle>Payslip</DialogTitle>
              <DialogDescription>
                {row
                  ? `${row.employee.fullName} payroll breakdown`
                  : "Payroll breakdown"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {row ? (
          <div className="payslip-print-scroll max-h-[78vh] overflow-y-auto">
            <article className="payslip-document space-y-5 bg-white px-6 py-6 text-zinc-950">
              <header className="grid gap-6 border-b border-zinc-300 pb-5 sm:grid-cols-[1fr_auto]">
                <div className="flex items-start gap-3">
                  <TenantLogo
                    logoUrl={tenantLogoUrl}
                    tenantName={tenantName}
                  />
                  <div>
                    <h3 className="text-base font-semibold">{tenantName}</h3>
                    <p className="mt-1 max-w-64 text-[11px] leading-4 text-zinc-600">
                      {tenantAddress || "Tenant address not set"}
                      {tenantPhone ? (
                        <>
                          <br />
                          TIN: {tenantPhone}
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-bold tracking-wide">PAYSLIP</p>
                  <p className="mt-1 text-[11px] text-zinc-600">
                    This is a system generated payslip.
                  </p>
                </div>
              </header>

              <section className="grid gap-6 border-b border-zinc-300 pb-5 md:grid-cols-[1fr_0.9fr]">
                <div className="flex items-center gap-4">
                  <div className="grid size-16 shrink-0 place-items-center rounded-full bg-zinc-100 text-xl font-semibold text-zinc-800">
                    {getInitials(row.employee.fullName)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {row.employee.fullName}
                    </h3>
                    <p className="text-sm text-zinc-600">
                      {row.employee.department || "Unassigned department"}
                    </p>
                    <div className="mt-3 space-y-1 text-xs">
                      <p>
                        <span className="font-semibold">Employee ID:</span>{" "}
                        {row.employee.id}
                      </p>
                      <p>
                        <span className="font-semibold">Department:</span>{" "}
                        {row.employee.department || "--"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="space-y-3">
                    <PayslipInfo
                      icon={<CalendarDaysIcon className="size-4" />}
                      label="Pay Period"
                      value={payPeriodLabel}
                    />
                    <PayslipInfo
                      icon={<CalendarDaysIcon className="size-4" />}
                      label="Pay Date"
                      value={payDate}
                    />
                    <PayslipInfo
                      icon={<TimerIcon className="size-4" />}
                      label="Shift"
                      value={`${row.employee.defaultShift || "--"} (${formatHours(row.regularMinutes)} regular)`}
                    />
                  </div>
                </div>
              </section>

              <section>
                <h4 className="border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-semibold uppercase">
                  Earnings Summary
                </h4>
                <div className="border-x border-b border-zinc-300">
                  <div className="grid grid-cols-[1.6fr_0.8fr_1fr_1fr] border-b border-zinc-200 text-[11px] font-semibold uppercase">
                    <div className="border-r border-zinc-200 px-3 py-2">
                      Description
                    </div>
                    <div className="border-r border-zinc-200 px-3 py-2 text-center">
                      Hours
                    </div>
                    <div className="border-r border-zinc-200 px-3 py-2 text-center">
                      Rate (PHP)
                    </div>
                    <div className="px-3 py-2 text-center">Amount (PHP)</div>
                  </div>
                  <PayslipEarningLine
                    label="Regular Hours"
                    hours={formatDecimalHours(row.regularMinutes)}
                    rate={hourlyRateLabel}
                    amount={formatOptionalMoney(regularPayCents)}
                  />
                  <PayslipEarningLine
                    label="Overtime"
                    hours={formatDecimalHours(row.overtimeMinutes)}
                    rate={formatOptionalMoney(overtimeRateCents)}
                    amount={formatOptionalMoney(overtimePayCents)}
                  />
                  <PayslipEarningLine
                    label="Undertime"
                    hours={formatDecimalHours(row.undertimeMinutes)}
                    rate="--"
                    amount="--"
                  />
                  <PayslipEarningLine
                    label="Holiday Hours"
                    hours={formatDecimalHours(row.holidayMinutes)}
                    rate={formatOptionalMoney(holidayRateCents)}
                    amount={formatOptionalMoney(holidayPayCents)}
                  />
                  <div className="grid grid-cols-[1.6fr_0.8fr_1fr_1fr] text-xs font-semibold">
                    <div className="col-span-3 border-r border-zinc-200 px-3 py-2 uppercase">
                      Gross Pay
                    </div>
                    <div className="px-3 py-2 text-center">
                      {formatMoney(row.grossPayCents)}
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-5 md:grid-cols-[1.35fr_1fr]">
                <div>
                  <h4 className="border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-semibold uppercase">
                    Deductions
                  </h4>
                  <div className="border-x border-b border-zinc-300">
                    <div className="grid grid-cols-[1fr_auto] border-b border-zinc-200 px-3 py-2 text-[11px] font-semibold uppercase">
                      <span>Description</span>
                      <span>Amount (PHP)</span>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] border-b border-zinc-200 px-3 py-3 text-xs">
                      <span>
                        {row.deductionsCents > 0
                          ? "Undertime deduction"
                          : "No deductions"}
                      </span>
                      <span>
                        {row.deductionsCents > 0
                          ? formatMoney(row.deductionsCents)
                          : ""}
                      </span>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] px-3 py-3 text-xs font-semibold uppercase">
                      <span>Total Deductions</span>
                      <span>{formatMoney(row.deductionsCents)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center border border-zinc-300 bg-zinc-50 p-6 text-center">
                  <div>
                    <div className="mx-auto grid size-12 place-items-center rounded-full bg-white ring-1 ring-zinc-200">
                      <BanknoteIcon className="size-5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold uppercase">
                      Net Pay
                    </p>
                    <p className="mt-2 text-3xl font-semibold">
                      {formatMoney(row.netPayCents)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Take home pay
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-3 border-t border-zinc-300 pt-4">
                <h4 className="text-xs font-semibold uppercase">Summary</h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <PayslipMetric
                    icon={<ClockIcon className="size-4" />}
                    label="Regular Hours"
                    value={formatHours(row.regularMinutes)}
                  />
                  <PayslipMetric
                    icon={<TimerIcon className="size-4" />}
                    label="Overtime"
                    value={formatHours(row.overtimeMinutes)}
                  />
                  <PayslipMetric
                    icon={<ClockIcon className="size-4" />}
                    label="Undertime"
                    value={formatHours(row.undertimeMinutes)}
                  />
                  <PayslipMetric
                    icon={<CalendarDaysIcon className="size-4" />}
                    label="Holiday Hours"
                    value={formatHours(row.holidayMinutes)}
                  />
                  <PayslipMetric
                    icon={<IdCardIcon className="size-4" />}
                    label="Gross Pay"
                    value={formatMoney(row.grossPayCents)}
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <PayslipMetric
                    icon={<FileTextIcon className="size-4" />}
                    label="Total Deductions"
                    value={formatMoney(row.deductionsCents)}
                  />
                  <PayslipMetric
                    icon={<BanknoteIcon className="size-4" />}
                    label="Net Pay"
                    value={formatMoney(row.netPayCents)}
                  />
                </div>
              </section>

              <section className="border-t border-zinc-300 pt-4">
                <h4 className="text-xs font-semibold uppercase">
                  Notes
                </h4>
                <p className="mt-3 text-xs text-zinc-700">
                  {row.notes || "No payroll notes."}
                </p>
              </section>

              <div className="payslip-print-actions flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <LandmarkIcon className="size-4" />
                  This payslip is system generated.
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="inline-flex h-9 items-center justify-center gap-2 border px-3 text-sm font-medium"
                  >
                    <DownloadIcon className="size-4" />
                    Download PDF
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="inline-flex h-9 items-center justify-center gap-2 px-3 text-sm font-medium"
                  >
                    <FileSpreadsheetIcon className="size-4" />
                    Export CSV
                  </Button>
                </div>
              </div>
              <footer className="grid gap-8 border-t border-zinc-300 pt-5 text-[11px] text-zinc-700 sm:grid-cols-[1fr_1fr]">
                <div className="space-y-1">
                  <p>
                    Prepared by:{" "}
                    <span className="font-semibold text-zinc-950">
                      System Generated
                    </span>
                  </p>
                  <p>
                    Date Generated:{" "}
                    <span className="font-semibold text-zinc-950">
                      {generatedAt}
                    </span>
                  </p>
                </div>
                <div className="flex items-end justify-end">
                  <div className="w-64 border-t border-dotted border-zinc-600 pt-2 text-center">
                    Employee Signature
                  </div>
                </div>
              </footer>
            </article>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function PayslipInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 text-sm">
      <div className="mt-0.5 text-zinc-700">{icon}</div>
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function PayslipMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-zinc-200 p-3">
      <div className="flex items-center gap-2 text-xs">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-3 text-base font-semibold">{value}</p>
    </div>
  );
}

function PayslipEarningLine({
  label,
  hours,
  rate,
  amount,
}: {
  label: string;
  hours: string;
  rate: string;
  amount: string;
}) {
  return (
    <div className="grid grid-cols-[1.6fr_0.8fr_1fr_1fr] border-b border-zinc-200 text-xs last:border-b-0">
      <div className="border-r border-zinc-200 px-3 py-2">{label}</div>
      <div className="border-r border-zinc-200 px-3 py-2 text-center">
        {hours}
      </div>
      <div className="border-r border-zinc-200 px-3 py-2 text-center">
        {rate}
      </div>
      <div className="px-3 py-2 text-center">{amount}</div>
    </div>
  );
}

const payslipPrintStyles = `
@media print {
  @page {
    size: A4;
    margin: 12mm;
  }

  body * {
    visibility: hidden !important;
  }

  .payslip-print-root,
  .payslip-print-root * {
    visibility: visible !important;
  }

  .payslip-print-root {
    position: fixed !important;
    inset: 0 !important;
    width: 100% !important;
    max-width: none !important;
    max-height: none !important;
    overflow: visible !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: #fff !important;
    color: #09090b !important;
    box-shadow: none !important;
    transform: none !important;
  }

  .payslip-print-scroll {
    max-height: none !important;
    overflow: visible !important;
  }

  .payslip-document {
    width: 100% !important;
    padding: 0 !important;
  }

  .payslip-print-actions,
  .payslip-screen-header,
  button[aria-label="Close"] {
    display: none !important;
  }

  .payslip-document,
  .payslip-document section,
  .payslip-document header,
  .payslip-document footer {
    break-inside: avoid !important;
  }
}
`;
