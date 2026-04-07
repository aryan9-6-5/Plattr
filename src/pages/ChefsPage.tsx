import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, CheckCircle, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useChefs } from "@/hooks/useChefs";
import PageHeader from "@/components/ui/PageHeader";
import PageError from "@/components/ui/PageError";
import EmptyState from "@/components/ui/EmptyState";
import RatingStars from "@/components/ui/RatingStars";

const REGIONS = ["All","Hyderabad","Mumbai","Bangalore","Chennai","Delhi","Kolkata","Pune","Jaipur","Lucknow"];

const ChefCardSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 animate-pulse ring-1 ring-[#D4E8DA]">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 rounded-full bg-[#EEF8F1]" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-[#EEF8F1] rounded w-3/4" />
        <div className="h-3 bg-[#EEF8F1] rounded w-1/2" />
      </div>
    </div>
    <div className="h-3 bg-[#EEF8F1] rounded mb-2" />
    <div className="h-3 bg-[#EEF8F1] rounded w-2/3" />
  </div>
);

const ChefsPage = () => {
  const [regionFilter, setRegionFilter] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);

  const { chefs, loading, error } = useChefs({
    city: regionFilter !== "All" ? regionFilter : undefined,
    is_available: onlyAvailable ? true : undefined,
    is_verified: onlyVerified ? true : undefined,
  });

  return (
    <div className="min-h-screen bg-[#F6FFF8]">
      <PageHeader
        eyebrow="Our Chefs"
        title="The Hands Behind Every Meal"
        description="Verified home cooks with deep regional expertise. Each chef is onboarded through our quality process."
        badge={`${chefs.length ?? "–"} Active Chefs`}
      />

      {/* Filters */}
      <div className="bg-white border-b border-[#E8F5EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A9A88]">City</span>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                    regionFilter === r
                      ? "bg-[#2D6A4F] text-white border-[#2D6A4F]"
                      : "bg-white text-[#4A6357] border-[#D4E8DA] hover:bg-[#EEF8F1]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-3 ml-auto">
              {[
                { label: "✓ Verified", state: onlyVerified, set: setOnlyVerified },
                { label: "⚡ Available", state: onlyAvailable, set: setOnlyAvailable },
              ].map(({ label, state, set }) => (
                <button
                  key={label}
                  onClick={() => set(!state)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                    state ? "bg-[#2D6A4F] text-white border-[#2D6A4F]" : "bg-white text-[#4A6357] border-[#D4E8DA]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error ? (
          <PageError message={error} />
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <ChefCardSkeleton key={i} />)}
          </div>
        ) : chefs.length === 0 ? (
          <EmptyState
            title="No chefs found"
            description="Try adjusting your filters"
            actionLabel="Clear filters"
            onAction={() => { setRegionFilter("All"); setOnlyAvailable(false); setOnlyVerified(false); }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {chefs.map((chef, i) => (
              <motion.div
                key={chef.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.05, duration: 0.4 }}
              >
                <Link
                  to={`/chefs/${chef.id}`}
                  className="group block bg-white rounded-3xl p-6 ring-1 ring-[#D4E8DA] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Chef avatar + name */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#52B788] flex items-center justify-center text-white text-2xl font-bold font-serif">
                        {chef.name?.[0] ?? "C"}
                      </div>
                      {chef.is_verified && (
                        <CheckCircle className="absolute -bottom-0.5 -right-0.5 w-5 h-5 text-[#2D6A4F] bg-white rounded-full" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#1B2D24] group-hover:text-[#2D6A4F] transition-colors">{chef.name}</h3>
                      <p className="text-xs text-[#7A9A88] mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {chef.region}
                        {chef.city && ` · ${chef.city}`}
                      </p>
                      {chef.rating != null && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <RatingStars rating={chef.rating} size="sm" />
                          <span className="text-xs text-[#7A9A88]">({chef.total_reviews ?? 0})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {chef.specialty && (
                    <p className="text-xs text-[#4A6357] leading-relaxed line-clamp-2 mb-3">
                      {chef.specialty}
                    </p>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    {chef.is_available && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D8F3DC] text-[#1B4332]">
                        Available Now
                      </span>
                    )}
                    {chef.years_exp && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF8F1] text-[#4A6357]">
                        {chef.years_exp}+ yrs exp
                      </span>
                    )}
                    <span className="ml-auto text-xs text-[#52B788] font-semibold group-hover:translate-x-1 transition-transform duration-200 inline-block">
                      View →
                    </span>
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

export default ChefsPage;
