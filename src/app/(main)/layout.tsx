import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import AppSidebar from "./_components/AppSidebar";
import NoteProvider from "@/providers/noteprovider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NoteProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </NoteProvider>
  );
}
