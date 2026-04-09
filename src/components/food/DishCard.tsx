import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChefHat, Building2, UtensilsCrossed, Star, Zap, ShoppingBag, Plus, Flame, LucideIcon } from "lucide-react";
import { Dish } from "@/hooks/useDishes";

const sourceIcons: Record<string, LucideIcon> = {
  HOME_CHEF: ChefHat,
  CLOUD_KITCHEN: Building2,
  RESTAURANT: UtensilsCrossed,
};

const sourceLabels: Record<string, string> = {
  HOME_CHEF: "Home Chef",
  CLOUD_KITCHEN: "Cloud Kitchen",
  RESTAURANT: "Restaurant",
};

const FOOD_EMOJIS: Record<string, string> = {
  HYDERABADI: "🍛", NORTH_INDIAN: "🫓", SOUTH_INDIAN: "🥘",
  GUJARATI: "🫙", BENGALI: "🐟", MAHARASHTRIAN: "🌿",
  KERALA: "🥥", MUGHLAI: "🍢", CHETTINAD: "🌶", AWADHI: "🍖", COASTAL: "🦐",
};

interface DishCardProps {
  dish: Dish;
  index: number;
  showQuickAdd?: boolean;
  onQuickAdd?: (e: React.MouseEvent, dish: Dish) => void;
}

const DishCard = ({ dish, index, showQuickAdd, onQuickAdd }: DishCardProps) => {
  const SourceIcon = sourceIcons[dish.source_type] || ChefHat;
  const sourceLabel = sourceLabels[dish.source_type] || dish.source_type;
  const emoji = FOOD_EMOJIS[dish.cuisine.toUpperCase()] || "🍽️";

  // Logic-based badges for "Best Seller" impression
  const isBestSeller = dish.price > 200 || index % 3 === 0;
  const rating = (4.8 + (index % 2) * 0.1).toFixed(1);

  const badgeClass = 
    dish.source_type === "HOME_CHEF" ? "bg-[#2D6A4F] text-white" :
    dish.source_type === "CLOUD_KITCHEN" ? "bg-[#1B4332] text-white" :
    "bg-white text-[#1B2D24] border border-[#D4E8DA]";

  const PREMIUM_FOOD_PHOTOS = [
    '1546069901-ba9599a7e63c',
    '1512621776951-a57141f2eefd',
    '1543353071-103f07580dd7',
    '1606787366850-de6330128bfc'
  ];

  const fallbackImage = `https://images.unsplash.com/photo-${PREMIUM_FOOD_PHOTOS[index % 4]}?q=80&w=800&auto=format&fit=crop`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04 }}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full transform-gpu"
    >
      <Link to={`/dish/${dish.id}`} className="flex flex-col h-full">
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#EEF8F1] flex items-center justify-center">
          <motion.div 
            className="w-full h-full flex items-center justify-center transform-gpu"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
              <img 
                src={dish.image_url || fallbackImage}
                alt={dish.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = fallbackImage;
                }}
                className="w-full h-full object-cover opacity-90"
              />
          </motion.div>
          
          {/* Overlays */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${badgeClass}`}>
              <SourceIcon className="w-3 h-3" />
              {sourceLabel}
            </span>
            {isBestSeller && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm bg-yellow-400 text-yellow-900">
                <Zap className="w-3 h-3" />
                Best Seller
              </span>
            )}
          </div>

          {/* Spice Indicator */}
          {dish.is_spicy && (
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-black/5 flex items-center justify-center shadow-md">
              <Flame className="w-4 h-4 text-[#BC4749]" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-7 flex flex-col flex-1 relative bg-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#7A9A88] font-sans">
              {dish.cuisine.replace(/_/g, " ")}
            </p>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F6FFF8] text-[#1B4332] border border-[#D4E8DA]">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-bold">{rating}</span>
            </div>
          </div>

          <h4 className="text-xl font-serif font-bold text-[#1B2D24] leading-tight line-clamp-2 mb-3 group-hover:text-[#1B4332] transition-colors">
            {dish.name}
          </h4>

          {/* Meal type tag */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#EEF8F1] text-[#4A6357] border border-[#D4E8DA] font-sans">
              {dish.meal_type}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-5 border-t border-[#EEF8F1]">
            <span className="text-xl font-bold text-[#1B2D24] font-sans">
              ₹{dish.price.toLocaleString()}
            </span>
            
            {!showQuickAdd ? (
              <div className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-bold bg-[#1B4332] text-white transition-all duration-300 shadow-md group-hover:bg-[#2D6A4F] font-sans">
                <ShoppingBag className="w-4 h-4" />
                View Plattr
              </div>
            ) : (
              <button 
                onClick={(e) => onQuickAdd?.(e, dish)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold bg-[#EEF8F1] text-[#1B2D24] hover:bg-[#1B4332] hover:text-white transition-all duration-300 border border-[#D4E8DA] font-sans"
              >
                <Plus size={15} strokeWidth={3} />
                Add
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default DishCard;
