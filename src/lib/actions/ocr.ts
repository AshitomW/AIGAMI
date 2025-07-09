"use server";

import { getUser } from "@/utils/supabase/server";
import { createNoteAction, updateNoteAction } from "./notes";
import { v4 as uuidv4 } from "uuid";

const OCR_API_URL = process.env.OCR_API_URL || "http://localhost:8900";

export async function extractTextFromDocument(formData: FormData) {
  const user = await getUser();
  if (!user) throw new Error("Log in to use OCR features");

  try {
    const response = await fetch(`${OCR_API_URL}/extract-text`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = "Failed to extract text";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return {
      success: true,
      text: result.text,
      filename: result.filename,
      characterCount: result.character_count,
      wordCount: result.word_count,
      confidence: result.confidence,
    };
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to process document"
    );
  }
}

export async function extractTextFromURL(url: string) {
  const user = await getUser();
  if (!user) throw new Error("Log in to use OCR features");

  try {
    const response = await fetch(`${OCR_API_URL}/extract-from-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to extract text from URL";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return {
      success: true,
      text: result.text,
      filename:
        result.filename ||
        new URL(url).pathname.split("/").pop() ||
        "url-document",
      characterCount: result.character_count,
      wordCount: result.word_count,
      confidence: result.confidence,
      url: url,
    };
  } catch (error) {
    console.error("OCR URL Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to process URL"
    );
  }
}

export async function createNoteFromOCR(
  text: string,
  filename: string,
  sourceUrl?: string
) {
  const user = await getUser();
  if (!user) throw new Error("Log in to create notes");

  const noteId = uuidv4();
  const source = sourceUrl ? `URL: ${sourceUrl}` : filename;
  const noteText = `# Imported from: ${source}\n\n${text}`;

  // Create the note first
  const result = await createNoteAction(noteId);
  if (result.errorMessage) {
    throw new Error(result.errorMessage);
  }

  // Update the note with extracted text using the existing server action
  const updateResult = await updateNoteAction(noteId, noteText);
  if (updateResult.errorMessage) {
    throw new Error(updateResult.errorMessage);
  }

  return { noteId, success: true };
}
