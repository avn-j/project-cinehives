import { z } from "zod";

export const loginFormSchema = z
  .object({
    email: z.string().email(),
    // .min(2, { message: "Username needs to be longer than 2 characters." }),
    password: z.string().min(1, { message: "Password is required" }),
  })
  .required();
