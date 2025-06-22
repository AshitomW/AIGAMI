import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { prisma } from "@/db/prisma";
import { getUserNotes } from "@/lib/actions/notes";
import { getUser } from "@/utils/supabase/server";
import { Note } from "@prisma/client";
import React from "react";

export default async function AppSidebar() {
  const user = await getUser();
  let notes: Note[] | Object = [];

  if (user) {
    notes = await getUserNotes(user.id);
  }

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
