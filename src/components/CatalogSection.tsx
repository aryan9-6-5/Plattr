import { useState, useMemo, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Flame, ChefHat, Building2, UtensilsCrossed, Loader2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import RevealOnScroll from "./RevealOnScroll";

type Dish = {
  id: string;
  name: string;
  cuisine: string;
  meal_type: string;
  source_type: string;
  price: number;
  is_spicy: boolean;
};

const sourceIcons: Record<string, typeof ChefHat> = {
  HOME_CHEF:     ChefHat,
  CLOUD_KITCHEN: Building2,
  RESTAURANT:    UtensilsCrossed,
};

const sourceBadgeClass: Record<string, string> = {
  HOME_CHEF:     "bg-[#2D6A4F] text-white",
  CLOUD_KITCHEN: "bg-[#1B4332] text-white",
  RESTAURANT:    "bg-white/90 text-[#1B2D24] border border-[#D4E8DA] backdrop-blur-sm",
};

const sourceLabels: Record<string, string> = {
  HOME_CHEF:     "Home Chef",
  CLOUD_KITCHEN: "Cloud Kitchen",
  RESTAURANT:    "Restaurant",
};

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
      <div className="sticky top-[64px] z-20 bg-[#EEF8F1]/95 backdrop-blur-sm border-b border-[#D4E8DA]">
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
                        {cuisineDishes.map((dish, ci) => {
                          const SourceIcon  = sourceIcons[dish.source_type] || ChefHat;
                          const badgeClass  = sourceBadgeClass[dish.source_type] || "bg-gray-100 text-gray-700";
                          const sourceLabel = sourceLabels[dish.source_type] || dish.source_type;

                          return (
                            <motion.div
                              key={dish.id}
                              layout
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: ci * 0.04 }}
                              whileHover={{ y: -4, transition: { duration: 0.2 } }}
                              className="group flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm ring-1 ring-[#D4E8DA] hover:shadow-lg hover:ring-[#52B788]/30 transition-shadow duration-300"
                            >
                              {/* Image / placeholder */}
                              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#EEF8F1]">
                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                  🍽️
                                </div>
                                {/* Source badge overlay */}
                                <div className="absolute top-3 left-3">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${badgeClass}`}>
                                    <SourceIcon className="w-3.5 h-3.5" />
                                    {sourceLabel}
                                  </span>
                                </div>
                                {/* Spice indicator */}
                                {dish.is_spicy && (
                                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-sm shadow-sm">
                                    🌶️
                                  </div>
                                )}
                              </div>

                              {/* Card body */}
                              <div className="p-5 flex flex-col flex-1">
                                <p className="text-xs font-bold tracking-widest uppercase text-[#52B788] mb-1">
                                  {dish.cuisine}
                                </p>
                                <h4 className="text-base font-semibold text-[#1B2D24] leading-snug line-clamp-2 mb-2">
                                  {dish.name}
                                </h4>

                                {/* Meal type tag */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-[#EEF8F1] text-[#2D6A4F] border border-[#D8F3DC]">
                                    {dish.meal_type}
                                  </span>
                                </div>

                                {/* Card footer */}
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E8F5EC]">
                                  <span className="text-lg font-bold text-[#1B2D24]">
                                    ₹{dish.price.toLocaleString()}
                                  </span>
                                  <Link
                                    to={`/dish/${dish.id}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-[#2D6A4F] hover:bg-[#1e4d38] text-white transition-all duration-200 shadow-sm hover:shadow-md"
                                  >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    View
                                  </Link>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
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
