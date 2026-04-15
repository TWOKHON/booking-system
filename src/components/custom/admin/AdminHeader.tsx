import { cn } from "@/lib/utils";
import { DecorIcon } from "@/components/ui/decor-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AdminBreadcrumbs } from "@/components/custom/admin/AdminBreadcrumb";
import { navLinks } from "@/components/custom/admin/AdminAppShared";
import { NavUser } from "@/components/custom/NavUser";
import { SendIcon, BellIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const activeItem = navLinks.find((item) => item.isActive);

export function AdminHeader() {
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
        <Button size="icon-sm" variant="outline">
          <SendIcon />
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
