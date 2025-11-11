import * as z from 'zod';


export const initialiseTransactionSchema = z.object({
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  // userId: z.string().min(1, 'User ID is required'),
  email: z.email('Email is required')
})





export type InitialiseTransactionType = z.infer<typeof initialiseTransactionSchema>
