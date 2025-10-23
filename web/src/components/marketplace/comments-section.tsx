"use client";

import { MessageSquare, Send, User, Reply } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  commentsApi,
  type Comment as ApiComment,
  type CreateCommentInput,
} from "@/lib/api/comments";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/useSession";
import CommentsIcon from "../ui/icons/CommentsIcon";

interface UIComment {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorImageUrl?: string;
  text: string;
  timestamp: Date;
  replies: UIComment[];
}

/**
 * Formats a date to be user-friendly (e.g., "2 hours ago", "1 day ago").
 */
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000; // years
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000; // months
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400; // days
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600; // hours
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60; // minutes
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}

interface CommentItemProps {
  comment: UIComment;
  onReply: (commentId: string) => void;
  replyingTo: string | null;
  onCancelReply: () => void;
  onSubmitReply: (commentId: string, text: string) => void;
  depth?: number;
  listingOwnerId?: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  replyingTo,
  onCancelReply,
  onSubmitReply,
  depth = 0,
  listingOwnerId,
}) => {
  const [replyText, setReplyText] = useState("");
  const isReplying = replyingTo === comment.id;
  const maxDepth = 3; // Limit nesting depth
  const isOwner = listingOwnerId && comment.authorId === listingOwnerId;

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      onSubmitReply(comment.id, replyText.trim());
      setReplyText("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start space-x-4">
        <Avatar className="h-8 w-8">
          {comment.authorImageUrl ? (
            <AvatarImage src={comment.authorImageUrl} alt={comment.authorName} />
          ) : (
            <AvatarFallback>{comment.authorInitials}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-card-foreground">
                {comment.authorName}
              </span>
              {isOwner && (
                <Badge variant="default" className="text-xs px-2 py-0 h-5 bg-green-600">
                  Owner
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(comment.timestamp)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{comment.text}</p>

          {/* Reply button */}
          {depth < maxDepth && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => isReplying ? onCancelReply() : onReply(comment.id)}
              className="h-7 px-2 text-xs -ml-2"
            >
              <Reply className="h-3 w-3 mr-1" />
              {isReplying ? "Cancel" : "Reply"}
            </Button>
          )}

          {/* Reply input form */}
          {isReplying && (
            <form onSubmit={handleSubmitReply} className="flex items-start space-x-2 mt-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleSubmitReply(e);
                    }
                  }}
                  className="pr-12 text-sm min-h-[60px]"
                  autoFocus
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6"
                  disabled={!replyText.trim()}
                >
                  <Send className="h-3 w-3" />
                  <span className="sr-only">Post reply</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 space-y-3 border-l-2 border-muted pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              replyingTo={replyingTo}
              onCancelReply={onCancelReply}
              onSubmitReply={onSubmitReply}
              depth={depth + 1}
              listingOwnerId={listingOwnerId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Renders the input form for adding a new comment.
 */
interface CommentInputProps {
  onSubmit: (text: string) => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ onSubmit }) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onSubmit(commentText.trim());
      setCommentText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start space-x-3">
      <Avatar>
        <AvatarFallback>
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 relative">
        <Textarea
          placeholder="Please ask your question here"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleSubmit(e);
            }
          }}
          className="pr-16"
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 h-8 w-8"
          disabled={!commentText.trim()}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Post comment</span>
        </Button>
      </div>
    </form>
  );
};

interface CommentsSectionProps {
  listingId: string;
  listingOwnerId?: string;
}

// Helper function to convert API comments to UI comments
const convertToUIComment = (apiComment: ApiComment): UIComment => ({
  id: apiComment.id,
  authorId: apiComment.authorId,
  authorName: "User", // TODO: Fetch user info when available
  authorInitials: "U",
  text: apiComment.comment,
  timestamp: new Date(apiComment.createdAt),
  replies: apiComment.replies?.map(convertToUIComment) || [],
});

export const CommentsSection = ({ listingId, listingOwnerId }: CommentsSectionProps) => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useSession();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Fetch comments from the backend
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", listingId],
    queryFn: () => commentsApi.getByListingId(listingId),
    enabled: !!listingId,
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: (data: CreateCommentInput) => commentsApi.create(data),
    onSuccess: () => {
      toast.success("Comment posted successfully");
      queryClient.invalidateQueries({ queryKey: ["comments", listingId] });
      setReplyingTo(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to post comment");
    },
  });

  const comments: UIComment[] = response?.data?.map(convertToUIComment) || [];

  // Handle adding a top-level comment
  const handleAddComment = (text: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to post a comment");
      return;
    }

    createCommentMutation.mutate({
      listingId,
      comment: text,
      relatedToId: listingId,
      relatedToType: "listing",
    });
  };

  // Handle adding a reply to a comment
  const handleSubmitReply = (commentId: string, text: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to post a reply");
      return;
    }

    createCommentMutation.mutate({
      listingId,
      comment: text,
      relatedToId: commentId,
      relatedToType: "comment",
    });
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <header className="mb-4">
        <div className="flex items-center text-lg">
          <MessageSquare className="h-5 w-5 mr-3 text-muted-foreground" />
          Got a question?
        </div>
      </header>
      <div>
        {/* Input Form */}
        <CommentInput onSubmit={handleAddComment} />

        <Separator className="my-6" />

        {/* Comment List */}
        <div className="space-y-6">
          {isLoading && (
            <>
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </>
          )}

          {!isLoading && comments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              <CommentsIcon />
              No questions yet. Be the first to ask!
            </p>
          )}

          {!isLoading &&
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                replyingTo={replyingTo}
                onCancelReply={handleCancelReply}
                onSubmitReply={handleSubmitReply}
                listingOwnerId={listingOwnerId}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
