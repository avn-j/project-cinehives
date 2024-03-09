"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../../../../prisma/client";
import { getUser } from "@/lib/authentication-functions";

export async function handleLike(mediaId: number) {
  const user = await getUser();

  if (!user) return null;

  await prisma.likes.create({
    data: {
      user_id: user.id,
      media_id: mediaId,
    },
  });

  revalidatePath("/home");
}

export async function handleUnlike(mediaId: number) {
  const user = await getUser();

  if (!user) return null;

  await prisma.likes.deleteMany({
    where: {
      user_id: user.id,
      media_id: mediaId,
    },
  });

  revalidatePath("/home");
}
