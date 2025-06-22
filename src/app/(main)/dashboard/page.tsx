import { prisma } from "@/db/prisma";
import { getUser } from "@/utils/supabase/server";
import React from "react";
import AIChat from "../_components/AIChat";
import NewNoteButton from "../_components/NewNoteButton";
import NoteTextInput from "../_components/NoteTextInput";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function page({ searchParams }: Props) {
  const noteIdParams = (await searchParams).noteId;

  const noteId = Array.isArray(noteIdParams)
    ? noteIdParams![0]
    : noteIdParams || "";
  const user = await getUser();

  // refactor this
  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      authorId: user?.id,
    },
  });

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AIChat user={user} />
        <NewNoteButton user={user} />
      </div>

      <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
    </div>
  );
}
