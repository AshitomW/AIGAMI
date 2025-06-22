"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { summarizeNote } from "@/lib/actions/summarize";
import useNote from "@/hooks/useNote";

type Props = {
  noteId: string;
  noteText: string;
};

export default function SummarizeNoteButton({ noteId, noteText }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { setNoteText } = useNote();

  const handleSummarize = () => {
    if (!noteText.trim()) {
      toast.error("Cannot summarize empty note");
      return;
    }

    startTransition(async () => {
      try {
        const result = await summarizeNote(noteId);

        if (result.success) {
          setNoteText(result.summary || "");
          toast.success("Note summarized successfully!", {
            description: "Your note has been replaced with a concise summary.",
          });
          setOpen(false);
        }
      } catch (error) {
        toast.error("Failed to summarize note", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Summarize
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Summarize Note</DialogTitle>
          <DialogDescription>
            This will replace your current note with an AI-generated summary.
            This action cannot be undone. Are you sure you want to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSummarize}
            disabled={isPending || !noteText.trim()}
            className="gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Summarize Note
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
