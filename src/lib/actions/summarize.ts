"use server";
import { prisma } from "@/db/prisma";
import { getUser } from "@/utils/supabase/server";
import { GoogleGenAI } from "@google/genai";

export async function summarizeNote(noteId: string) {
  const user = await getUser();
  if (!user) throw new Error("Log In To Access AI Features");

  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      authorId: user.id,
    },
  });

  if (!note) throw new Error("Note not found");
  if (!note.text.trim()) throw new Error("Cannot summarize empty note");

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY! });

  const systemPrompt = `You are a helpful assistant that creates concise summaries of notes.
Please create a well-structured summary that:
- Captures the main points and key information
- Maintains the important details
- Uses clear, readable formatting
- Is significantly shorter than the original while preserving meaning

Please format your response in plain text without HTML tags.`;

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `${systemPrompt}\n\nOriginal note to summarize:\n${note.text}`,
        },
      ],
    },
  ];

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: contents,
    });

    const summary = response.text;

    await prisma.note.update({
      where: { id: noteId },
      data: { text: summary },
    });

    return { success: true, summary };
  } catch (error) {
    console.error("Summarize error:", error);
    throw new Error("Failed to generate summary");
  }
}
