import * as z from 'zod';

export const GetCommentsSchema = z.object({
  listingId: z.string().uuid('Invalid listing ID format').min(1, 'Listing ID is required')
});

export const CreateCommentSchema = z.object({
  listingId: z.string().uuid('Invalid listing ID format').min(1, 'Listing ID is required'),
  comment: z.string().min(1, 'Comment text is required').max(2000, 'Comment is too long'),
  relatedToId: z.string().uuid('Invalid related ID format').min(1, 'Related ID is required'),
  // @ts-ignore
  relatedToType: z.enum(['listing', 'comment'], {
    errorMap: () => ({ message: 'Related type must be either "listing" or "comment"' })
  })
});

export type GetCommentsType = z.infer<typeof GetCommentsSchema>;
export type CreateCommentType = z.infer<typeof CreateCommentSchema>;
