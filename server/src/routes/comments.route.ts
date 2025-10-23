import { CommentController } from "@/controllers/comments.controller";
import { authenticateUser, optionalAuth } from "@/middleware/auth";
import { genericListingIdSchema } from "@/schemas/generic.schema";
import { CreateCommentSchema } from "@/schemas/comment.schema";
import { Router } from "express";
import { validateRequest } from "zod-express-middleware";

const router: ReturnType<typeof Router> = Router();

const commentController = new CommentController();

// GET comments - public (optional auth for future features like showing if user liked a comment)
router.get(
  "/comments",
  optionalAuth,
  validateRequest({ query: genericListingIdSchema }),
  commentController.getListingComments
);

// POST comments - requires authentication
router.post(
  "/comments",
  authenticateUser,
  validateRequest({ body: CreateCommentSchema }),
  commentController.createComment
);

export default router;
