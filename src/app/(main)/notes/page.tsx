import { prisma } from "@/db/prisma";
import { getUser } from "@/utils/supabase/server";
import React from "react";
import AIChat from "../_components/AIChat";
import NewNoteButton from "../_components/NewNoteButton";
import NoteTextInput from "../_components/NoteTextInput";
import NotesListWithSearch from "../_components/NotesListWithSearch";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function page({ searchParams }: Props) {
  const params = await searchParams;
  const noteIdParams = params.noteId;

  const noteId = Array.isArray(noteIdParams)
    ? noteIdParams[0]
    : noteIdParams || "";

  const user = await getUser();

  const userNotes = await prisma.note.findMany({
    where: {
      authorId: user?.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!noteId) {
    return (
      <div className="flex h-full flex-col items-center gap-4">
        <div className="flex w-full justify-end gap-2">
          <AIChat user={user} />
          <NewNoteButton user={user} />
        </div>

        <NotesListWithSearch initialNotes={userNotes} user={user} />
      </div>
    );
  }

  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      authorId: user?.id,
    },
  });

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-between gap-2">
        <Button variant="outline" asChild>
          <Link href="/notes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notes
          </Link>
        </Button>
        <div className="flex gap-2">
          <AIChat user={user} />
          <NewNoteButton user={user} />
        </div>
      </div>

      <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
    </div>
  );
}
