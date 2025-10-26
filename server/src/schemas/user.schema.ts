import * as z from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

// Phone number validation using libphonenumber-js
const phoneNumberSchema = z
  .string()
  .refine(
    (value) => {
      if (!value || value === "") return true; // Allow empty for optional fields
      return isValidPhoneNumber(value);
    },
    {
      message: "Please enter a valid phone number",
    }
  )
  .optional();

export const createUserSchema = z.object({
  firebaseUid: z.string().min(1, "Firebase UID is required"),
  email: z.string().email("Invalid email address"),
  // password: z.string().min(1, "Password is required"),
  name: z.string().min(1, "Name is required"),
  phoneNumber: phoneNumberSchema,
  account_type: z.enum(["PROVIDER", "CONSUMER", "CONSUMER_PROVIDER"]).default("PROVIDER"),
});

export const createFirebaseUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  name: z.string().min(1, "Name is required"),
  phoneNumber: phoneNumberSchema,
  account_type: z.enum(["PROVIDER", "CONSUMER", "CONSUMER_PROVIDER"]).default("PROVIDER"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  phoneNumber: phoneNumberSchema,
  account_type: z.enum(["PROVIDER", "CONSUMER", "CONSUMER_PROVIDER"]).optional(),
});

export type CreateUserType = z.Infer<typeof createUserSchema>;
export type CreateFirebaseUserType = z.Infer<typeof createFirebaseUserSchema>;
export type UpdateUserType = z.Infer<typeof updateUserSchema>;
