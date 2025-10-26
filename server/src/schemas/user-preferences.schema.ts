import * as z from "zod";

export const notificationPreferencesSchema = z.object({
  email: z.boolean().optional().default(true),
  push: z.boolean().optional().default(true),
  sms: z.boolean().optional().default(false),
  marketing: z.boolean().optional().default(false),
});

export const updateUserPreferencesSchema = z.object({
  preferredCurrency: z.string().min(3).max(3).optional(), // ISO 4217 currency codes
  preferredLanguage: z.string().min(2).max(5).optional(), // ISO 639-1 language codes
  notificationPreferences: notificationPreferencesSchema.optional(),
});

export type UpdateUserPreferencesType = z.infer<typeof updateUserPreferencesSchema>;
export type NotificationPreferencesType = z.infer<typeof notificationPreferencesSchema>;
