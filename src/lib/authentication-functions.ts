"use server";

import prisma from "../../prisma/client";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  return data.user;
}

export async function getUserProfile(user: User) {
  let profile = await prisma.profile.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!profile?.profileCreated) return null;

  return profile;
}

export async function checkProfileStarted(userId: string) {
  const profileStarted = await prisma.profile.findFirst({
    where: {
      id: userId,
      firstName: { not: "" },
    },
  });

  if (profileStarted) return true;
  return false;
}

export async function setProfileFinished(userId: string) {
  await prisma.profile.update({
    where: {
      id: userId,
    },
    data: {
      profileCreated: true,
    },
  });

  redirect("/home");
}
