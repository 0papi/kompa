import { comment as CommentsTable } from "@/models";
import { BaseService } from "./base.service";
import { and, desc, eq, or } from "drizzle-orm";
import type { CreateCommentType } from "@/schemas/comment.schema";

interface CommentWithReplies {
  id: string;
  authorId: string;
  listingId: string;
  relatedToId: string;
  relatedToType: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  replies: CommentWithReplies[];
}

export class CommentService extends BaseService<typeof CommentsTable> {
  constructor() {
    super(CommentsTable);
  }

  async getCommentsByListingId(listingId: string): Promise<CommentWithReplies[]> {
    // Fetch all comments for this listing (both top-level and replies)
    const allComments = await this.findMany(
      eq(CommentsTable.listingId, listingId),
      desc(CommentsTable.createdAt)
    );

    // Separate top-level comments from replies
    const topLevelComments = allComments.filter(
      (c) => c.relatedToType === "listing" && c.relatedToId === listingId
    );

    // Build nested structure
    const commentsWithReplies: CommentWithReplies[] = topLevelComments.map((comment) => ({
      ...comment,
      replies: this.getRepliesForComment(comment.id, allComments)
    }));

    return commentsWithReplies;
  }

  private getRepliesForComment(commentId: string, allComments: any[]): CommentWithReplies[] {
    const replies = allComments.filter(
      (c) => c.relatedToType === "comment" && c.relatedToId === commentId
    );

    // Recursively get replies to replies
    return replies.map((reply) => ({
      ...reply,
      replies: this.getRepliesForComment(reply.id, allComments)
    }));
  }

  async createComment(data: CreateCommentType & { authorId: string }) {
    return this.create({
      authorId: data.authorId,
      listingId: data.listingId,
      relatedToId: data.relatedToId,
      relatedToType: data.relatedToType,
      comment: data.comment,
    });
  }
}
