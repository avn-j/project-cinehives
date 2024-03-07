import { z } from "zod";
import { DateTime } from "luxon";
import { COUNTRIES_LIST } from "@/utils/countries";

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

const MAX_FILE_SIZE = 1024 * 1024 * 3;
const ACCEPTED_IMAGE_TYPES = ["image/jpg", "image/png"];
const dateSchema = z.coerce.date();
type DateSchema = z.infer<typeof dateSchema>;

export const setupFormSchemaClient = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters long"),
  userName: z
    .string()
    .min(3, "Username must be atleast 3 characters long")
    .max(16, "Username cannot exceed 16 characters"),
  profilePicture: z
    .any()
    .refine((file) => file?.length == 1, "File is required.")
    .refine((file) => file?.length <= 2, "Only one file can be uploaded.")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file[0]?.type),
      "File is not a .jpg or .png",
    )
    .refine((file) => file[0]?.size <= MAX_FILE_SIZE, `Max file size is 3MB.`),
  dateOfBirth: z.coerce
    .date()
    // If user inputs a date older than 1990-01-01
    // eg. 1889-01-01 > 1990-01-01 will return false
    .refine((date) => date > new Date("1990-01-01"), {
      message: "Date of birth must be after 1990-01-01",
    })
    // If user puts a future date
    .refine((date) => date < new Date(), {
      message: "Date of birth must not be in the future.",
    })
    .refine(
      (date) => DateTime.fromJSDate(date) < DateTime.now().minus({ years: 16 }),
      {
        message: "You must be over 16 to use this website.",
      },
    ),
  country: z
    .string()
    .refine((country) => country != "", "Please select a country")
    .refine(
      (country) => COUNTRIES_LIST.includes(country),
      "Not a valid country.",
    ),
});

export const setupFormSchemaServer = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters long"),
  userName: z
    .string()
    .min(3, "Username must be atleast 3 characters long")
    .max(16, "Username cannot exceed 16 characters"),
  profilePicture: z
    .any()
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "File is not a .jpg or .png",
    )
    .refine((file) => file?.size <= 3000000, `Max file size is 3MB.`),
  dateOfBirth: z.coerce
    .date()
    // If user inputs a date older than 1990-01-01
    // eg. 1889-01-01 > 1990-01-01 will return false
    .refine((date) => date > new Date("1990-01-01"), {
      message: "Date of birth must be after 1990-01-01",
    })
    // If user puts a future date
    .refine((date) => date < new Date(), {
      message: "Date of birth must not be in the future.",
    })
    .refine(
      (date) => DateTime.fromJSDate(date) < DateTime.now().minus({ years: 16 }),
      {
        message: "You must be over 16 to use this website.",
      },
    ),
  country: z
    .string()
    .refine((country) => country != "", "Please select a country")
    .refine(
      (country) => COUNTRIES_LIST.includes(country),
      "Not a valid country.",
    ),
});
