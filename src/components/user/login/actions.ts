"use server";

import { loginFormSchema } from "@/schemas/schemas";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export async function login(values: z.infer<typeof loginFormSchema>) {
  const result = loginFormSchema.safeParse(values);

  if (!result.success) return "Fatal error: Could not login";

  const supabase = createClient();

  const loginData = {
    email: result.data.email,
    password: result.data.password,
  };

  const { error } = await supabase.auth.signInWithPassword(loginData);

  if (error) return error.message;

  redirect("/home");
}
