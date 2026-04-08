import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChefHat, Building2, UtensilsCrossed, Star, Zap, ShoppingBag, Plus, Flame } from "lucide-react";
import { Dish } from "@/hooks/useDishes";

const sourceIcons: Record<string, any> = {
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm ring-1 ring-[#D4E8DA] hover:shadow-lg hover:ring-[#52B788]/30 transition-all duration-300 h-full"
    >
      <Link to={`/dish/${dish.id}`} className="flex flex-col h-full">
        {/* Image Section */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#EEF8F1] to-[#D8F3DC] flex items-center justify-center">
          <span className="text-5xl group-hover:scale-110 transition-transform duration-500">{emoji}</span>
          
          {/* Overlays */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${badgeClass}`}>
              <SourceIcon className="w-3 h-3" />
              {sourceLabel}
            </span>
            {isBestSeller && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-400 text-[#1B2D24] shadow-md border border-white/20">
                <Zap className="w-3 h-3 fill-current" />
                Best Seller
              </span>
            )}
          </div>

          {/* Spice Indicator */}
          {dish.is_spicy && (
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/90 backdrop-blur-sm border border-white/20 flex items-center justify-center text-sm shadow-lg transform hover:scale-110 transition-transform">
              <Flame className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-1 relative">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#52B788]">
              {dish.cuisine.replace(/_/g, " ")}
            </p>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EEF8F1] text-[#2D6A4F]">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-bold">{rating}</span>
            </div>
          </div>

          <h4 className="text-base font-semibold text-[#1B2D24] leading-snug line-clamp-2 mb-2 pr-12">
            {dish.name}
          </h4>

          {/* Meal type tag */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#EEF8F1] text-[#2D6A4F] border border-[#D8F3DC]">
              {dish.meal_type}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E8F5EC]">
            <span className="text-lg font-bold text-[#1B2D24]">
              ₹{dish.price.toLocaleString()}
            </span>
            
            {!showQuickAdd ? (
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-[#2D6A4F] hover:bg-[#1e4d38] text-white transition-all duration-200 shadow-sm">
                <ShoppingBag className="w-3.5 h-3.5" />
                View
              </div>
            ) : (
              <button 
                onClick={(e) => onQuickAdd?.(e, dish)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-[#E8F5EC] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white transition-all duration-200 border border-[#D4E8DA]"
              >
                <Plus size={14} strokeWidth={3} />
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
