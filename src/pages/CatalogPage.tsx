import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { Search, X, ChefHat, Building2, UtensilsCrossed, Flame, Plus, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDishes } from "@/hooks/useDishes";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import PageError from "@/components/ui/PageError";
import DishCard from "@/components/food/DishCard";

const CUISINES = ["All","HYDERABADI","NORTH_INDIAN","SOUTH_INDIAN","GUJARATI","BENGALI","MAHARASHTRIAN","KERALA","MUGHLAI","CHETTINAD","AWADHI","COASTAL"];
const MEAL_TYPES = ["All","TIFFIN","BULK","EVENT","ALA_CARTE"];
const DIET_TYPES = ["All","VEG","NON_VEG","EGG","VEGAN","JAIN"];
const SOURCES = ["All","HOME_CHEF","CLOUD_KITCHEN","RESTAURANT"];

const cuisineLabel = (c: string) => c === "All" ? "All" : c.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
const mealLabel = (m: string) => ({All:"All",TIFFIN:"Tiffin",BULK:"Bulk",EVENT:"Event",ALA_CARTE:"À La Carte"}[m] ?? m);
const dietLabel = (d: string) => ({All:"All",VEG:"Veg",NON_VEG:"Non-Veg",EGG:"Egg",VEGAN:"Vegan",JAIN:"Jain"}[d] ?? d);
const sourceLabel = (s: string) => ({All:"All",HOME_CHEF:"Home Chef",CLOUD_KITCHEN:"Cloud Kitchen",RESTAURANT:"Restaurant"}[s] ?? s);

// sourceIcons moved to shared component

const PAGE_SIZE = 12;

const DishCardSkeleton = () => (
  <div className="rounded-2xl bg-white overflow-hidden shadow-sm ring-1 ring-[#D4E8DA] animate-pulse">
    <div className="h-36 bg-[#EEF8F1]" />
    <div className="p-4 space-y-2">
      <div className="h-3.5 bg-[#EEF8F1] rounded w-2/3" />
      <div className="h-3 bg-[#EEF8F1] rounded w-1/2" />
      <div className="h-4 bg-[#D8F3DC] rounded w-1/3 mt-2" />
    </div>
  </div>
);

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { cuisineSlug } = useParams();

  const [search, setSearch]         = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDeb]   = useState(search);
  const [cuisine, setCuisine]       = useState(cuisineSlug?.toUpperCase() ?? searchParams.get("cuisine") ?? "All");
  const [mealType, setMealType]     = useState(searchParams.get("meal_type") ?? "All");
  const [dietType, setDietType]     = useState(searchParams.get("diet") ?? "All");
  const [source, setSource]         = useState(searchParams.get("source") ?? "All");
  const [offset, setOffset]         = useState(0);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDeb(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Sync filters → URL
  useEffect(() => {
    const p: Record<string, string> = {};
    if (cuisine !== "All")  p.cuisine  = cuisine;
    if (mealType !== "All") p.meal_type = mealType;
    if (dietType !== "All") p.diet      = dietType;
    if (source !== "All")   p.source    = source;
    if (debouncedSearch)    p.search    = debouncedSearch;
    setSearchParams(p, { replace: true });
    setOffset(0);
  }, [cuisine, mealType, dietType, source, debouncedSearch]);

  const { addItem } = useCart();
  const { addToast } = useToast();

  const handleSharedQuickAdd = (e: React.MouseEvent, dish: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id:           dish.id,
      name:         dish.name,
      cuisine:      dish.cuisine,
      meal_type:    dish.meal_type,
      source_type:  dish.source_type,
      source_id:    dish.source_id,
      source_name:  `${sourceLabel(dish.source_type)}`,
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

  const hasFilters = cuisine !== "All" || mealType !== "All" || dietType !== "All" || source !== "All" || !!debouncedSearch;

  const filters = {
    cuisine:     cuisine    !== "All" ? cuisine    : undefined,
    meal_type:   mealType   !== "All" ? mealType   : undefined,
    diet_type:   dietType   !== "All" ? dietType   : undefined,
    source_type: source     !== "All" ? source     : undefined,
    search:      debouncedSearch || undefined,
    limit:       PAGE_SIZE,
    offset,
  };

  const { dishes, loading, error, total } = useDishes(filters);

  const clearAll = useCallback(() => {
    setSearch(""); setDeb("");
    setCuisine("All"); setMealType("All");
    setDietType("All"); setSource("All");
    setOffset(0);
  }, []);

  // Group by cuisine if no filters
  const grouped = !hasFilters
    ? dishes.reduce<Record<string, typeof dishes>>((acc, d) => {
        (acc[d.cuisine] ??= []).push(d);
        return acc;
      }, {})
    : null;

  const FilterDropdown = ({ label, options, value, setValue, labelFn, icon: Icon }: {
    label: string; options: string[]; value: string;
    setValue: (v: string) => void; labelFn: (v: string) => string; icon?: any;
  }) => (
    <div className="relative group flex-1 min-w-[140px]">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A9A88] pointer-events-none group-hover:text-[#2D6A4F] transition-colors">
        {Icon ? <Icon size={14} /> : <Search size={14} />}
      </div>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#D4E8DA] bg-white text-[13px] font-semibold text-[#1B2D24] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] appearance-none cursor-pointer hover:border-[#2D6A4F] transition-colors"
      >
        <option value="All">{`All ${label}s`}</option>
        {options.filter(o => o !== "All").map((opt) => (
          <option key={opt} value={opt}>{labelFn(opt)}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A9A88] pointer-events-none" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6FFF8]">
      <PageHeader
        eyebrow="FRESHLY PREPARED"
        title={cuisine !== "All" ? `Today's ${cuisineLabel(cuisine)} Menu` : "Today's Menu"}
        description="Every dish is prepared fresh today by our verified network of home chefs and cloud kitchens."
      >
        <div className="grid grid-cols-3 gap-4 mt-6 max-w-md">
          {[
            { value: total || "–", label: "Dishes" },
            { value: CUISINES.length - 1, label: "Cuisines" },
            { value: SOURCES.length - 1, label: "Sources" },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 bg-white rounded-xl ring-1 ring-[#D4E8DA]">
              <p className="text-xl font-bold text-[#2D6A4F] font-serif">{s.value}</p>
              <p className="text-xs text-[#7A9A88]">{s.label}</p>
            </div>
          ))}
        </div>
      </PageHeader>

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E8F5EC] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#F6FFF8] border border-[#D4E8DA] focus-within:ring-2 focus-within:ring-[#2D6A4F] flex-1">
              <Search className="w-4 h-4 text-[#7A9A88] flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your favorite dishes..."
                className="text-[13px] text-[#1B2D24] placeholder:text-[#7A9A88] outline-none bg-transparent flex-1 py-1"
              />
              <AnimatePresence>
                {search && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearch("")}
                  >
                    <X className="w-3.5 h-3.5 text-[#7A9A88]" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Counts for Desktop */}
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-[#7A9A88] uppercase tracking-widest">
              <span className="text-[#2D6A4F]">{total}</span>
              <span>dishes found</span>
            </div>
          </div>

          {/* New Dropdown Filter Row */}
          <div className="flex flex-wrap items-center gap-3">
            <FilterDropdown 
              label="Cuisine"  
              options={CUISINES}    
              value={cuisine}  
              setValue={setCuisine}  
              labelFn={cuisineLabel}
              icon={UtensilsCrossed}
            />
            <FilterDropdown 
              label="Meal"     
              options={MEAL_TYPES}  
              value={mealType} 
              setValue={setMealType} 
              labelFn={mealLabel}
              icon={Flame}
            />
            <FilterDropdown 
              label="Diet"     
              options={DIET_TYPES}  
              value={dietType} 
              setValue={setDietType} 
              labelFn={dietLabel}
              icon={ChefHat}
            />
            <FilterDropdown 
              label="Source"   
              options={SOURCES}     
              value={source}   
              setValue={setSource}   
              labelFn={sourceLabel}
              icon={Building2}
            />
            
            {hasFilters && (
              <button 
                onClick={clearAll}
                className="px-4 py-2 rounded-xl bg-[#FFEBEE] text-[#D32F2F] text-[13px] font-bold hover:bg-[#FFCDD2] transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error ? (
          <PageError message={error} />
        ) : loading && offset === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <DishCardSkeleton key={i} />)}
          </div>
        ) : dishes.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="No dishes found"
            description="Try adjusting your filters or search term"
            actionLabel="Clear all filters"
            onAction={clearAll}
          />
        ) : grouped ? (
          /* Grouped by cuisine */
          Object.entries(grouped).map(([cuisine, items]) => (
            <div key={cuisine} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-8 rounded-full bg-[#2D6A4F]" />
                <h2 className="text-lg font-bold text-[#1B2D24]">{cuisineLabel(cuisine)}</h2>
                <span className="text-xs text-[#7A9A88]">{items.length} dish{items.length !== 1 ? "es" : ""}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {items.map((dish, i) => (
                  <DishCard 
                    key={dish.id} 
                    dish={dish as any} 
                    index={i} 
                    showQuickAdd={true}
                    onQuickAdd={handleSharedQuickAdd}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          /* Flat grid when filtered */
          <>
            <p className="text-sm font-medium text-[#4A6357] mb-5">
              Showing {dishes.length} of {total} dishes
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              <AnimatePresence>
                {dishes.map((dish, i) => (
                  <DishCard 
                    key={dish.id} 
                    dish={dish as any} 
                    index={i} 
                    showQuickAdd={true}
                    onQuickAdd={handleSharedQuickAdd}
                  />
                ))}
              </AnimatePresence>
            </div>
            {total > offset + PAGE_SIZE && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setOffset((o) => o + PAGE_SIZE)}
                  className="px-8 py-3 rounded-full bg-white border border-[#D4E8DA] text-sm font-semibold text-[#2D6A4F] hover:bg-[#EEF8F1] transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
