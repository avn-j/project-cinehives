"use server";

import { loginFormSchema } from "@/schemas/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";

export async function login(values: z.infer<typeof loginFormSchema>) {
  const result = loginFormSchema.safeParse(values);
  if (result.success) {
    const supabase = createClient();
    result.data;

    const loginData = {
      email: result.data.email,
      password: result.data.password,
    };

    const { error } = await supabase.auth.signInWithPassword(loginData);

    if (error) {
      console.log(error.message);
      return;
    }

    redirect("/home");
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
