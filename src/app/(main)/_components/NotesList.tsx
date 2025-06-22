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
import { FileText } from "lucide-react";

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
    return text.length > 150
      ? text.substring(0, 150) + "..."
      : text || "Empty Note";
  };

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="w-full max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Your Notes</h1>

        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-6 text-lg">No notes yet</p>
            <NewNoteButton user={user} />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {notes.map((note) => (
              <Card
                key={note.id}
                className="group/item relative hover:shadow-lg transition-all duration-200 h-50 w-[300px] flex flex-col overflow-hidden"
              >
                <Link
                  href={`/notes?noteId=${note.id}`}
                  className="flex-1 flex flex-col h-full p-0"
                >
                  <CardHeader className="pb-3 flex-shrink-0 px-4 pt-4">
                    <div className="flex items-start justify-between">
                      <p className="text-xs text-muted-foreground">
                        {note.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 px-4 pb-4 flex flex-col justify-start overflow-hidden">
                    <p className="text-sm text-gray-700 line-clamp-6 leading-relaxed">
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
