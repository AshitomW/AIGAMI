"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { deleteNoteAction } from "@/lib/actions/notes";
import { Note } from "@prisma/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import DeleteNoteButton from "./DeleteNoteButton";
import NewNoteButton from "./NewNoteButton";

type Props = {
  initialNotes: Note[];
  user: User | null;
};

export default function NotesList({ initialNotes, user }: Props) {
  const [notes, setNotes] = useState(initialNotes);

  const deleteNoteLocally = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const formatNotePreview = (text: string) => {
    return text.length > 100
      ? text.substring(0, 100) + "..."
      : text || "Empty Note";
  };

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Your Notes</h1>

        {notes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No notes yet</p>
              <NewNoteButton user={user} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Card
                key={note.id}
                className="group/item relative hover:shadow-md transition-shadow"
              >
                <Link href={`/notes?noteId=${note.id}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-muted-foreground">
                        {note.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-4">
                      {formatNotePreview(note.text)}
                    </p>
                  </CardContent>
                </Link>
                <DeleteNoteButton
                  noteId={note.id}
                  deleteNoteLocally={deleteNoteLocally}
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
