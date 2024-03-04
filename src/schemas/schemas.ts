import { z } from "zod";

const passwordRegex = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
);

export const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Must be a valid email " })
    .min(1, { message: "No email entered" }),
  password: z.string().min(1, { message: "No password entered" }),
});

export const registerFormSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Must be a valid email" })
      .min(1, { message: "No email entered" }),
    password: z
      .string()
      .min(1, { message: "No password entered" })
      .min(8, { message: "Password must be atleast 8 characters" })
      .regex(passwordRegex, {
        message: "Must contain atleast one uppercase and one special character",
      }),
    confirmPassword: z.string().min(1, { message: "No password entered" }),
  })
  .refine(
    (data) => {
      return data.password == data.confirmPassword;
    },
    { message: "Passwords do not match.", path: ["confirmPassword"] },
  );

export const verifyFormSchema = z.object({
  code: z.string().length(6, { message: "Invalid verification code" }),
});
