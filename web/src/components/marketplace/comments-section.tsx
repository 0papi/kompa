"use client";

import { MessageSquare, Send, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

interface Comment {
  id: string;
  authorName: string;
  authorInitials: string;
  authorImageUrl?: string;
  text: string;
  timestamp: Date;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    authorName: "Jane Doe",
    authorInitials: "JD",
    authorImageUrl: "https://placehold.co/40x40/E2E8F0/4A5568?text=JD",
    text: "Client mentioned they are very interested but concerned about the lot size. Follow up next Tuesday.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "c2",
    authorName: "John Smith",
    authorInitials: "JS",
    text: "Confirmed with the inspector. The roof is in good condition. Sent the report to the client.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];

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
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => (
  <div className="flex items-start space-x-4">
    <Avatar>
      {comment.authorImageUrl ? (
        <AvatarImage src={comment.authorImageUrl} alt={comment.authorName} />
      ) : (
        <AvatarFallback>{comment.authorInitials}</AvatarFallback>
      )}
    </Avatar>
    <div className="flex-1 space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm text-card-foreground">
          {comment.authorName}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatTimeAgo(comment.timestamp)}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{comment.text}</p>
    </div>
  </div>
);

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
          placeholder="Add an internal note..."
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

export const CommentsSection = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching comments on mount
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setComments(MOCK_COMMENTS);
      setLoading(false);
    }, 1000); // Simulate network delay
  }, []);

  // Handle adding a new comment
  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: `c${comments.length + 1}`,
      authorName: "Current User", // In a real app, get this from auth
      authorInitials: "CU",
      text: text,
      timestamp: new Date(),
    };
    // Add new comment to the top of the list
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <header className="mb-4">
        <div className="flex items-center text-lg">
          <MessageSquare className="h-5 w-5 mr-3 text-muted-foreground" />
          Comments
        </div>
      </header>
      <div>
        {/* Input Form */}
        <CommentInput onSubmit={handleAddComment} />

        <Separator className="my-6" />

        {/* Comment List */}
        <div className="space-y-6">
          {loading && (
            <>
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="" />
              ))}
            </>
          )}

          {!loading && comments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No notes or activity yet.
            </p>
          )}

          {!loading &&
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
        </div>
      </div>
    </div>
  );
};
