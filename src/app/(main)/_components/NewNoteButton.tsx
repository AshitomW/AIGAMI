"use client";
import { Button } from "@/components/ui/button";
import { createNoteAction } from "@/lib/actions/notes";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type Props = {
  user: User | null;
};
function NewNoteButton({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleNewNoteAddition = async function () {
    if (!user) {
      router.push("/login");
    } else {
      setLoading(true);
      const uuid = uuidv4();
      await createNoteAction(uuid);
      router.push(`/notes/?noteId=${uuid}`);

      toast.success("New Note Created !", {
        description: "You have screated a new note",
      });

      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleNewNoteAddition}
      variant="secondary"
      className="w-24"
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : "New Note"}
    </Button>
  );
}

export default NewNoteButton;
