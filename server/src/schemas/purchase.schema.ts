import * as z from "zod";

export const initialiseTransactionSchema = z.object({
  amount: z.coerce.number().min(0, "Amount must be positive"),
  listingId: z.string().min(1, "Listing ID is required"),
});

export const verifyPurchaseSchema = z.object({
  reference: z.string().min(1, 'Reference is required')
})

export type InitialiseTransactionType = z.infer<
  typeof initialiseTransactionSchema
>;
export type verifyPurchaseType = z.infer<
  typeof verifyPurchaseSchema
>;



