import { useState } from "react";
import { ArrowLeft, ArrowDownUp, Loader2, ShoppingBag, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useComboPacks } from "@/hooks/useServiceInfrastructure";
import type { ComboPack } from "@/types/infrastructure";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/usePlattrToast";

const CombosPage = () => {
  const [activeDiet, setActiveDiet] = useState("All");
  const { combos, loading, error } = useComboPacks(activeDiet);
  const { addItem } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (combo: ComboPack) => {
    addItem({
      id: combo.id,
      name: combo.name,
      cuisine: "Combo",
      meal_type: "EVENT",
      source_type: "RESTAURANT",
      source_id: "combo-pack",
      source_name: "Plattr Curated",
      price: Number(combo.price),
      bulk_price: null,
      min_bulk_qty: 1,
      quantity: 1,
      image_url: combo.image_url,
      diet_type: combo.diet_type,
      spice_level: "MEDIUM",
      is_spicy: false,
    });
    addToast(`${combo.name} added to cart!`, "success");
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] pt-4 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#1B2D24] tracking-tight leading-[1.05]">
              The <span className="italic">Curated</span> <br />Collections.
            </h1>
            <p className="text-lg text-[#4A6357] mt-6 max-w-lg font-sans leading-relaxed">
              Designer meal pairings orchestrated for seamless group experiences. Heritage flavor meets structured logistics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {["All", "Veg", "Non-Veg", "Egg"].map(diet => (
              <button 
                key={diet}
                onClick={() => setActiveDiet(diet)}
                className={`px-6 py-2.5 rounded-full text-[12px] font-black tracking-[0.1em] uppercase transition-all duration-300 border
                  ${activeDiet === diet 
                    ? "bg-[#1B4332] text-white border-transparent shadow-xl" 
                    : "bg-white text-[#4A6357] border-[#E5E1D8] hover:border-[#1B4332] hover:text-[#1B4332]"}
                `}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#1B4332] mb-6" />
            <p className="text-[11px] font-black tracking-[0.2em] uppercase text-[#7A9A88]">Syncing Collections...</p>
          </div>
        ) : error ? (
          <div className="py-24 text-center">
             <h3 className="font-serif text-2xl text-[#1B2D24] mb-4">Transmission Error</h3>
             <p className="text-[#7A9A88]">The curated pipeline is currently offline. Please try again.</p>
          </div>
        ) : combos.length === 0 ? (
          <div className="py-40 text-center">
            <p className="text-[#7A9A88] font-serif text-2xl italic">No collections match the current curation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            <AnimatePresence mode="popLayout">
              {combos.map((combo, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.33, 1, 0.68, 1] }}
                  key={combo.id} 
                  className="bg-white rounded-[40px] overflow-hidden border border-[#E5E1D8] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_100px_-20px_rgba(27,67,50,0.12)] hover:-translate-y-2 transition-all duration-700 flex flex-col group"
                >
                  
                  {/* Image Stage */}
                  <div className="aspect-[4/3] bg-[#F3F2EE] relative flex items-center justify-center p-12 overflow-hidden">
                    <div className={`absolute top-8 left-8 z-20 w-5 h-5 rounded-md border-2 bg-white flex items-center justify-center
                        ${combo.diet_type === "Veg" ? "border-green-600" : combo.diet_type === "Egg" ? "border-yellow-600" : "border-red-600"}
                      `}>
                        <div className={`w-2.5 h-2.5 rounded-full 
                          ${combo.diet_type === "Veg" ? "bg-green-600" : combo.diet_type === "Egg" ? "bg-yellow-600" : "bg-red-600"}
                        `} />
                    </div>
                    
                      <img 
                        src={combo.image_url || `https://images.unsplash.com/photo-${['1546069901-ba9599a7e63c', '1512621776951-a57141f2eefd', '1543353071-103f07580dd7', '1606787366850-de6330128bfc'][idx % 4]}?q=80&w=800&auto=format&fit=crop`}
                        alt={combo.name}
                        onError={(e) => {
                          const fallback = `https://images.unsplash.com/photo-${['1546069901-ba9599a7e63c', '1512621776951-a57141f2eefd', '1543353071-103f07580dd7', '1606787366850-de6330128bfc'][idx % 4]}?q=80&w=800&auto=format&fit=crop`;
                          (e.currentTarget as HTMLImageElement).src = fallback;
                        }}
                        className="w-full h-full object-cover opacity-90 z-10 rounded-xl"
                      />
                    
                    {(combo.price > 1500 || idx % 3 === 0) && (
                      <div className="absolute top-8 right-8 z-30 px-3 py-1.5 rounded-full bg-yellow-400 border border-yellow-500 text-[10px] font-black uppercase tracking-widest text-yellow-900 flex items-center gap-1.5 shadow-sm">
                        <Zap size={12} className="fill-yellow-900" /> Best Seller
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* Details */}
                  <div className="p-10 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-6 gap-4">
                      <h3 className="font-serif font-bold text-[#1B2D24] text-2xl md:text-3xl leading-none">{combo.name}</h3>
                      <div className="text-right flex-shrink-0">
                        <div className="font-serif font-bold text-[#1B4332] text-2xl leading-none">₹{combo.price}</div>
                        <div className="text-[10px] text-[#7A9A88] font-black mt-2 uppercase tracking-[0.1em]">Unit Cost</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-10">
                      {(combo.items || []).map((item: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 bg-[#F3F2EE] border border-transparent rounded-full px-4 py-1.5 hover:border-[#1B4332]/20 transition-colors">
                          <span className="text-[12px] font-bold text-[#4A6357]">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto">
                       <button 
                        onClick={() => handleAddToCart(combo)}
                        className="w-full py-5 rounded-2xl bg-[#1B4332] text-white font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#2D6A4F] transition-all duration-500 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 active:scale-95"
                       >
                         <ShoppingBag size={18} /> Deploy to Cart
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
};

export default CombosPage;
