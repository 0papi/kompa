import * as z from "zod";

// Payout method types
export const payoutMethodTypeSchema = z.enum([
  "BANK_TRANSFER",
  "MOBILE_MONEY",
]);


const bankAccountDetailsSchema = z.object({
  accountHolderName: z.string().min(2, "Account holder name is required"),
  accountNumber: z.string().min(8, "Invalid account number"),
  bankCode: z.string().min(1, "Bank code is required"),
  bankName: z.string().min(1, "Bank name is required"),
});


const mobileMoneyDetailsSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  provider: z.enum(["MTN", "VODAFONE", "AIRTEL", "OTHER"]),
  accountHolderName: z.string().min(2, "Account holder name is required"),
});



export const payoutAccountDetailsSchema = z.discriminatedUnion("methodType", [
  z.object({
    methodType: z.literal("BANK_TRANSFER"),
    details: bankAccountDetailsSchema,
  }),
  z.object({
    methodType: z.literal("MOBILE_MONEY"),
    details: mobileMoneyDetailsSchema,
  }),
]);


export const createPayoutMethodSchema = z.object({
  methodType: payoutMethodTypeSchema,
  accountDetails: payoutAccountDetailsSchema,
  isPreferred: z.boolean().optional().default(false),
});

export const updatePayoutMethodSchema = z.object({
  accountDetails: payoutAccountDetailsSchema.optional(),
  isPreferred: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});


export type PayoutMethodType = z.infer<typeof payoutMethodTypeSchema>;
export type CreatePayoutMethodType = z.infer<typeof createPayoutMethodSchema>;
export type UpdatePayoutMethodType = z.infer<typeof updatePayoutMethodSchema>;
export type PayoutAccountDetailsType = z.infer<typeof payoutAccountDetailsSchema>;

export type BankAccountDetails = z.infer<typeof bankAccountDetailsSchema>;
export type MobileMoneyDetails = z.infer<typeof mobileMoneyDetailsSchema>;

