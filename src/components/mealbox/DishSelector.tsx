import React from "react";
import { motion } from "framer-motion";
import { Check, Plus, Star } from "lucide-react";
import { Dish } from "@/types/dish";

interface DishSelectorProps {
  dish: Dish;
  isSelected: boolean;
  onSelect: (dish: Dish) => void;
  index: number;
}

const DishSelector = ({ dish, isSelected, onSelect, index }: DishSelectorProps) => {
  const PREMIUM_FOOD_PHOTOS = [
    '1546069901-ba9599a7e63c',
    '1512621776951-a57141f2eefd',
    '1543353071-103f07580dd7',
    '1606787366850-de6330128bfc'
  ];

  const fallbackImage = `https://images.unsplash.com/photo-${PREMIUM_FOOD_PHOTOS[index % 4]}?q=80&w=400&auto=format&fit=crop`;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(dish)}
      className={`group relative bg-white rounded-3xl overflow-hidden border-2 transition-all duration-500 cursor-pointer ${
        isSelected ? "border-[#2D6A4F] shadow-lg" : "border-[#E8F5EC] hover:border-[#D4E8DA]"
      }`}
    >
      <div className="aspect-square relative overflow-hidden bg-[#F3F2EE]">
        <img 
          src={dish.image_url || fallbackImage} 
          alt={dish.name}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackImage;
          }}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isSelected ? "scale-105" : "group-hover:scale-110"
          }`}
        />
        
        {/* Selection Overlay */}
        <motion.div 
          initial={false}
          animate={{ opacity: isSelected ? 1 : 0 }}
          className="absolute inset-0 bg-[#1B4332]/40 flex items-center justify-center backdrop-blur-[2px]"
        >
          <div className="bg-white rounded-full p-2 text-[#1B4332] shadow-xl">
            <Check size={24} strokeWidth={3} />
          </div>
        </motion.div>
        
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm shadow-sm scale-75 origin-top-left">
            <Star size={10} className="fill-[#2D6A4F] text-[#2D6A4F]" />
            <span className="text-[10px] font-bold text-[#1B2D24]">4.8</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="text-[9px] font-black uppercase tracking-widest text-[#7A9A88] mb-1">
          {dish.cuisine}
        </div>
        <h4 className="text-sm font-bold text-[#1B2D24] leading-tight mb-2 line-clamp-1">
          {dish.name}
        </h4>
        <div className="flex items-center justify-between">
           <span className="text-xs font-bold text-[#2D6A4F]">₹{dish.price}</span>
           {!isSelected && (
             <div className="w-6 h-6 rounded-full border border-[#D4E8DA] flex items-center justify-center text-[#7A9A88] group-hover:bg-[#1B4332] group-hover:text-white group-hover:border-transparent transition-all">
               <Plus size={14} strokeWidth={3} />
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
};

export default DishSelector;
