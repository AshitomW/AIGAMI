"use client";

import { Note } from "@prisma/client";
import {
  SidebarGroupContent as SidebarGroupCN,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectNoteButton from "./SelectNoteButton";
import DeleteNoteButton from "./DeleteNoteButton";
type Props = {
  notes: Note[];
};

export function SidebarGroupContent({ notes }: Props) {
  const [searchText, setSearchText] = useState("");
  const [localNotes, setLocalNotes] = useState(notes);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const fuse = useMemo(
    function () {
      return new Fuse(localNotes, {
        keys: ["text"],
        threshold: 0.4,
      });
    },
    [localNotes]
  );

  const filteredNotes = searchText
    ? fuse.search(searchText).map((result) => result.item)
    : localNotes;

  const deleteNoteLocally = function (noteId: string) {
    setLocalNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== noteId)
    );
  };

  return (
    <SidebarGroupCN>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-2 size-2" />
        <Input
          className="bg-muted pl-8"
          placeholder="search your notes"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <SidebarMenu className="mt-4">
        {filteredNotes.map((note) => {
          return (
            <SidebarMenuItem key={note.id} className="group/item">
              <SelectNoteButton note={note} />
              <DeleteNoteButton
                noteId={note.id}
                deleteNoteLocally={deleteNoteLocally}
              />
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroupCN>
  );
}
