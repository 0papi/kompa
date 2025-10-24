"use client";

import { Star, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  reviewsApi,
  type Review,
  type CreateReviewInput,
} from "@/lib/api/reviews";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/useSession";

interface ReviewsSectionProps {
  listingId: string;
}

/**
 * Formats a date to be user-friendly (e.g., "January 2024").
 */
function formatReviewDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Star rating display component
 */
interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = "md",
  interactive = false,
  onRate,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= displayRating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          } ${interactive ? "cursor-pointer transition-colors" : ""}`}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && onRate && onRate(star)}
        />
      ))}
    </div>
  );
};

/**
 * Individual review item
 */
interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <div className="py-6 border-b last:border-0">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm">User</div>
              <div className="text-xs text-muted-foreground">
                {formatReviewDate(review.createdAt)}
              </div>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Review input form
 */
interface ReviewInputProps {
  onSubmit: (rating: number, comment: string) => void;
  isSubmitting?: boolean;
}

const ReviewInput: React.FC<ReviewInputProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim().length >= 10) {
      onSubmit(rating, comment.trim());
      setRating(0);
      setComment("");
    }
  };

  const isValid = rating > 0 && comment.trim().length >= 10;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-muted/30 rounded-lg">
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Rating</label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onRate={setRating}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Review</label>
        <Textarea
          placeholder="Share your experience with this property... (minimum 10 characters)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px]"
          disabled={isSubmitting}
        />
        <div className="text-xs text-muted-foreground">
          {comment.length} / 2000 characters
        </div>
      </div>
      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

export const ReviewsSection = ({ listingId }: ReviewsSectionProps) => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useSession();
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch reviews
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews", listingId],
    queryFn: () => reviewsApi.getByListingId(listingId),
    enabled: !!listingId,
  });

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: (data: CreateReviewInput) => reviewsApi.create(data),
    onSuccess: () => {
      toast.success("Review posted successfully");
      queryClient.invalidateQueries({ queryKey: ["reviews", listingId] });
      setShowReviewForm(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to post review");
    },
  });

  const reviews = response?.data?.reviews || [];
  const stats = response?.data?.stats || { averageRating: 0, totalReviews: 0 };

  const handleAddReview = (rating: number, comment: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to post a review");
      return;
    }

    createReviewMutation.mutate({
      listingId,
      rating,
      comment,
    });
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      {/* Header with average rating */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
          <h2 className="text-2xl font-bold">
            {stats.totalReviews > 0
              ? stats.averageRating.toFixed(1)
              : "No reviews yet"}
          </h2>
        </div>
        {stats.totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(stats.averageRating)} size="sm" />
            <span className="text-sm text-muted-foreground">
              {stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"}
            </span>
          </div>
        )}
      </div>

      <Separator className="mb-6" />

      {/* Add review button / form */}
      {!showReviewForm && (
        <Button
          variant="outline"
          onClick={() => {
            if (!isAuthenticated) {
              toast.error("Please sign in to post a review");
              return;
            }
            setShowReviewForm(true);
          }}
          className="w-full mb-6"
        >
          Write a Review
        </Button>
      )}

      {showReviewForm && (
        <div className="mb-6">
          <ReviewInput
            onSubmit={handleAddReview}
            isSubmitting={createReviewMutation.isPending}
          />
          <Button
            variant="ghost"
            onClick={() => setShowReviewForm(false)}
            className="w-full mt-2"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-0">
        {isLoading && (
          <>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="py-6 border-b">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {!isLoading && reviews.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No reviews yet. Be the first to review!
          </p>
        )}

        {!isLoading &&
          reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
      </div>
    </div>
  );
};
