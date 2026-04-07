import { Star } from "lucide-react";

type RatingStarsProps = {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
};

const sizes = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };

const RatingStars = ({ rating, size = "md", showValue }: RatingStarsProps) => {
  const starSize = sizes[size];
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${starSize} flex-shrink-0 ${
            s <= Math.round(rating)
              ? "fill-[#F59E0B] text-[#F59E0B]"
              : "fill-none text-[#D4E8DA]"
          }`}
        />
      ))}
      {showValue && (
        <span className="text-sm font-semibold text-[#1B2D24] ml-1">{rating.toFixed(1)}</span>
      )}
    </span>
  );
};

export default RatingStars;
