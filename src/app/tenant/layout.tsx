import { ReactNode } from "react";
import { ThemeProvider } from "@/components/custom/ThemeProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/custom/ThemeSwitcher";
import { TenantSidebar } from "@/components/custom/tenant/TenantSidebar";
import { TenantHeader } from "@/components/custom/tenant/TenantHeader";
import { cn } from "@/lib/utils";

const TenantLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider className={cn("[--app-wrapper-max-width:80rem]")}>
        <TenantSidebar />
        <SidebarInset>
          <TenantHeader />
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

export default TenantLayout;
