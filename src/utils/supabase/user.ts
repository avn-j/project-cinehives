import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import prisma from "../../../prisma/client";

export async function getSupabaseUser() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  return data.user;
}
