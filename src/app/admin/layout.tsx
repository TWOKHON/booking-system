import { AdminHeader } from "@/components/custom/admin/AdminHeader";
import { AdminSidebar } from "@/components/custom/admin/AdminSidebar";
import { ThemeSwitcher } from "@/components/custom/ThemeSwitcher";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/custom/ThemeProvider";
import { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider className={cn("[--app-wrapper-max-width:80rem]")}>
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          <div
            className={cn(
              "flex flex-1 flex-col p-4 md:p-6",
              "mx-auto w-full max-w-(--app-wrapper-max-width)",
            )}
          >
            <ThemeSwitcher />
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AdminLayout;
