"use client";
import { Textarea } from "@/components/ui/textarea";
import { debounceTimeout } from "@/constants";
import useNote from "@/hooks/useNote";
import { updateNoteAction } from "@/lib/actions/notes";
import { useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect } from "react";

type Props = {
  noteId: string;
  startingNoteText: string;
};

let updateTimeout: NodeJS.Timeout;

function NoteTextInput({ noteId, startingNoteText }: Props) {
  const noteIdParams = useSearchParams().get("noteId") || "";
  const { noteText, setNoteText } = useNote();

  useEffect(
    function () {
      if (noteIdParams === noteId) {
        setNoteText(startingNoteText);
      }
    },
    [startingNoteText, noteIdParams, noteId, setNoteText]
  );

  const handleNoteUpdate = function (e: ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value;

    setNoteText(text);
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(function () {
      updateNoteAction(noteId, text);
    }, debounceTimeout);
  };

  return (
    <Textarea
      value={noteText}
      onChange={handleNoteUpdate}
      className="mb-4 h-full max-w-4xl resize-none border p-4 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  );
}

export default NoteTextInput;
