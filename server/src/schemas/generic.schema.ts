import * as z from 'zod';


export const genericListingIdSchema = z.object({
  listingId: z.uuid().min(1, 'Listing ID is required')
})


export type GenericListingIdType = z.infer<typeof genericListingIdSchema>
