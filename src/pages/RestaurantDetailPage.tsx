import { useParams, Link } from "react-router-dom";
import { UtensilsCrossed, MapPin, BadgeCheck, Phone, Shield } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
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

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { restaurant, loading, error } = useRestaurant(id);
  const { dishes } = useDishesBySource("RESTAURANT", id);
  const { reviews } = useReviews("RESTAURANT", id);

  if (loading) return <PageLoader />;
  if (error || !restaurant) return <PageError message={error ?? "Restaurant not found"} />;

  const tabs = [
    {
      id: "menu",
      label: `Menu (${dishes.length})`,
      content: dishes.length === 0 ? (
        <p className="text-sm text-[#7A9A88] py-4">No dishes listed yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {dishes.map((dish) => (
            <Link key={dish.id} to={`/dish/${dish.id}`}
              className="group block bg-white rounded-2xl overflow-hidden ring-1 ring-[#D4E8DA] hover:shadow-md transition-all"
            >
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
    {
      id: "info",
      label: "Info",
      content: (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Restaurant", value: restaurant.name },
            { label: "Brand", value: restaurant.brand },
            { label: "City", value: restaurant.city },
            { label: "Cuisine Region", value: restaurant.cuisine_region },
            { label: "FSSAI License", value: restaurant.fssai_license },
            { label: "Contact", value: restaurant.contact_phone },
          ].filter(({ value }) => !!value).map(({ label, value }) => (
            <div key={label} className="p-4 bg-[#F6FFF8] rounded-xl border border-[#E8F5EC]">
              <dt className="text-xs text-[#7A9A88] font-medium mb-1">{label}</dt>
              <dd className="text-sm font-semibold text-[#1B2D24]">{value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6FFF8]">
      {/* Dark hero */}
      <div className="bg-gradient-to-br from-[#1B4332] to-[#0F2318] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: "Restaurants", href: "/restaurants" }, { label: restaurant.name }]}
          />
          <div className="flex flex-col items-center text-center mt-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm mb-5">
              <UtensilsCrossed className="w-10 h-10 text-[#52B788]" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">{restaurant.name}</h1>
            {restaurant.brand && (
              <p className="text-white/60 text-sm mt-0.5">{restaurant.brand}</p>
            )}
            {restaurant.city && (
              <p className="text-white/50 text-xs flex items-center gap-1 mt-1.5">
                <MapPin className="w-3.5 h-3.5" /> {restaurant.city}
                {restaurant.cuisine_region && ` · ${restaurant.cuisine_region}`}
              </p>
            )}
            <div className="flex items-center gap-3 mt-3">
              {restaurant.is_partner && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#D8F3DC]/20 text-[#52B788] text-xs font-bold border border-[#52B788]/30">
                  <BadgeCheck className="w-3.5 h-3.5" /> Verified Partner
                </span>
              )}
              {restaurant.rating && <RatingStars rating={restaurant.rating} showValue />}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {restaurant.description && (
          <div className="bg-white rounded-2xl p-5 ring-1 ring-[#D4E8DA] mb-8">
            <p className="text-sm text-[#4A6357] leading-relaxed">{restaurant.description}</p>
            {restaurant.fssai_license && (
              <p className="text-xs text-[#7A9A88] flex items-center gap-1.5 mt-3">
                <Shield className="w-3.5 h-3.5" /> FSSAI: {restaurant.fssai_license}
              </p>
            )}
          </div>
        )}
        <Tabs tabs={tabs} defaultTab="menu" />
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
