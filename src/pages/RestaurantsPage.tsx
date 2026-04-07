import { Link } from "react-router-dom";
import { UtensilsCrossed, MapPin, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useRestaurants } from "@/hooks/useRestaurants";
import PageHeader from "@/components/ui/PageHeader";
import PageError from "@/components/ui/PageError";
import RatingStars from "@/components/ui/RatingStars";

const RestaurantCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 animate-pulse ring-1 ring-[#D4E8DA] flex gap-5">
    <div className="w-16 h-16 rounded-xl bg-[#EEF8F1] flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-[#EEF8F1] rounded w-2/3" />
      <div className="h-3 bg-[#EEF8F1] rounded w-1/3" />
      <div className="h-3 bg-[#EEF8F1] rounded w-3/4 mt-2" />
    </div>
  </div>
);

const RestaurantsPage = () => {
  const { restaurants, loading, error } = useRestaurants();

  return (
    <div className="min-h-screen bg-[#F6FFF8]">
      <PageHeader
        eyebrow="Restaurant Partners"
        title="Trusted Brand Partners"
        description="We partner with established restaurants to bring their signature, quality-assured dishes into the Plattr network."
        badge={`${restaurants.length} Partners`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error ? (
          <PageError message={error} />
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <RestaurantCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {restaurants.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 6) * 0.06, duration: 0.4 }}
              >
                <Link
                  to={`/restaurants/${r.id}`}
                  className="group flex gap-5 bg-white rounded-2xl p-5 ring-1 ring-[#D4E8DA] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#EEF8F1] to-[#D8F3DC] flex items-center justify-center flex-shrink-0">
                    <UtensilsCrossed className="w-7 h-7 text-[#2D6A4F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-[#1B2D24] group-hover:text-[#2D6A4F] transition-colors">
                          {r.name}
                        </h3>
                        {r.brand && (
                          <p className="text-xs text-[#7A9A88]">{r.brand}</p>
                        )}
                      </div>
                      {r.is_partner && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D8F3DC] text-[#1B4332] text-[10px] font-bold flex-shrink-0">
                          <BadgeCheck className="w-3 h-3" /> Partner
                        </span>
                      )}
                    </div>

                    {r.city && (
                      <p className="text-xs text-[#7A9A88] flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {r.city}
                        {r.cuisine_region && ` · ${r.cuisine_region}`}
                      </p>
                    )}

                    {r.rating && (
                      <div className="mt-1.5">
                        <RatingStars rating={r.rating} size="sm" showValue />
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;
