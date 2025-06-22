"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteNoteAction } from "@/lib/actions/notes";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  noteId: string;
  deleteNoteLocally: (noteId: string) => void;
};

export default function DeleteNoteButton({ noteId, deleteNoteLocally }: Props) {
  const router = useRouter();
  const noteIdParam = useSearchParams().get("noteId") || "";
  const [isPending, startTransition] = useTransition();
  const handleDeleteNote = function () {
    startTransition(async () => {
      const { errorMessage } = await deleteNoteAction(noteId);
      if (!errorMessage) {
        toast.success("Note Deleted", {
          description: "Successfully Deleted The Node;",
        });

        deleteNoteLocally(noteId);

        if (noteId === noteIdParam) {
          router.replace("/notes");
        }
      } else {
        toast.error("Something Wrong Happened", {
          description: errorMessage,
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="absolute right-2 top-1/2 cursor-pointer -translate-y-1/2 size-7 opacity-0 p-0 group-hover/item:opacity-100 [&_svg]:size-3"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            note.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDeleteNote()}
            className="w-24 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
