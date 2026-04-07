import { useParams, Link } from "react-router-dom";
import { MapPin, CheckCircle, Star, ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import { useChef } from "@/hooks/useChef";
import { useDishesBySource } from "@/hooks/useDishesBySource";
import { useReviews } from "@/hooks/useReviews";
import PageLoader from "@/components/ui/PageLoader";
import PageError from "@/components/ui/PageError";
import Breadcrumb from "@/components/PageBreadcrumb";
import RatingStars from "@/components/ui/RatingStars";
import ReviewCard from "@/components/ui/ReviewCard";
import MealTypeBadge from "@/components/ui/MealTypeBadge";
import Tabs from "@/components/ContentTabs";

const FOOD_EMOJIS: Record<string, string> = {
  HYDERABADI:"🍛",NORTH_INDIAN:"🫓",SOUTH_INDIAN:"🥘",GUJARATI:"🫙",BENGALI:"🐟",
  MAHARASHTRIAN:"🌿",KERALA:"🥥",MUGHLAI:"🍢",CHETTINAD:"🌶",AWADHI:"🍖",COASTAL:"🦐",
};

const ChefProfilePage = () => {
  const { id } = useParams();
  const { chef, loading, error } = useChef(id);
  const { dishes } = useDishesBySource("HOME_CHEF", id);
  const { reviews } = useReviews("CHEF", id);

  if (loading) return <PageLoader />;
  if (error || !chef) return <PageError message={error ?? "Chef not found"} />;

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : chef.rating ?? null;

  const stats = [
    { label: "Dishes",   value: dishes.length },
    { label: "Reviews",  value: chef.total_reviews ?? reviews.length },
    { label: "Rating",   value: avgRating ? `${avgRating.toFixed(1)} ★` : "—" },
    { label: "Experience", value: chef.years_exp ? `${chef.years_exp} yrs` : "—" },
  ];

  const tabs = [
    {
      id: "dishes",
      label: `Dishes (${dishes.length})`,
      content: dishes.length === 0 ? (
        <p className="text-sm text-[#7A9A88] py-4">No dishes listed yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {dishes.map((dish) => (
            <Link key={dish.id} to={`/dish/${dish.id}`} className="group block bg-white rounded-2xl overflow-hidden ring-1 ring-[#D4E8DA] hover:shadow-md transition-all">
              <div className="h-28 bg-gradient-to-br from-[#EEF8F1] to-[#D8F3DC] flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-200">
                {FOOD_EMOJIS[dish.cuisine] ?? "🍽"}
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-[#1B2D24] line-clamp-1">{dish.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-bold text-[#2D6A4F]">₹{dish.price}</span>
                  <MealTypeBadge meal_type={dish.meal_type} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ),
    },
    {
      id: "reviews",
      label: `Reviews (${reviews.length})`,
      content: reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      ) : (
        <p className="text-sm text-[#7A9A88] py-4">No reviews yet.</p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6FFF8]">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-[#1B4332] to-[#0F2318] py-16 overflow-hidden">
        {/* decorative rings */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          {[1,2,3].map((i) => (
            <div key={i} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white`}
              style={{ width: i * 200, height: i * 200 }} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Breadcrumb
            items={[{ label: "Chefs", href: "/chefs" }, { label: chef.name }]}
          />
          <div className="flex flex-col items-center text-center mt-4">
            {/* Avatar ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="relative mb-5"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#52B788] to-[#2D6A4F] flex items-center justify-center text-white text-4xl font-bold font-serif ring-4 ring-white/20">
                {chef.name?.[0] ?? "C"}
              </div>
              {chef.is_verified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#2D6A4F]" />
                </div>
              )}
            </motion.div>

            <h1 className="font-serif text-3xl font-bold text-white">{chef.name}</h1>
            <p className="text-white/60 text-sm mt-1 flex items-center gap-1 justify-center">
              <MapPin className="w-3.5 h-3.5" />
              {chef.region}{chef.city && ` · ${chef.city}`}
            </p>
            {chef.specialty && (
              <p className="text-white/70 text-sm mt-2 max-w-md leading-relaxed">{chef.specialty}</p>
            )}
            {avgRating && (
              <div className="flex items-center gap-2 mt-3">
                <RatingStars rating={avgRating} showValue />
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6 max-w-sm w-full">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
                  <p className="text-lg font-bold text-white font-serif">{s.value}</p>
                  <p className="text-[10px] text-white/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {chef.bio && (
          <div className="bg-white rounded-2xl p-5 ring-1 ring-[#D4E8DA] mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#7A9A88] mb-2">About</p>
            <p className="text-sm text-[#4A6357] leading-relaxed">{chef.bio}</p>
          </div>
        )}
        <Tabs tabs={tabs} defaultTab="dishes" />
      </div>
    </div>
  );
};

export default ChefProfilePage;
