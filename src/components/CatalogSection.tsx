import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
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
      let query = supabase
        .from("dishes")
        .select("*")
        .order('created_at', { ascending: false })
        .limit(8);

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
    <section id="catalog" className="bg-[#F6FFF8]" ref={ref}>

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-16 md:pt-24 pb-12">
        <RevealOnScroll direction="up" className="text-center mb-0">

          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1B2D24] leading-tight mb-8">
            The Daily Menu
          </h2>
          <p className="text-lg text-[#4A6357] max-w-xl mx-auto mt-4 font-sans leading-relaxed">
            Every dish is prepared fresh today by our verified artisans. High-end sourcing meets authentic regional heritage.
          </p>
        </RevealOnScroll>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center gap-12 md:gap-20 mt-12 border-b border-[#D4E8DA] pb-12"
        >
          {[
            { n: dishes.length,                                   label: "Items" },
            { n: grouped.length,                                  label: "Cuisines" },
            { n: new Set(dishes.map(d => d.source_type)).size,    label: "Channels" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <span className="text-3xl font-bold text-[#1B4332] font-serif">{s.n}</span>
              <span className="block text-[11px] font-black uppercase tracking-[0.1em] text-[#7A9A88] mt-1">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-30 bg-[#F6FFF8]/90 backdrop-blur-xl border-b border-[#D4E8DA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
            <div className="flex items-center gap-10">
              {/* Meal type filter */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#7A9A88]">Meal Type</span>
                <div className="flex gap-2">
                  {mealTypes.slice(0, 4).map(opt => (
                    <button
                      key={opt}
                      onClick={() => setMealType(opt)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${mealType === opt ? 'bg-[#1B4332] text-white shadow-lg' : 'bg-transparent text-[#4A6357] hover:text-[#1B4332]'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-px h-10 bg-[#D4E8DA] hidden md:block" />

              {/* Source filter */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#7A9A88]">Pipeline</span>
                <div className="relative">
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="appearance-none bg-transparent text-[#1B2D24] text-sm font-bold pr-8 py-1 focus:outline-none cursor-pointer hover:text-[#1B4332] transition-colors"
                  >
                    {sources.map(opt => <option key={opt} value={opt}>{opt === "All" ? "All Sources" : opt}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-[#2D6A4F]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] font-black uppercase tracking-widest text-[#7A9A88]">
              {dishes.length} Results
            </div>
          </div>
        </div>
      </div>

      {/* Catalog grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-[#1B4332] mb-6" />
            <p className="text-[13px] font-black uppercase tracking-widest text-[#7A9A88]">Acquiring Menu Data...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mealType}-${source}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            >
              {grouped.length === 0 ? (
                <p className="text-center text-[#7A9A88] py-32 font-serif text-xl italic">No matches found in the current curation.</p>
              ) : (
                <div className="space-y-24">
                  {grouped.map(([cuisine, cuisineDishes]) => (
                    <div key={cuisine}>
                      {/* Cuisine group header */}
                      <div className="flex items-center gap-6 mb-12">
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#1B2D24] tracking-tight">{cuisine}</h3>
                        <div className="flex-1 h-px bg-[#D4E8DA]" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#7A9A88]">{cuisineDishes.length} Items</span>
                      </div>

                      {/* Dish card grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
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

      {/* Explore More Button */}
      {!loading && dishes.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pb-32 flex justify-center">
          <Link
            to="/catalog"
            className="group flex items-center gap-5 px-12 py-6 bg-[#1B4332] text-white rounded-full text-lg font-bold shadow-2xl hover:bg-[#2D6A4F] transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            The Full Collection
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default CatalogSection;
