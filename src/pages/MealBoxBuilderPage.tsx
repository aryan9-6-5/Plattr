import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, ChevronRight, Wand2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useServiceConfigs } from "@/hooks/useServiceInfrastructure";

const MealBoxBuilderPage = () => {
  const [selectedPortions, setSelectedPortions] = useState<number | null>(3);
  const navigate = useNavigate();
  
  const { configs, loading, error } = useServiceConfigs("mealbox_tray");

  return (
    <div className="min-h-screen bg-[#F6FFF8]">
      {/* Header Area */}
      <div className="bg-white border-b border-[#E8F5EC] pt-8 md:pt-12 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex justify-between items-start">
          <div className="max-w-md">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1B2D24] mb-2 font-serif">
              Build Your MealBox
            </h1>
            <p className="text-[13px] md:text-sm text-[#4A6357] leading-relaxed">
              Select your box size, set preferences, and fill it with the dishes you love.
            </p>
          </div>
          <div className="w-16 h-16 md:w-24 md:h-24 flex-shrink-0">
            <img 
              src="/images/mealbox-hero.png" 
              alt="MealBox" 
              className="w-full h-full object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        </div>

        {/* Progress Line */}
        <div className="max-w-4xl mx-auto mt-8 flex gap-2">
          <div className="h-1 bg-[#2D6A4F] rounded-full flex-1" />
          <div className="h-1 bg-[#EEF8F1] rounded-full flex-1" />
          <div className="h-1 bg-[#EEF8F1] rounded-full flex-1" />
          <div className="h-1 bg-[#EEF8F1] rounded-full flex-1" />
          <div className="h-1 bg-[#EEF8F1] rounded-full flex-1" />
          <div className="h-1 bg-[#EEF8F1] rounded-full flex-1" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <h2 className="text-xl md:text-2xl font-bold text-[#1B2D24] mb-2">
          How big should your meal box be?
        </h2>
        <p className="text-sm text-[#4A6357] mb-8">
          Choose how many portions you'd like to include in each box.
        </p>

        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F]" />
          </div>
        ) : error ? (
          <div className="py-12 text-center text-[#7A9A88]">
            Failed to load options.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {configs.map((opt) => {
              const isSelected = selectedPortions === opt.value.slots;
              return (
                <motion.div
                  key={opt.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPortions(opt.value.slots)}
                  className={`relative bg-white cursor-pointer rounded-2xl flex items-center p-6 border-2 transition-all duration-300 ${
                    isSelected 
                      ? "border-[#2D6A4F] shadow-md" 
                      : "border-[#E8F5EC] hover:border-[#D4E8DA]"
                  }`}
                >
                  <div className="flex-1">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-4 transition-colors ${
                      isSelected ? "border-[#2D6A4F] bg-[#2D6A4F]" : "border-[#D4E8DA]"
                    }`}>
                      {isSelected && <Check strokeWidth={3} className="w-4 h-4 text-white" />}
                    </div>
                    <h3 className="font-bold text-[#1B2D24] text-lg">{opt.label}</h3>
                  </div>
                  
                  <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 relative">
                    <img 
                      src={opt.value.imgSrc} 
                      alt={opt.label} 
                      className="w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => {
            if (selectedPortions) {
              // Proceed down funnel (mock nav to catalog filter)
              navigate(`/catalog?meal_type=BULK`);
            }
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300
            ${selectedPortions ? "bg-[#1B2D24] text-white hover:bg-[#2D6A4F] hover:scale-105" : "bg-[#D4E8DA] text-[#7A9A88] cursor-not-allowed"}
          `}
        >
          <Wand2 className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default MealBoxBuilderPage;
