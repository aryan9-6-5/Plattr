import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChefHat, Building2, UtensilsCrossed, Flame, ShoppingBag, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useDish } from "@/hooks/useDish";
import { useReviews } from "@/hooks/useReviews";
import { useDishesBySource } from "@/hooks/useDishesBySource";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-plattr-toast";
import PageLoader from "@/components/ui/PageLoader";
import PageError from "@/components/ui/PageError";
import Breadcrumb from "@/components/PageBreadcrumb";
import RatingStars from "@/components/ui/RatingStars";
import ReviewCard from "@/components/ui/ReviewCard";
import DietBadge from "@/components/ui/DietBadge";
import SpiceBadge from "@/components/ui/SpiceBadge";
import MealTypeBadge from "@/components/ui/MealTypeBadge";
import SourceBadge from "@/components/ui/SourceBadge";
import QuantitySelector from "@/components/ui/QuantitySelector";
import Tabs from "@/components/ContentTabs";

const FOOD_EMOJIS: Record<string, string> = {
  HYDERABADI:"🍛",NORTH_INDIAN:"🫓",SOUTH_INDIAN:"🥘",GUJARATI:"🫙",BENGALI:"🐟",
  MAHARASHTRIAN:"🌿",KERALA:"🥥",MUGHLAI:"🍢",CHETTINAD:"🌶",AWADHI:"🍖",COASTAL:"🦐",
};

const sourceIcons: Record<string, typeof ChefHat> = {
  HOME_CHEF: ChefHat, CLOUD_KITCHEN: Building2, RESTAURANT: UtensilsCrossed,
};

const sourceLinkPrefix: Record<string, string> = {
  HOME_CHEF: "/chefs/", CLOUD_KITCHEN: "/kitchens/", RESTAURANT: "/restaurants/",
};

const cuisineLabel = (c: string) =>
  c === "All" ? "All" : c.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const DishDetailPage = () => {
  const { id } = useParams();
  const { dish, loading, error } = useDish(id);
  const { reviews } = useReviews("DISH", id);
  const { dishes: relatedDishes } = useDishesBySource(dish?.source_type, dish?.source_id);
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [qty, setQty] = useState(1);
  const [orderNote, setOrderNote] = useState("");

  if (loading) return <PageLoader />;
  if (error || !dish) return <PageError message={error ?? "Dish not found"} />;

  const Icon       = sourceIcons[dish.source_type] ?? ChefHat;
  const emoji      = FOOD_EMOJIS[dish.cuisine] ?? "🍽";
  const sourceLink = `${sourceLinkPrefix[dish.source_type] ?? "/"}${dish.source_id}`;
  const avgRating  = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  const related = relatedDishes.filter((d) => d.id !== dish.id).slice(0, 4);

  // Bulk price logic
  const minBulkQty     = dish.min_bulk_qty ?? 20;
  const isBulkEligible = dish.bulk_price !== null && qty >= minBulkQty;
  const effectivePrice = isBulkEligible ? Number(dish.bulk_price) : Number(dish.price);
  const totalPrice     = effectivePrice * qty;

  const handleAddToCart = () => {
    addItem({
      id:           dish.id,
      name:         dish.name,
      cuisine:      dish.cuisine,
      meal_type:    dish.meal_type,
      source_type:  dish.source_type,
      source_id:    dish.source_id,
      source_name:  `${dish.source_type.replace(/_/g, " ")} — ${dish.source_id.slice(0, 8)}`,
      price:        Number(dish.price),
      bulk_price:   dish.bulk_price ? Number(dish.bulk_price) : null,
      min_bulk_qty: minBulkQty,
      quantity:     qty,
      image_url:    dish.image_url ?? null,
      diet_type:    dish.diet_type,
      spice_level:  dish.spice_level ?? "MEDIUM",
      is_spicy:     dish.is_spicy ?? false,
    });
    addToast(`${dish.name} added to cart!`, "success");
    // CartContext.addItem auto-opens the drawer
  };

  const tabs = [
    {
      id: "details",
      label: "Details",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Cuisine",    value: cuisineLabel(dish.cuisine) },
              { label: "Meal Type",  value: <MealTypeBadge meal_type={dish.meal_type} /> },
              { label: "Diet",       value: <DietBadge diet_type={dish.diet_type} /> },
              { label: "Spice",      value: dish.is_spicy ? <SpiceBadge spice_level={dish.spice_level ?? "HOT"} /> : "🌿 Mild" },
              { label: "Base Price", value: `₹${dish.price}` },
              { label: "Bulk Price", value: dish.bulk_price ? `₹${dish.bulk_price} (min ${minBulkQty} units)` : "On request" },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 bg-[#F6FFF8] rounded-xl border border-[#E8F5EC]">
                <p className="text-xs text-[#7A9A88] font-medium mb-1">{label}</p>
                <div className="text-sm font-semibold text-[#1B2D24]">{value}</div>
              </div>
            ))}
          </div>
          {dish.description && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#7A9A88] mb-2">About</p>
              <p className="text-sm text-[#4A6357] leading-relaxed">{dish.description}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "reviews",
      label: `Reviews${reviews.length ? ` (${reviews.length})` : ""}`,
      content: reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      ) : (
        <p className="text-sm text-[#7A9A88] py-4">No reviews yet for this dish.</p>
      ),
    },
    {
      id: "source",
      label: "Made By",
      content: (
        <div className="p-5 bg-[#EEF8F1] rounded-xl border border-[#D4E8DA] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D6A4F] flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-[#7A9A88] font-medium">
                {dish.source_type.replace(/_/g, " ")}
              </p>
              <p className="text-sm font-semibold text-[#1B2D24]">Source ID: {dish.source_id.slice(0,8)}…</p>
            </div>
          </div>
          <Link to={sourceLink} className="inline-flex items-center gap-2 text-sm font-semibold text-[#2D6A4F] hover:underline mt-1">
            View full profile →
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6FFF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: "Catalog", href: "/catalog" },
            { label: cuisineLabel(dish.cuisine), href: `/catalog?cuisine=${dish.cuisine}` },
            { label: dish.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-br from-[#EEF8F1] to-[#D8F3DC] rounded-3xl flex items-center justify-center overflow-hidden aspect-square max-h-[420px]"
          >
            <span className="text-[120px]">{emoji}</span>
            {dish.is_spicy && (
              <span className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFEBEE] text-[#D32F2F] text-xs font-bold">
                <Flame className="w-3.5 h-3.5" /> Spicy
              </span>
            )}
            <div className="absolute bottom-4 left-4">
              <SourceBadge source_type={dish.source_type} source_link={sourceLink} />
            </div>
          </motion.div>

          {/* Right: info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:pt-4"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#52B788] mb-2">
              {cuisineLabel(dish.cuisine)}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1B2D24] leading-tight mb-3">
              {dish.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mb-5">
              <DietBadge diet_type={dish.diet_type} />
              <MealTypeBadge meal_type={dish.meal_type} />
              {dish.is_spicy && <SpiceBadge spice_level={dish.spice_level ?? "HOT"} />}
              {avgRating && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9E1] border border-[#F59E0B]/20 text-xs font-semibold text-[#B45309]">
                  <RatingStars rating={avgRating} size="sm" />
                  {avgRating.toFixed(1)} ({reviews.length})
                </span>
              )}
            </div>

            {dish.description && (
              <p className="text-[#4A6357] text-sm leading-relaxed mb-5 line-clamp-3">
                {dish.description}
              </p>
            )}

            {/* Price card */}
            <div className="p-5 bg-white border border-[#D4E8DA] rounded-2xl mb-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-[#1B2D24] font-serif">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
                {isBulkEligible && dish.bulk_price && (
                  <span className="text-sm text-[#2D6A4F] font-semibold">
                    · Bulk rate ₹{dish.bulk_price}/unit
                  </span>
                )}
                {!isBulkEligible && dish.bulk_price && (
                  <span className="text-sm text-[#7A9A88]">· Bulk ₹{dish.bulk_price}/unit</span>
                )}
              </div>
              <p className="text-xs text-[#7A9A88]">
                ₹{effectivePrice} × {qty} unit{qty > 1 ? "s" : ""}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-4 mt-4">
                <span className="text-sm font-medium text-[#4A6357]">Qty</span>
                <QuantitySelector value={qty} min={1} max={999} onChange={setQty} />
              </div>

              {/* Bulk savings badge */}
              {dish.bulk_price && qty >= minBulkQty && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#D8F3DC] mt-3"
                >
                  <Tag size={14} className="text-[#2D6A4F] flex-shrink-0" />
                  <span className="text-xs font-semibold text-[#1B4332]">
                    Bulk price applied — saving ₹{((Number(dish.price) - Number(dish.bulk_price)) * qty).toLocaleString("en-IN")} on this order
                  </span>
                </motion.div>
              )}

              {/* Note */}
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Any special instructions? (optional)"
                rows={2}
                className="mt-4 w-full text-sm p-3 rounded-xl border border-[#D4E8DA] bg-[#F6FFF8] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] resize-none placeholder:text-[#7A9A88] text-[#1B2D24]"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#2D6A4F] text-white text-sm font-bold hover:bg-[#1B4332] transition-colors shadow-sm hover:shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart — ₹{totalPrice.toLocaleString("en-IN")}
              </motion.button>
              <Link
                to="/for-business"
                className="px-6 py-3.5 rounded-full border border-[#D4E8DA] text-sm font-semibold text-[#4A6357] hover:bg-[#EEF8F1] transition-colors text-center"
              >
                Enquire for Bulk
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs tabs={tabs} defaultTab="details" />
        </div>

        {/* Related dishes */}
        {related.length > 0 && (
          <div className="mt-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#7A9A88] mb-4">More from the same source</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link key={r.id} to={`/dish/${r.id}`} className="group block bg-white rounded-2xl overflow-hidden ring-1 ring-[#D4E8DA] hover:shadow-md transition-all">
                  <div className="h-24 bg-gradient-to-br from-[#EEF8F1] to-[#D8F3DC] flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-200">
                    {FOOD_EMOJIS[r.cuisine] ?? "🍽"}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-[#1B2D24] line-clamp-1">{r.name}</p>
                    <p className="text-xs font-bold text-[#2D6A4F] mt-0.5">₹{r.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DishDetailPage;
