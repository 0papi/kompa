import * as z from 'zod';

export const CreateReviewSchema = z.object({
  listingId: z.string().uuid('Invalid listing ID format').min(1, 'Listing ID is required'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(2000, 'Review is too long')
});

export const GetReviewsSchema = z.object({
  listingId: z.string().uuid('Invalid listing ID format').min(1, 'Listing ID is required')
});

export type CreateReviewType = z.infer<typeof CreateReviewSchema>;
export type GetReviewsType = z.infer<typeof GetReviewsSchema>;
