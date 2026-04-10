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
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-plattr-border shadow-plattr hover:shadow-plattr-elevated transition-all duration-500 h-full transform-gpu"
    >
      <Link to={`/dish/${dish.id}`} className="flex flex-col h-full">
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-plattr-subtle flex items-center justify-center">
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
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-2 z-10">
            <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-wider shadow-lg border border-white/10 ${badgeClass}`}>
              <SourceIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden xs:inline">{sourceLabel}</span>
            </span>
          </div>

          {isBestSeller && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-wider shadow-lg bg-yellow-400 text-yellow-950 border border-yellow-300">
                <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                <span className="hidden xs:inline">Best Seller</span>
                <span className="xs:hidden">Best Seller</span>
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6 flex flex-col flex-1 relative bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <p className="text-[8px] sm:text-[10px] font-black tracking-[0.1em] sm:tracking-[0.15em] uppercase text-plattr-text-muted font-sans">
                {dish.cuisine.replace(/_/g, " ")}
              </p>
              {dish.is_spicy && (
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 fill-current" />
              )}
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-plattr-subtle text-plattr-primary border border-plattr-border">
              <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current" />
              <span className="text-[8px] sm:text-[10px] font-black">{rating}</span>
            </div>
          </div>

          <h4 className="text-lg sm:text-xl font-serif font-bold text-plattr-text leading-tight line-clamp-2 mb-3 sm:mb-4 group-hover:text-plattr-primary transition-colors h-[2.8rem] sm:h-[3.5rem]">
            {dish.name}
          </h4>

          {/* Meal type tag */}
          <div className="flex flex-wrap gap-1.5 mb-6 sm:mb-8">
            <span className="inline-flex px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest bg-plattr-subtle text-plattr-text-sec border border-plattr-border font-sans">
              {dish.meal_type}
            </span>
          </div>

          {/* Footer - Standardized Spacing */}
          <div className="flex items-center justify-between mt-auto pt-4 sm:pt-6 border-t border-plattr-subtle">
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-plattr-text-muted leading-none mb-1">Price</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-plattr-text">
                ₹{dish.price.toLocaleString()}
              </span>
            </div>
            
            {!showQuickAdd ? (
              <div className="inline-flex items-center gap-1.5 sm:gap-2 h-9 sm:h-11 px-4 sm:px-6 rounded-full text-[9px] sm:text-[11px] font-black uppercase tracking-widest bg-plattr-primary text-white transition-all duration-300 shadow-plattr group-hover:bg-plattr-secondary font-sans cursor-pointer whitespace-nowrap">
                <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">View Detail</span>
                <span className="sm:hidden">View</span>
              </div>
            ) : (
              <button 
                onClick={(e) => onQuickAdd?.(e, dish)}
                className="inline-flex items-center gap-1.5 sm:gap-2 h-9 sm:h-11 px-4 sm:px-8 rounded-full text-[9px] sm:text-[11px] font-black uppercase tracking-widest bg-plattr-subtle text-plattr-text hover:bg-plattr-primary hover:text-white transition-all duration-500 border border-plattr-border font-sans whitespace-nowrap active:scale-95"
              >
                <Plus size={14} className="sm:w-4 sm:h-4" strokeWidth={3} />
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
