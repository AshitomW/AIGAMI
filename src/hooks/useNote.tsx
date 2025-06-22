"use client";

import { NoteProviderContext } from "@/providers/noteprovider";
import { useContext } from "react";

function useNote() {
  const context = useContext(NoteProviderContext);
  if (!context) {
    throw Error("Must be used within a note provider");
  }

  return context;
}

export default useNote;
