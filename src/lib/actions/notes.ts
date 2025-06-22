"use server";

import { prisma } from "@/db/prisma";
import { handleError } from "../utils";

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
