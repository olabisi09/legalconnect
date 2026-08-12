import type { ReactNode } from "react";
import { AppSidebar } from "./test-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="font-plexmono text-[11px] tracking-wide text-muted-foreground">
            LEGALCONNECT / DASHBOARD
          </span>
        </header>
        <main className="flex-1 bg-background px-6 py-8 md:px-10">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
