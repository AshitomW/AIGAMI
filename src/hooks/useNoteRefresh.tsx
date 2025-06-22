"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useNoteRefresh() {
  const router = useRouter();

  const refreshNotes = useCallback(() => {
    router.refresh();
  }, [router]);

  return { refreshNotes };
}
