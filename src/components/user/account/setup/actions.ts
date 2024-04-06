"use server";

import { setupFormSchemaServer } from "@/schemas/schemas";
import { createClient } from "@/lib/supabase/server";
import prisma from "../../../../../prisma/client";
import { createNewUserDiary, createNewWatchlist } from "@/lib/db-actions";

export async function updateProfile(formData: FormData) {
  const formValues = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    userName: formData.get("userName"),
    profilePicture: formData.get("profilePicture"),
    dateOfBirth: formData.get("dateOfBirth"),
    country: formData.get("country"),
  };
  const result = setupFormSchemaServer.safeParse(formValues);

  if (!result.success) return;

  const supabase = createClient();
  const userData = await supabase.auth.getUser();

  if (!userData.data.user) return;

  const userId = userData.data.user.id;
  const {
    firstName,
    lastName,
    userName,
    profilePicture,
    dateOfBirth,
    country,
  } = result.data;

  if (!profilePicture) return;

  const buffer = await (formValues.profilePicture as Blob).arrayBuffer();
  const array = new Uint8Array(buffer);
  const profilePictureAsFile = profilePicture as File;
  const fileExtension = profilePictureAsFile.name.split(".")[1];
  const uploadFilename = `${userId}/profile-image.${fileExtension}`;

  const uploadResponse = await supabase.storage
    .from("profile-pictures")
    .upload(uploadFilename, array, {
      contentType: profilePictureAsFile.type,
    });

  if (uploadResponse.error) return;

  const getResponse = supabase.storage
    .from("profile-pictures")
    .getPublicUrl(uploadResponse.data.path);

  const profilePicPublicUrl = getResponse.data.publicUrl;

  const data = await prisma.profile.update({
    where: {
      id: userId,
    },
    data: {
      firstName,
      lastName,
      username: userName,
      country,
      dateOfBirth: new Date(dateOfBirth),
      profilePictureURL: profilePicPublicUrl,
      profileStage: "ONBOARDING",
    },
  });

  createNewWatchlist(userId);
  createNewUserDiary(userId);
}

export async function checkUsernameValidity(username: string) {
  const profile = await prisma.profile.findFirst({
    where: {
      username: username,
    },
  });

  if (!profile) return true;
}
