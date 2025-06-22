"use server";

import { createClient, getUser } from "@/utils/supabase/server";
import { handleError } from "../utils";
import { prisma } from "@/db/prisma";
import { DEFAULT_AVATAR_IMAGE } from "@/constants";

export async function updatePasswordAction(
  currentPassword: string,
  newPassword: string
) {
  try {
    const { auth } = await createClient();

    const {
      data: { user },
      error: userError,
    } = await auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    const { error: verifyError } = await auth.signInWithPassword({
      email: user.email!.toLowerCase(),
      password: currentPassword,
    });

    if (verifyError) {
      throw new Error("Current password is incorrect");
    }

    const { error: updateError } = await auth.updateUser({
      password: newPassword,
    });

    if (updateError) throw updateError;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
}

export async function uploadAvatarAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) throw new Error("User not authenticated");

    const file = formData.get("avatar") as File;
    if (!file) throw new Error("No file provided");

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image."
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error(
        "File size too large. Please upload an image smaller than 5MB."
      );
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: publicUrl },
    });

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        avatarUrl: publicUrl,
      },
    });

    if (updateError)
      console.error("Error updating user metadata:", updateError);

    return { errorMessage: null, avatarUrl: publicUrl };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteAvatarAction() {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) throw new Error("User not authenticated");

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { avatarUrl: true },
    });

    if (
      currentUser?.avatarUrl &&
      currentUser.avatarUrl !== DEFAULT_AVATAR_IMAGE
    ) {
      const urlParts = currentUser.avatarUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `avatars/${fileName}`;

      const { error: deleteError } = await supabase.storage
        .from("avatars")
        .remove([filePath]);

      if (deleteError) console.error("Error deleting old avatar:", deleteError);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: DEFAULT_AVATAR_IMAGE },
    });

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        avatarUrl: DEFAULT_AVATAR_IMAGE,
      },
    });

    if (updateError)
      console.error("Error updating user metadata:", updateError);

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
}

export const GetUserDetails = async function () {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("Must be authenticated to upload file");
    }

    const userDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        avatarUrl: true,
      },
    });

    console.log(userDetails);

    if (!userDetails) {
      throw new Error("User not found");
    }

    return userDetails;
  } catch (error) {
    return handleError(error);
  }
};
