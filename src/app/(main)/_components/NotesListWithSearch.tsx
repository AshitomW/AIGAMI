"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import NotesList from "./NotesList";

type Note = {
  id: string;
  text: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

type Props = {
  initialNotes: Note[];
  user: any;
};

export default function NotesListWithSearch({ initialNotes, user }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return initialNotes;
    }

    return initialNotes.filter((note) =>
      note.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialNotes, searchQuery]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          {filteredNotes.length === 0
            ? `No notes found for "${searchQuery}"`
            : `Found ${filteredNotes.length} note${
                filteredNotes.length === 1 ? "" : "s"
              } for "${searchQuery}"`}
          <button
            onClick={() => setSearchQuery("")}
            className="ml-2 text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      <NotesList
        initialNotes={filteredNotes}
        user={user}
        key={`${searchQuery}-${filteredNotes.length}`}
      />
    </div>
  );
}
