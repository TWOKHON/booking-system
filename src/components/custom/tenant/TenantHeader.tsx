"use client";

import { cn } from "@/lib/utils";
import { DecorIcon } from "@/components/ui/decor-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AdminBreadcrumbs } from "@/components/custom/admin/AdminBreadcrumb";
import { getActiveTenantNavItem } from "@/components/custom/tenant/TenantMvpShared";
import { NavUser } from "@/components/custom/NavUser";
import { BellIcon, CalendarClockIcon, SparklesIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function TenantHeader() {
  const pathname = usePathname();
  const activeItem = getActiveTenantNavItem(pathname);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 md:px-6",
        "bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50",
      )}
    >
      <DecorIcon className="hidden md:block" position="bottom-left" />
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <Separator
          className="mr-2 h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <AdminBreadcrumbs page={activeItem} />
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" className="hidden md:inline-flex">
          <CalendarClockIcon className="size-4" />
          Shift plan
        </Button>
        <Button size="icon-sm" variant="outline">
          <SparklesIcon />
        </Button>
        <Button aria-label="Notifications" size="icon-sm" variant="outline">
          <BellIcon />
        </Button>
        <Separator
          className="h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <NavUser />
      </div>
    </header>
  );
}
