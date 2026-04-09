import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, Wand2, Loader2, Info, ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useServiceConfigs, useDietaryOptions } from "@/hooks/useServiceInfrastructure";
import { useDishes } from "@/hooks/useDishes";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/usePlattrToast";
import MealBoxProgress from "@/components/mealbox/MealBoxProgress";
import DishSelector from "@/components/mealbox/DishSelector";
import { Dish } from "@/types/dish";
import { TrayValue } from "@/types/infrastructure";

const MealBoxBuilderPage = () => {
  const [step, setStep] = useState(1);
  const [selectedSize, setSelectedSize] = useState<TrayValue | null>(null);
  const [dietary, setDietary] = useState("All");
  const [spiceLevel, setSpiceLevel] = useState("MEDIUM");
  const [selectedDishes, setSelectedDishes] = useState<Dish[]>([]);
  
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addToast } = useToast();
  
  const { configs: trayConfigs, loading: trayLoading } = useServiceConfigs("mealbox_tray");
  const { options: dietOptions, loading: dietLoading } = useDietaryOptions();
  
  // Fetch dishes for step 3
  const { dishes, loading: dishesLoading } = useDishes({
    diet_type: dietary === "All" ? undefined : dietary,
    limit: 100
  });

  const DIET_LABELS: Record<string, string> = {
    VEG: "Veg",
    NON_VEG: "Non-Veg",
    EGG: "Eggitarian",
    VEGAN: "Vegan",
    JAIN: "Jain"
  };

  const steps = ["Size", "Preferences", "Dishes", "Review"];

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const toggleDish = (dish: Dish) => {
    const isSelected = selectedDishes.some(d => d.id === dish.id);
    if (isSelected) {
      setSelectedDishes(prev => prev.filter(d => d.id !== dish.id));
    } else {
      if (selectedSize && selectedDishes.length < selectedSize.slots) {
        setSelectedDishes(prev => [...prev, dish]);
      } else {
        addToast(`Your ${selectedSize?.slots}-slot box is already full!`, "warning");
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || selectedDishes.length === 0) return;
    
    addItem({
      id: `mealbox-${Date.now()}`,
      name: `Custom ${selectedSize.slots}-Portion MealBox`,
      cuisine: "Mixed Curation",
      meal_type: "BULK",
      source_type: "RESTAURANT",
      source_id: "mealbox-builder",
      source_name: "Plattr Builder",
      price: selectedDishes.reduce((acc, d) => acc + d.price, 0),
      bulk_price: null,
      min_bulk_qty: 1,
      quantity: 1,
      image_url: selectedSize.imgSrc || `https://images.unsplash.com/photo-${['1546069901-ba9599a7e63c', '1512621776951-a57141f2eefd', '1543353071-103f07580dd7', '1606787366850-de6330128bfc'][trayConfigs.findIndex((c: { value: TrayValue }) => c.value.slots === selectedSize.slots) % 4]}?auto=format&fit=crop&q=80&w=400`,
      diet_type: dietary.toUpperCase(),
      spice_level: spiceLevel,
      is_spicy: spiceLevel !== "MILD",
      // Metadata for expansion
      sub_items: selectedDishes.map(d => ({ id: d.id, name: d.name }))
    });
    
    addToast("MealBox successfully added to cart!", "success");
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] pb-40">
      {/* Header Area */}
      <div className="bg-white border-b border-[#E5E1D8] pt-12 pb-12 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-8">
              {step > 1 && (
                <button 
                  onClick={handleBack}
                  className="w-10 h-10 rounded-full border border-[#E5E1D8] flex items-center justify-center text-[#1B4332] hover:bg-[#F3F2EE] transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1B2D24]">
                  Build Your <span className="italic">MealBox</span>
                </h1>
              </div>
            </div>
            
            <MealBoxProgress currentStep={step} steps={steps} />
          </div>

          <div className="hidden md:block w-32 h-32 relative group">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full"
            >
              <img 
                src="https://images.unsplash.com/photo-1543353071-103f07580dd7?auto=format&fit=crop&q=80&w=400" 
                alt="MealBox Hero" 
                className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white"
              />
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-xl shadow-lg">
                <ShoppingBag size={16} className="text-yellow-900" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-12">
        <AnimatePresence mode="wait">
          {/* STEP 1: SIZE SELECTION */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-serif font-bold text-[#1B2D24] mb-2">How big is the occasion?</h2>
              <p className="text-[#4A6357] mb-10">Choose a portion count that best fits your group.</p>
              
              {trayLoading ? (
                 <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#2D6A4F]" /></div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {trayConfigs.map((opt, i) => {
                    const val = opt.value as TrayValue;
                    const isSelected = selectedSize?.slots === val.slots;
                    return (
                      <motion.div
                        key={opt.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedSize(val)}
                        className={`group relative h-[320px] cursor-pointer rounded-[40px] overflow-hidden border-2 transition-all duration-700 ${
                          isSelected ? "border-[#2D6A4F] shadow-2xl" : "border-[#E5E1D8] hover:border-[#2D6A4F]/30"
                        }`}
                      >
                        <div className="absolute inset-0 w-full h-full">
                          <img 
                            src={`https://images.unsplash.com/photo-${['1546069901-ba9599a7e63c', '1512621776951-a57141f2eefd', '1543353071-103f07580dd7', '1606787366850-de6330128bfc'][i % 4]}?auto=format&fit=crop&q=80&w=800`} 
                            alt={opt.label} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                          />
                          <div className={`absolute inset-0 transition-opacity duration-700 ${isSelected ? 'bg-black/40' : 'bg-black/20 group-hover:bg-black/40'}`} />
                        </div>

                        <div className="relative z-10 h-full flex flex-col justify-between p-8">
                          <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                              isSelected ? "bg-[#2D6A4F] border-[#2D6A4F] shadow-lg scale-110" : "bg-white/20 backdrop-blur-md border-white/40"
                            }`}>
                              {isSelected ? <Check size={20} className="text-white" strokeWidth={4} /> : <div className="w-3 h-3 rounded-full border-2 border-white/60" />}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90 drop-shadow-md">Plattr Standard</span>
                          </div>
                          
                          <div>
                            <h3 className="text-4xl font-serif font-bold text-white mb-2 drop-shadow-2xl">{opt.label}</h3>
                            <p className="text-sm text-white/80 font-medium drop-shadow-lg">Optimized for premium logistics.</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: PREFERENCES */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-serif font-bold text-[#1B2D24] mb-2">Set your preferences</h2>
              <p className="text-[#4A6357] mb-12">We'll use these to filter the most compatible dishes for your box.</p>
              
              <div className="space-y-12">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A9A88] mb-6 block">Dietary Profile</label>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setDietary("All")}
                      className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        dietary === "All" ? "bg-[#1B2D24] text-white shadow-xl" : "bg-white border border-[#E5E1D8] text-[#4A6357] hover:border-[#1B2D24]"
                      }`}
                    >
                      All
                    </button>
                    {dietOptions.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setDietary(opt)}
                        className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                          dietary === opt ? "bg-[#1B2D24] text-white shadow-xl" : "bg-white border border-[#E5E1D8] text-[#4A6357] hover:border-[#1B2D24]"
                        }`}
                      >
                        {DIET_LABELS[opt] || opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A9A88] mb-6 block">Spice Tolerance</label>
                  <div className="flex flex-wrap gap-4">
                    {["MILD", "MEDIUM", "SPICY"].map(s => (
                      <button
                        key={s}
                        onClick={() => setSpiceLevel(s)}
                        className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                          spiceLevel === s ? "bg-[#1B2D24] text-white shadow-xl" : "bg-white border border-[#E5E1D8] text-[#4A6357] hover:border-[#1B2D24]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DISH SELECTION */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#1B2D24] mb-2">Fill your box</h2>
                  <p className="text-[#4A6357]">Select {selectedSize?.slots} dishes for your curate tray.</p>
                </div>
                <div className="bg-[#1B4332] px-6 py-3 rounded-2xl text-white shadow-xl">
                  <span className="text-xs font-black uppercase tracking-widest">Slots Filled: </span>
                  <span className="text-xl font-serif font-bold ml-2">{selectedDishes.length}/{selectedSize?.slots}</span>
                </div>
              </div>

              {dishesLoading ? (
                 <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#2D6A4F]" /></div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {dishes.map((dish, i) => (
                    <DishSelector 
                      key={dish.id} 
                      dish={dish} 
                      index={i}
                      isSelected={selectedDishes.some(d => d.id === dish.id)}
                      onSelect={toggleDish}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: REVIEW */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[40px] border border-[#E5E1D8] p-10 md:p-16 shadow-sm"
            >
              <h2 className="text-3xl font-serif font-bold text-[#1B2D24] mb-12">Confirm your curation.</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-10">
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7A9A88] mb-4 block">Box Configuration</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#F3F2EE] rounded-2xl overflow-hidden shadow-inner">
                           <img 
                             src={`https://images.unsplash.com/photo-${['1546069901-ba9599a7e63c', '1512621776951-a57141f2eefd', '1543353071-103f07580dd7', '1606787366850-de6330128bfc'][trayConfigs.findIndex((c: { value: TrayValue }) => c.value.slots === (selectedSize?.slots || 0)) % 4]}?auto=format&fit=crop&q=80&w=200`} 
                             alt="tray" 
                             className="w-full h-full object-cover" 
                           />
                        </div>
                        <div>
                          <p className="font-bold text-[#1B2D24]">{selectedSize?.slots} Portion MealBox</p>
                          <p className="text-xs text-[#7A9A88]">{DIET_LABELS[dietary] || dietary} Profile • {spiceLevel} Spice</p>
                        </div>
                      </div>
                   </div>

                   <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#7A9A88] mb-4 block text-center">Price Integrity</label>
                      <div className="text-center md:text-left">
                        <span className="text-5xl font-serif font-bold text-[#1B4332]">₹{selectedDishes.reduce((acc, d) => acc + d.price, 0)}</span>
                        <p className="text-xs text-[#7A9A88] mt-2 uppercase font-black tracking-widest">Consolidated Total</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#7A9A88] mb-4 block">Selected Dishes</label>
                   {selectedDishes.map(dish => (
                     <div key={dish.id} className="flex items-center justify-between py-3 border-b border-[#F3F2EE]">
                       <span className="text-sm font-bold text-[#1B2D24]">{dish.name}</span>
                       <button onClick={() => toggleDish(dish)} className="text-[#BC4749] hover:bg-[#FDF2F2] p-2 rounded-full transition-colors">
                          <Trash2 size={16} />
                       </button>
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persistence Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[#E5E1D8] p-6 md:px-12 z-50 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="hidden md:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#7A9A88] mb-1">Current Progress</p>
            <p className="text-sm font-bold text-[#1B2D24]">{steps[step-1]}</p>
          </div>
          
          <button
            onClick={step === 4 ? handleAddToCart : handleNext}
            disabled={
              (step === 1 && !selectedSize) || 
              (step === 3 && selectedDishes.length < (selectedSize?.slots || 1))
            }
            className={`px-12 py-5 rounded-2xl flex items-center gap-3 transition-all duration-500 font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl active:scale-95
              ${((step === 1 && !selectedSize) || (step === 3 && selectedDishes.length < (selectedSize?.slots || 1)))
                ? "bg-[#F3F2EE] text-[#7A9A88] cursor-not-allowed" 
                : "bg-[#1B4332] text-white hover:bg-[#2D6A4F]"
              }
            `}
          >
            {step === 4 ? <ShoppingBag size={18} /> : <ChevronRight size={18} />}
            {step === 4 ? "Deploy to Cart" : "Next Module"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealBoxBuilderPage;

