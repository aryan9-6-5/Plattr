import { Link } from "react-router-dom";
import { Building2, MapPin, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useKitchens } from "@/hooks/useKitchens";
import PageHeader from "@/components/ui/PageHeader";
import PageError from "@/components/ui/PageError";

const KitchenCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 animate-pulse ring-1 ring-[#D4E8DA]">
    <div className="h-4 bg-[#EEF8F1] rounded w-2/3 mb-3" />
    <div className="h-3 bg-[#EEF8F1] rounded w-1/2 mb-5" />
    <div className="h-2.5 bg-[#EEF8F1] rounded mb-2 w-full" />
    <div className="h-5 bg-[#D8F3DC] rounded-full mt-3 w-1/3" />
  </div>
);

const KitchensPage = () => {
  const { kitchens, loading, error } = useKitchens();

  return (
    <div className="min-h-screen bg-[#F6FFF8]">
      <PageHeader
        eyebrow="Cloud Kitchens"
        title="Production-Grade Kitchen Network"
        description="Our partner cloud kitchens are certified facilities built for scale, consistency, and food safety at every level."
        badge={`${kitchens.length} Kitchens`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error ? (
          <PageError message={error} />
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <KitchenCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kitchens.map((kitchen, i) => {
              const capacityPct = kitchen.capacity_per_day
                ? Math.min(100, Math.round((kitchen.capacity_per_day / 2000) * 100))
                : null;
              return (
                <motion.div
                  key={kitchen.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 8) * 0.05, duration: 0.4 }}
                >
                  <Link
                    to={`/kitchens/${kitchen.id}`}
                    className="group block bg-white rounded-2xl p-6 ring-1 ring-[#D4E8DA] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EEF8F1] flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-[#2D6A4F]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#1B2D24] group-hover:text-[#2D6A4F] transition-colors">
                          {kitchen.name}
                        </h3>
                        {kitchen.city && (
                          <p className="text-xs text-[#7A9A88] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {kitchen.city}
                          </p>
                        )}
                      </div>
                    </div>

                    {kitchen.description && (
                      <p className="text-xs text-[#4A6357] line-clamp-2 mb-4 leading-relaxed">
                        {kitchen.description}
                      </p>
                    )}

                    {capacityPct !== null && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#7A9A88]">Capacity Utilisation</p>
                          <p className="text-[10px] font-bold text-[#4A6357]">
                            {kitchen.capacity_per_day?.toLocaleString("en-IN")} meals/day
                          </p>
                        </div>
                        <div className="h-1.5 bg-[#EEF8F1] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${capacityPct}%` }}
                            transition={{ delay: i * 0.05 + 0.3, duration: 0.6, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              capacityPct > 75 ? "bg-[#52B788]" : "bg-[#2D6A4F]"
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {kitchen.is_active && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-[#1B4332] text-[10px] font-bold flex items-center gap-1">
                          <Activity className="w-2.5 h-2.5" /> Active
                        </span>
                      )}
                      <span className="ml-auto text-xs text-[#52B788] font-semibold group-hover:translate-x-1 transition-transform duration-200">
                        View →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchensPage;
