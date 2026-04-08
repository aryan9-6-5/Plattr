import { useState, useMemo, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import RevealOnScroll from "./RevealOnScroll";
import DishCard from "./food/DishCard";

import { Dish } from "@/types/dish";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/usePlattrToast";

// Components moved to shared food/DishCard.tsx
const dbSources: Record<string, string> = {
  "Home Chef":     "HOME_CHEF",
  "Cloud Kitchen": "CLOUD_KITCHEN",
  "Restaurant":    "RESTAURANT",
};

const mealTypes = ["All", "Tiffin", "Bulk", "Event"];
const sources   = ["All", "Home Chef", "Cloud Kitchen", "Restaurant"];

const CatalogSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [mealType, setMealType] = useState("All");
  const [source,   setSource]   = useState("All");
  const [dishes,   setDishes]   = useState<Dish[]>([]);
  const [loading,  setLoading]  = useState(true);

  const { addItem } = useCart();
  const { addToast } = useToast();

  const handleSharedQuickAdd = (e: React.MouseEvent, dish: Dish) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id:           dish.id,
      name:         dish.name,
      cuisine:      dish.cuisine,
      meal_type:    dish.meal_type,
      source_type:  dish.source_type,
      source_id:    dish.source_id,
      source_name:  dish.source_type.replace(/_/g, ' '),
      price:        Number(dish.price),
      bulk_price:   dish.bulk_price ? Number(dish.bulk_price) : null,
      min_bulk_qty: dish.min_bulk_qty ?? 20,
      quantity:     1,
      image_url:    dish.image_url ?? null,
      diet_type:    dish.diet_type,
      spice_level:  dish.spice_level ?? "MEDIUM",
      is_spicy:     dish.is_spicy ?? false,
    });
    addToast(`${dish.name} added!`, "success");
  };

  useEffect(() => {
    async function fetchDishes() {
      setLoading(true);
      let query = supabase.from("dishes").select("*");

      if (mealType !== "All") query = query.eq("meal_type", mealType);
      if (source   !== "All") query = query.eq("source_type", dbSources[source]);

      const { data, error } = await query;
      if (!error && data) setDishes(data);
      else setDishes([]);
      setLoading(false);
    }
    fetchDishes();
  }, [mealType, source]);

  const grouped = useMemo(() => {
    const groups: Record<string, Dish[]> = {};
    dishes.forEach((d) => {
      const cuisine = d.cuisine || "Other";
      if (!groups[cuisine]) groups[cuisine] = [];
      groups[cuisine].push(d);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [dishes]);

  return (
    <section id="catalog" className="bg-[#EEF8F1]" ref={ref}>

      {/* Section header — full padding above sticky bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-8">
        <RevealOnScroll direction="up" className="text-center mb-0">
          <span className="text-xs font-bold tracking-widest uppercase text-[#52B788] mb-3 block">
            Freshly Prepared
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1B2D24] leading-tight">
            Today's Menu
          </h2>
          <p className="text-[#4A6357] max-w-lg mx-auto mt-4 text-base">
            Every dish is prepared fresh today by our verified network of home chefs and cloud kitchens. A structured catalog — not a random listing.
          </p>
        </RevealOnScroll>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center gap-10 mt-8"
        >
          {[
            { n: dishes.length,                                   label: "Dishes" },
            { n: grouped.length,                                  label: "Cuisines" },
            { n: new Set(dishes.map(d => d.source_type)).size,    label: "Sources" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <span className="text-2xl font-bold text-[#2D6A4F] font-serif">{s.n}</span>
              <span className="block text-xs font-medium text-[#7A9A88] mt-0.5">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-20 bg-[#EEF8F1]/95 backdrop-blur-sm border-b border-[#D4E8DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8 py-2">
            {/* Meal type dropdown */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="text-xs font-bold tracking-widest uppercase text-[#7A9A88]">Type</span>
              <div className="relative">
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="appearance-none bg-white border border-[#D4E8DA] text-[#1B2D24] text-sm rounded-full pl-5 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent cursor-pointer font-semibold shadow-sm hover:border-[#52B788] transition-colors"
                >
                  {mealTypes.map(opt => <option key={opt} value={opt}>{opt === "All" ? "All Types" : opt}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#2D6A4F]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Source dropdown */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="text-xs font-bold tracking-widest uppercase text-[#7A9A88]">Source</span>
              <div className="relative">
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="appearance-none bg-white border border-[#D4E8DA] text-[#1B2D24] text-sm rounded-full pl-5 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent cursor-pointer font-semibold shadow-sm hover:border-[#52B788] transition-colors"
                >
                  {sources.map(opt => <option key={opt} value={opt}>{opt === "All" ? "All Sources" : opt}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#2D6A4F]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F] mb-4" />
            <p className="text-[#7A9A88] font-medium">Loading catalog...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mealType}-${source}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {grouped.length === 0 ? (
                <p className="text-center text-[#7A9A88] py-16">No dishes match the selected filters.</p>
              ) : (
                <div className="space-y-16">
                  {grouped.map(([cuisine, cuisineDishes]) => (
                    <div key={cuisine}>
                      {/* Cuisine group header */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-1 h-8 rounded-full bg-[#52B788] flex-shrink-0" />
                        <h3 className="text-xl font-semibold text-[#1B2D24] tracking-tight">{cuisine}</h3>
                        <span className="text-sm font-medium text-[#7A9A88]">({cuisineDishes.length} dishes)</span>
                        <div className="flex-1 h-px bg-[#D4E8DA]" />
                      </div>

                      {/* Dish card grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {cuisineDishes.map((dish, ci) => (
                          <DishCard 
                            key={dish.id} 
                            dish={dish} 
                            index={ci} 
                            showQuickAdd={true}
                            onQuickAdd={handleSharedQuickAdd}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default CatalogSection;
