"use server";

import { createClient } from "@/lib/supabase/server";
import { registerFormSchema, verifyFormSchema } from "@/schemas/schemas";
import { z } from "zod";
import { redirect } from "next/navigation";

export async function register(values: z.infer<typeof registerFormSchema>) {
  const result = registerFormSchema.safeParse(values);

  if (!result.success) return "Fatal error: Could not register account";
  if (!(result.data.password === result.data.confirmPassword))
    return "Passwords do not match";

  const supabase = createClient();

  const registerData = {
    email: result.data.email,
    password: result.data.password,
  };

  const { error, data } = await supabase.auth.signUp(registerData);

  console.log(error?.message);
  console.log(data);

  if (data && data.user) {
    if (data.user.role == "")
      return "An account with that email already exists.";
  }

  if (error) return error.message;
  return null;
}

export async function verify(
  values: z.infer<typeof verifyFormSchema>,
  email: string,
) {
  const result = verifyFormSchema.safeParse(values);

  if (!result.success) return "Fatal error: Could not verify account";

  const token = result.data.code;

  const supabase = createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    type: "email",
    token,
  });

  if (error) return error.message;

  redirect("/");
}
