import prisma from "../../prisma/client";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

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
