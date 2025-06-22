import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarGroupContent } from "./SidebarGroupContent";
import { getUserNotes } from "@/lib/actions/notes";
import { getUser } from "@/utils/supabase/server";
import { Note } from "@prisma/client";
import Link from "next/link";
import React from "react";

export default async function AppSidebar() {
  const user = await getUser();
  let notes: Note[] = [];

  if (user) {
    const result = await getUserNotes(user.id);
    if (Array.isArray(result)) {
      notes = result;
    } else {
      notes = [];
    }
  }

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mt-2 text-large">
            {user ? (
              "Your Notes"
            ) : (
              <p>
                <Link href="/auth/login" className="underline">
                  :Login
                </Link>
                To See Your Note
              </p>
            )}
          </SidebarGroupLabel>
          {user && <SidebarGroupContent notes={notes} />}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
