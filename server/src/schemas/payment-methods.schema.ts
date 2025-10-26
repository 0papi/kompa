import * as z from "zod";

export const paymentMethodTypeSchema = z.enum([
  "BANK_ACCOUNT",
  "PAYPAL",
  "STRIPE",
  "VENMO",
  "CASHAPP",
  "ZELLE",
]);

export const accountDetailsSchema = z.object({
  accountHolderName: z.string().optional(),
  accountNumber: z.string().optional(), // Last 4 digits only for display
  routingNumber: z.string().optional(),
  email: z.string().email().optional(), // For PayPal, Venmo, etc.
  phone: z.string().optional(), // For Zelle, CashApp
}).passthrough(); // Allow additional fields

export const createPaymentMethodSchema = z.object({
  methodType: paymentMethodTypeSchema,
  accountDetails: accountDetailsSchema,
  isPreferred: z.boolean().optional().default(false),
});

export const updatePaymentMethodSchema = z.object({
  accountDetails: accountDetailsSchema.optional(),
  isPreferred: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

export type CreatePaymentMethodType = z.infer<typeof createPaymentMethodSchema>;
export type UpdatePaymentMethodType = z.infer<typeof updatePaymentMethodSchema>;
export type PaymentMethodType = z.infer<typeof paymentMethodTypeSchema>;
