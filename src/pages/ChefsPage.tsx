import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, CheckCircle, MapPin, ChevronDown, Filter, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChefs } from "@/hooks/useChefs";
import PageHeader from "@/components/ui/PageHeader";
import PageError from "@/components/ui/PageError";
import EmptyState from "@/components/ui/EmptyState";
import ChefCard from "@/components/food/ChefCard";

const REGIONS = ["All","Hyderabad","Mumbai","Bangalore","Chennai","Delhi","Kolkata","Pune","Jaipur","Lucknow"];

const ChefCardSkeleton = () => (
  <div className="bg-white rounded-[40px] p-10 animate-pulse border border-[#E5E1D8]">
    <div className="flex items-center gap-8 mb-8">
      <div className="w-24 h-24 rounded-full bg-[#F3F2EE]" />
      <div className="flex-1 space-y-4">
        <div className="h-5 bg-[#F3F2EE] rounded w-3/4" />
        <div className="h-4 bg-[#F3F2EE] rounded w-1/2" />
      </div>
    </div>
    <div className="h-4 bg-[#F3F2EE] rounded mb-4" />
    <div className="h-4 bg-[#F3F2EE] rounded w-2/3" />
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
    <div className="min-h-screen bg-[#FDFCF8]">
      <PageHeader
        eyebrow="The Circle of Artisans"
        title="Master Hands. Heritage Recipes."
        description="Verified regional specialists with deep culinary lineage. Every artisan is onboarded through our rigorous 12-point quality protocol."
        badge={`${chefs.length ?? "–"} Verified Artisans`}
      />

      {/* Editorial Filter Bar */}
      <div className="bg-[#FDFCF8]/90 backdrop-blur-xl border-b border-[#E5E1D8] relative z-30 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="flex flex-wrap items-center gap-6">
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1B4332]">
                  <MapPin size={16} strokeWidth={3} />
                </span>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="pl-14 pr-14 py-4 rounded-2xl border border-[#E5E1D8] bg-white text-[11px] font-black uppercase tracking-[0.2em] text-[#1B2D24] focus:outline-none focus:ring-4 focus:ring-[#1B4332]/5 appearance-none cursor-pointer hover:border-[#1B4332] transition-all duration-500 shadow-sm hover:shadow-xl"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r === "All" ? "Global Network" : r}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A9A88] pointer-events-none group-hover:text-[#1B4332] transition-colors" />
              </div>

              <div className="h-10 w-px bg-[#E5E1D8] hidden lg:block" />

              <div className="flex gap-4">
                {[
                  { label: "Vetted", state: onlyVerified, set: setOnlyVerified, icon: CheckCircle },
                  { label: "Active Pipeline", state: onlyAvailable, set: setOnlyAvailable, icon: ArrowRight },
                ].map(({ label, state, set }) => (
                  <button
                    key={label}
                    onClick={() => set(!state)}
                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-700 ${
                      state 
                        ? "bg-[#1B4332] text-white border-transparent shadow-[0_15px_40px_-10px_rgba(27,67,50,0.3)] scale-105" 
                        : "bg-white text-[#4A6357] border-[#E5E1D8] hover:border-[#1B4332] hover:text-[#1B4332]"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${state ? "bg-[#D8F3DC] animate-pulse" : "bg-current opacity-30"}`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#7A9A88] ml-auto lg:ml-0">
              <Filter className="w-4 h-4" />
              <span>{chefs.length} Artisans Synced</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-24">
        {error ? (
          <PageError message={error} />
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array.from({ length: 6 }).map((_, i) => <ChefCardSkeleton key={i} />)}
          </div>
        ) : chefs.length === 0 ? (
          <EmptyState
            title="The circle is expanding"
            description="No artisans currently match the specified protocol filters."
            actionLabel="Reset Pipeline"
            onAction={() => { setRegionFilter("All"); setOnlyAvailable(false); setOnlyVerified(false); }}
          />
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-12"
          >
            <AnimatePresence mode="popLayout">
              {chefs.map((chef, i) => (
                <ChefCard key={chef.id} chef={chef} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChefsPage;
