import { logger } from "@/config/logger";
import { CommentService } from "@/services/comments.service";
import { failure, success } from "@/utils/api-response";
import type { Request, Response } from "express";
import type { CreateCommentType } from "@/schemas/comment.schema";

export class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  /**
   * Get all comments for a particular listing
   * GET /comments
   */
  getListingComments = async (req: Request, res: Response) => {
    try {
      const listingId = req.query.listingId;
      console.log("listing id", listingId);

      if (!listingId) {
        throw new Error("Missing parameters: Listing ID is required");
      }

      const comments = await this.commentService.getCommentsByListingId(
        listingId as string
      );

      return res.status(200).json(success(comments));
    } catch (error: any) {
      logger.error("Getting listing comments failed", error);
      return res.status(400).json(failure(error.message));
    }
  };

  /**
   * Create a new comment or reply
   * POST /comments
   */
  createComment = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.uid;

      if (!userId) {
        return res.status(401).json(failure("Unauthorized"));
      }

      const data: CreateCommentType = req.body;

      const newComment = await this.commentService.createComment({
        ...data,
        authorId: userId,
      });

      return res.status(201).json(success(newComment, "Comment created successfully"));
    } catch (error: any) {
      logger.error("Creating comment failed", error);
      return res.status(400).json(failure(error.message));
    }
  };
}
