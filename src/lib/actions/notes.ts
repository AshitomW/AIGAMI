"use server";

import { prisma } from "@/db/prisma";
import { handleError } from "../utils";
import { getUser } from "@/utils/supabase/server";

export async function getUserNotes(userId: string) {
  try {
    let notes = await prisma.note.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return notes;
  } catch (error) {
    return handleError(error);
  }
}

export const updateNoteAction = async function (noteId: string, text: string) {
  try {
    const user = await getUser();
    if (!user) throw Error("Get Logged In To Update The Note");

    await prisma.note.update({
      where: { id: noteId },
      data: { text },
    });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const createNoteAction = async function (noteId: string) {
  try {
    const user = await getUser();
    if (!user) throw Error("Get Logged In To Create The Note");

    await prisma.note.create({
      data: {
        id: noteId,
        authorId: user.id,
        text: "",
      },
    });
    return { errorMessage: null };
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const deleteNoteAction = async function (noteId: string) {
  try {
    const user = await getUser();
    if (!user) throw Error("Get Logged In To Delete The Note");

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });
    return { errorMessage: null };
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};
