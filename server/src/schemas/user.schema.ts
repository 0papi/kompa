import * as z from "zod";

export const createUserSchema = z.object({
  firebaseUid: z.string().min(1, "Firebase UID is required"),
  email: z.string().email("Invalid email address"),
  // password: z.string().min(1, "Password is required"),
  name: z.string().min(1, "Name is required"),
  account_type: z.enum(["PROVIDER", "CONSUMER", "CONSUMER_PROVIDER"]).default("PROVIDER"),
});

export const createFirebaseUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  name: z.string().min(1, "Name is required"),
  account_type: z.enum(["PROVIDER", "CONSUMER", "CONSUMER_PROVIDER"]).default("PROVIDER"),
});

export type CreateUserType = z.Infer<typeof createUserSchema>;
export type CreateFirebaseUserType = z.Infer<typeof createFirebaseUserSchema>;
