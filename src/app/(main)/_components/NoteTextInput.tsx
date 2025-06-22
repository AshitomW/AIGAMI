"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounceTimeout } from "@/constants";
import useNote from "@/hooks/useNote";
import { updateNoteAction } from "@/lib/actions/notes";
import { useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Minus, Plus, Type } from "lucide-react";
import SummarizeNoteButton from "../_components/summmarizeNoteButton";

type Props = {
  noteId: string;
  startingNoteText: string;
};

let updateTimeout: NodeJS.Timeout;

const fontFamilies = [
  {
    label: "Serif",
    value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    label: "Sans Serif",
    value:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  {
    label: "Monospace",
    value:
      'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
  {
    label: "Inter",
    value: "Inter, ui-sans-serif, system-ui, sans-serif",
  },
  {
    label: "Playfair",
    value: '"Playfair Display", ui-serif, Georgia, serif',
  },
];

function NoteTextInput({ noteId, startingNoteText }: Props) {
  const noteIdParams = useSearchParams().get("noteId") || "";
  const { noteText, setNoteText } = useNote();
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState(fontFamilies[0].value);

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

  const adjustFontSize = (delta: number) => {
    setFontSize((prev) => Math.max(12, Math.min(24, prev + delta)));
  };

  return (
    <div className="w-full max-w-4xl space-y-4">
      {/* Font Controls */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Font
          </span>
        </div>

        <Select value={fontFamily} onValueChange={setFontFamily}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustFontSize(-1)}
            disabled={fontSize <= 12}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="text-sm font-medium w-8 text-center">
            {fontSize}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustFontSize(1)}
            disabled={fontSize >= 24}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* Summarize Button */}
        <div className="ml-auto">
          <SummarizeNoteButton noteId={noteId} noteText={noteText} />
        </div>
      </div>

      {/* Enhanced Textarea */}
      <div className="relative">
        <Textarea
          value={noteText}
          onChange={handleNoteUpdate}
          placeholder="Start writing your thoughts here..."
          className="
            w-full 
            min-h-[calc(100vh-200px)] 
            resize-none 
            border-0 
            bg-white 
            p-8 
            text-lg 
            leading-relaxed 
            shadow-lg 
            rounded-lg
            placeholder:text-gray-400 
            focus-visible:ring-2 
            focus-visible:ring-blue-500/20 
            focus-visible:ring-offset-0
            focus-visible:border-blue-500/30
            transition-all
            duration-200
            hover:shadow-xl
            dark:bg-gray-800
            dark:text-white
            dark:placeholder:text-gray-500
          "
          style={{
            fontFamily: fontFamily,
            fontSize: `${fontSize}px`,
            lineHeight: "1.75",
          }}
        />

        {/* Word count indicator */}
        <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded">
          {
            noteText
              .trim()
              .split(/\s+/)
              .filter((word) => word.length > 0).length
          }{" "}
          words
        </div>
      </div>
    </div>
  );
}

export default NoteTextInput;
