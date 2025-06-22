import React from "react";
import CustomSidebar from "./_components/CustomSidebar";
import NoteProvider from "@/providers/noteprovider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NoteProvider>
      <div className="flex min-h-screen">
        <CustomSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </NoteProvider>
  );
}
