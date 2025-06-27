"use server";
import { getUser } from "@/utils/supabase/server";
import { prisma } from "@/db/prisma";
import { GoogleGenAI } from "@google/genai";

export async function askAIAboutNotes(
  newQuestions: string[],
  responses: string[]
) {
  const user = await getUser();
  if (!user) throw new Error("Log In To Get Access To Our AI");

  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    select: { text: true, createdAt: true, updatedAt: true },
  });

  if (notes.length === 0) return "No Notes Yet";

  const formattedNotes = notes
    .map((note) => {
      return `
          Text: ${note.text}
          Created At: ${note.createdAt}
          Last Updated: ${note.updatedAt}
        `.trim();
    })
    .join("\n\n");

  // Initialize Gemini AI
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY! });

  // Build conversation history
  const contents = [];

  // Add previous Q&A pairs to conversation
  for (
    let i = 0;
    i < Math.min(newQuestions.length - 1, responses.length);
    i++
  ) {
    contents.push({
      role: "user",
      parts: [{ text: newQuestions[i] }],
    });
    contents.push({
      role: "model",
      parts: [{ text: responses[i] }],
    });
  }

  // System prompt
  const systemPrompt = `You are a helpful assistant that answers questions about a user's notes.
Assume all questions are related to the user's notes.
Make sure that your answers are not too verbose and you speak succinctly.
Just provide plain text answers, Clear and Understandable.
Here are the user's notes:
${formattedNotes}`;

  // Get the latest question
  const latestQuestion = newQuestions[newQuestions.length - 1];

  // Add the current question with system prompt if it's the first message
  const currentPrompt =
    contents.length === 0
      ? `${systemPrompt}\n\nUser question: ${latestQuestion}`
      : latestQuestion;

  contents.push({
    role: "user",
    parts: [{ text: currentPrompt }],
  });

  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: contents,
  });

  const aiResponse = response.text;

  return aiResponse || "Problem Occured";
}
