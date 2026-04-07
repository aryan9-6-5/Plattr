import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { Search, X, ChefHat, Building2, UtensilsCrossed, Flame, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDishes } from "@/hooks/useDishes";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import PageError from "@/components/ui/PageError";
import DietBadge from "@/components/ui/DietBadge";
import MealTypeBadge from "@/components/ui/MealTypeBadge";

const CUISINES = ["All","HYDERABADI","NORTH_INDIAN","SOUTH_INDIAN","GUJARATI","BENGALI","MAHARASHTRIAN","KERALA","MUGHLAI","CHETTINAD","AWADHI","COASTAL"];
const MEAL_TYPES = ["All","TIFFIN","BULK","EVENT","ALA_CARTE"];
const DIET_TYPES = ["All","VEG","NON_VEG","EGG","VEGAN","JAIN"];
const SOURCES = ["All","HOME_CHEF","CLOUD_KITCHEN","RESTAURANT"];

const cuisineLabel = (c: string) => c === "All" ? "All" : c.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
const mealLabel = (m: string) => ({All:"All",TIFFIN:"Tiffin",BULK:"Bulk",EVENT:"Event",ALA_CARTE:"À La Carte"}[m] ?? m);
const dietLabel = (d: string) => ({All:"All",VEG:"Veg",NON_VEG:"Non-Veg",EGG:"Egg",VEGAN:"Vegan",JAIN:"Jain"}[d] ?? d);
const sourceLabel = (s: string) => ({All:"All",HOME_CHEF:"Home Chef",CLOUD_KITCHEN:"Cloud Kitchen",RESTAURANT:"Restaurant"}[s] ?? s);

const sourceIcons: Record<string, typeof ChefHat> = {
  HOME_CHEF: ChefHat,
  CLOUD_KITCHEN: Building2,
  RESTAURANT: UtensilsCrossed,
};

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

  const ChipRow = ({ label, options, value, setValue, labelFn }: {
    label: string; options: string[]; value: string;
    setValue: (v: string) => void; labelFn: (v: string) => string;
  }) => (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-bold uppercase tracking-widest text-[#7A9A88] w-20 flex-shrink-0">{label}</span>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setValue(opt)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
              value === opt
                ? "bg-[#2D6A4F] text-white border-[#2D6A4F]"
                : "bg-white text-[#4A6357] border-[#D4E8DA] hover:bg-[#EEF8F1]"
            }`}
          >
            {labelFn(opt)}
          </button>
        ))}
      </div>
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
            { value: "3", label: "Sources" },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 bg-white rounded-xl ring-1 ring-[#D4E8DA]">
              <p className="text-xl font-bold text-[#2D6A4F] font-serif">{s.value}</p>
              <p className="text-xs text-[#7A9A88]">{s.label}</p>
            </div>
          ))}
        </div>
      </PageHeader>

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-[#E8F5EC] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#F6FFF8] border border-[#D4E8DA] shadow-sm focus-within:ring-2 focus-within:ring-[#2D6A4F] max-w-md">
            <Search className="w-4 h-4 text-[#7A9A88] flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="text-sm text-[#1B2D24] placeholder:text-[#7A9A88] outline-none bg-transparent flex-1"
            />
            {search && (
              <button onClick={() => setSearch("")}><X className="w-3.5 h-3.5 text-[#7A9A88]" /></button>
            )}
          </div>
          {/* Filter chips */}
          <div className="space-y-2">
            <ChipRow label="Cuisine"  options={CUISINES}    value={cuisine}  setValue={setCuisine}  labelFn={cuisineLabel} />
            <ChipRow label="Meal"     options={MEAL_TYPES}  value={mealType} setValue={setMealType} labelFn={mealLabel} />
            <ChipRow label="Diet"     options={DIET_TYPES}  value={dietType} setValue={setDietType} labelFn={dietLabel} />
            <ChipRow label="Source"   options={SOURCES}     value={source}   setValue={setSource}   labelFn={sourceLabel} />
          </div>
          {/* Active filter tags */}
          {hasFilters && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {[
                cuisine  !== "All" && { key: "cuisine",  label: cuisineLabel(cuisine),   clear: () => setCuisine("All") },
                mealType !== "All" && { key: "meal",     label: mealLabel(mealType),      clear: () => setMealType("All") },
                dietType !== "All" && { key: "diet",     label: dietLabel(dietType),      clear: () => setDietType("All") },
                source   !== "All" && { key: "source",   label: sourceLabel(source),      clear: () => setSource("All") },
                debouncedSearch    && { key: "search",   label: `"${debouncedSearch}"`,   clear: () => { setSearch(""); setDeb(""); } },
              ].filter(Boolean).map((tag) => tag && (
                <span key={tag.key} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF8F1] border border-[#D4E8DA] text-xs font-semibold text-[#2D6A4F]">
                  {tag.label}
                  <button onClick={tag.clear}><X className="w-3 h-3" /></button>
                </span>
              ))}
              <button onClick={clearAll} className="text-xs text-[#D32F2F] hover:underline ml-1">Clear all</button>
            </div>
          )}
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
                {items.map((dish, i) => <DishCard key={dish.id} dish={dish} index={i} />)}
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
                {dishes.map((dish, i) => <DishCard key={dish.id} dish={dish} index={i} />)}
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

const FOOD_EMOJIS: Record<string, string> = {
  HYDERABADI: "🍛", NORTH_INDIAN: "🫓", SOUTH_INDIAN: "🥘",
  GUJARATI: "🫙", BENGALI: "🐟", MAHARASHTRIAN: "🌿",
  KERALA: "🥥", MUGHLAI: "🍢", CHETTINAD: "🌶", AWADHI: "🍖", COASTAL: "🦐",
};

const DishCard = ({ dish, index }: { dish: ReturnType<typeof useDishes>["dishes"][0]; index: number }) => {
  const SourceIcon = sourceIcons[dish.source_type] ?? ChefHat;
  const emoji      = FOOD_EMOJIS[dish.cuisine] ?? "🍽";
  const { addItem } = useCart();
  const { addToast } = useToast();

  const handleQuickAdd = (e: React.MouseEvent) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.3 }}
    >
      <Link
        to={`/dish/${dish.id}`}
        className="group relative block bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-[#D4E8DA] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
      >
        {/* Image / placeholder */}
        <div className="relative h-36 bg-gradient-to-br from-[#EEF8F1] to-[#D8F3DC] flex items-center justify-center overflow-hidden">
          <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{emoji}</span>
          {/* Source badge */}
          <span className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
            dish.source_type === "HOME_CHEF" ? "bg-[#2D6A4F] text-white" :
            dish.source_type === "CLOUD_KITCHEN" ? "bg-[#1B4332] text-white" :
            "bg-white text-[#1B2D24] border border-[#D4E8DA]"
          }`}>
            <SourceIcon className="w-3 h-3" />
            {sourceLabel(dish.source_type)}
          </span>
          {dish.is_spicy && (
            <span className="absolute top-2.5 right-2.5 text-xs bg-[#FFEBEE] text-[#D32F2F] px-1.5 py-0.5 rounded-full font-semibold">
              <Flame className="w-3 h-3 inline" />
            </span>
          )}
        </div>
        {/* Info */}
        <div className="p-4 relative">
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#52B788] mb-0.5">
            {cuisineLabel(dish.cuisine)}
          </p>
          <h3 className="text-sm font-semibold text-[#1B2D24] leading-tight line-clamp-2 pr-16">{dish.name}</h3>
          <div className="flex items-center justify-between mt-3">
            <span className="text-base font-bold text-[#1B2D24]">₹{dish.price}</span>
            <MealTypeBadge meal_type={dish.meal_type} />
          </div>

          {/* Always Visible Quick Add */}
          <button
            onClick={handleQuickAdd}
            className="absolute right-4 top-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E8F5EC] text-[#2D6A4F] text-xs font-bold hover:bg-[#2D6A4F] hover:text-white transition-colors border border-[#D4E8DA]"
          >
            <Plus size={12} strokeWidth={3} /> Add
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default CatalogPage;
