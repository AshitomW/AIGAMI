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

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY! });

  const contents = [];

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

  const systemPrompt = `You are a helpful assistant that answers questions about a user's notes.
Assume all questions are related to the user's notes.
Format your response using HTML for better readability:
- Use <h2>, <h3>, <h4> for headers
- Use <p> for paragraphs
- Use <ul> and <li> for bullet points
- Use <ol> and <li> for numbered lists
- Use <strong> for bold text
- Use <em> for italic text
- Use <br> for line breaks where needed
Make sure that your answers are well-structured and easy to read.
Here are the user's notes:
${formattedNotes}`;

  const latestQuestion = newQuestions[newQuestions.length - 1];

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

  const formattedResponse = aiResponse
    ?.replace(/^```html\s*/i, "")
    ?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    ?.replace(/\*(.*?)\*/g, "<em>$1</em>")
    ?.replace(/^#{1,6}\s+(.+)$/gm, (match, text) => {
      const level = match.indexOf(" ");
      return `<h${Math.min(level, 6)}>${text}</h${Math.min(level, 6)}>`;
    })
    ?.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")
    ?.replace(/^[\-\*\+]\s+(.+)$/gm, "<li>$1</li>")
    ?.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    ?.replace(/\n\n/g, "</p><p>")
    ?.replace(/^(.+)$/gm, "<p>$1</p>")
    ?.replace(/<p><\/p>/g, "")
    ?.replace(/<p>(<[uo]l>)/g, "$1")
    ?.replace(/(<\/[uo]l>)<\/p>/g, "$1");

  return formattedResponse || "Problem Occurred";
}
