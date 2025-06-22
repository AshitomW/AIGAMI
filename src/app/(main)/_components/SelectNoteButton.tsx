"use client";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import useNote from "@/hooks/useNote";
import { Note } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
  note: Note;
};

export default function SelectNoteButton({ note }: Props) {
  const noteId = useSearchParams().get("noteId") || "";

  const { noteText: selectedNoteText } = useNote();
  const [localNoteText, setLocalNoteText] = useState(note.text);
  const [shouldUseGlobalNoteText, setShouldUseGlobalNoteText] = useState(false);

  useEffect(
    function () {
      if (noteId == note.id) {
        setShouldUseGlobalNoteText(true);
      } else {
        setShouldUseGlobalNoteText(false);
      }
    },
    [note, note.id]
  );

  useEffect(
    function () {
      if (shouldUseGlobalNoteText) {
        setLocalNoteText(selectedNoteText);
      }
    },
    [selectedNoteText, shouldUseGlobalNoteText]
  );
  const blankNoteText = "Empty Note";
  let noteText = localNoteText || blankNoteText;
  if (shouldUseGlobalNoteText) {
    noteText = selectedNoteText || blankNoteText;
  }

  return (
    <SidebarMenuButton
      asChild
      className={`items-start gap-0 pr-12 ${
        note.id === noteId ? "bg-sidebar-accent/50" : ""
      }`}
    >
      <Link href={`/notes/?noteId=${note.id}`} className="flex h-fit flex-col">
        <p className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap">
          {noteText}
        </p>
        <p className="text-xs text-muted-foreground">
          {note.updatedAt.toLocaleDateString()}
        </p>
      </Link>
    </SidebarMenuButton>
  );
}
