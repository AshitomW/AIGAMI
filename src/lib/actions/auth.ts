"use server";

import { createClient } from "@/utils/supabase/server";
import { handleError } from "../utils";
import { prisma } from "@/db/prisma";

export async function signInAction(email: string, password: string) {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signInWithPassword({ email, password });

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
}

export async function signUpAction(email: string, password: string) {
  try {
    const { auth } = await createClient();
    const { data, error } = await auth.signUp({ email, password });

    const userId = data.user?.id;

    if (!userId) throw new Error("Error Signing Up");

    // Add User To The Database;

    await prisma.user.create({
      data: {
        id: userId,
        email,
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
}
