import RatingStars from "./RatingStars";
import { formatRelative } from "@/utils/formatDate";
import { BadgeCheck } from "lucide-react";
import type { Review } from "@/hooks/useReviews";

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="p-4 bg-white rounded-xl border border-[#E8F5EC] space-y-2">
    <div className="flex items-center justify-between">
      <RatingStars rating={review.rating} size="sm" />
      <div className="flex items-center gap-2">
        {review.is_verified_purchase && (
          <span className="inline-flex items-center gap-1 text-xs text-[#2D6A4F] font-medium">
            <BadgeCheck className="w-3.5 h-3.5" /> Verified
          </span>
        )}
        {review.created_at && (
          <span className="text-xs text-[#7A9A88]">{formatRelative(review.created_at)}</span>
        )}
      </div>
    </div>
    {review.comment && (
      <p className="text-sm text-[#4A6357] leading-relaxed">{review.comment}</p>
    )}
  </div>
);

export default ReviewCard;
