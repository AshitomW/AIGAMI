import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import AppSidebar from "./_components/AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
