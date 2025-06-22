import React from "react";
import CustomSidebar from "./_components/CustomSidebar";
import NoteProvider from "@/providers/noteprovider";
import { SessionProvider } from "@/providers/sessionprovider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NoteProvider>
        <div className="flex min-h-screen">
          <CustomSidebar />
          <main className="flex-1 pl-64 p-6">{children}</main>
        </div>
      </NoteProvider>
    </SessionProvider>
  );
}
