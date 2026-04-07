import { useParams, Link } from "react-router-dom";
import { Building2, MapPin, Activity, Phone, Mail } from "lucide-react";
import { useKitchen } from "@/hooks/useKitchen";
import { useDishesBySource } from "@/hooks/useDishesBySource";
import PageLoader from "@/components/ui/PageLoader";
import PageError from "@/components/ui/PageError";
import Breadcrumb from "@/components/PageBreadcrumb";
import MealTypeBadge from "@/components/ui/MealTypeBadge";

const FOOD_EMOJIS: Record<string, string> = {
  HYDERABADI:"🍛",NORTH_INDIAN:"🫓",SOUTH_INDIAN:"🥘",GUJARATI:"🫙",BENGALI:"🐟",
  MAHARASHTRIAN:"🌿",KERALA:"🥥",MUGHLAI:"🍢",CHETTINAD:"🌶",AWADHI:"🍖",COASTAL:"🦐",
};

const KitchenDetailPage = () => {
  const { id } = useParams();
  const { kitchen, loading, error } = useKitchen(id);
  const { dishes } = useDishesBySource("CLOUD_KITCHEN", id);

  if (loading) return <PageLoader />;
  if (error || !kitchen) return <PageError message={error ?? "Kitchen not found"} />;

  return (
    <div className="min-h-screen bg-[#F6FFF8]">
      <div className="bg-gradient-to-br from-[#1B4332] to-[#0F2318] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: "Kitchens", href: "/kitchens" }, { label: kitchen.name }]}
          />
          <div className="flex items-center gap-6 mt-4">
            <div className="w-18 h-18 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm p-4">
              <Building2 className="w-10 h-10 text-[#52B788]" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-white">{kitchen.name}</h1>
              {kitchen.city && (
                <p className="text-white/60 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {kitchen.city}
                  {kitchen.address && ` · ${kitchen.address}`}
                </p>
              )}
              {kitchen.is_active && (
                <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-[#1B4332] text-xs font-bold">
                  <Activity className="w-3 h-3" /> Operational
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Dishes col */}
          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#7A9A88] mb-5">
              Available Dishes ({dishes.length})
            </p>
            {dishes.length === 0 ? (
              <p className="text-sm text-[#7A9A88] py-4">No dishes listed for this kitchen.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {dishes.map((dish) => (
                  <Link key={dish.id} to={`/dish/${dish.id}`}
                    className="group block bg-white rounded-2xl overflow-hidden ring-1 ring-[#D4E8DA] hover:shadow-md transition-all"
                  >
                    <div className="h-24 bg-gradient-to-br from-[#EEF8F1] to-[#D8F3DC] flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-200">
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
            )}
          </div>

          {/* Stats sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 ring-1 ring-[#D4E8DA]">
              <p className="text-xs font-bold uppercase tracking-widest text-[#7A9A88] mb-4">Kitchen Info</p>
              <dl className="space-y-3">
                {kitchen.capacity_per_day && (
                  <div>
                    <dt className="text-xs text-[#7A9A88]">Daily Capacity</dt>
                    <dd className="text-sm font-semibold text-[#1B2D24]">
                      {kitchen.capacity_per_day.toLocaleString("en-IN")} meals/day
                    </dd>
                  </div>
                )}
                {kitchen.rating && (
                  <div>
                    <dt className="text-xs text-[#7A9A88]">Rating</dt>
                    <dd className="text-sm font-semibold text-[#1B2D24]">{kitchen.rating.toFixed(1)} ★</dd>
                  </div>
                )}
              </dl>
            </div>

            {(kitchen.contact_phone || kitchen.contact_email) && (
              <div className="bg-white rounded-2xl p-5 ring-1 ring-[#D4E8DA]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#7A9A88] mb-4">Contact</p>
                {kitchen.contact_phone && (
                  <a href={`tel:${kitchen.contact_phone}`} className="flex items-center gap-2 text-sm text-[#4A6357] hover:text-[#2D6A4F] mb-2">
                    <Phone className="w-3.5 h-3.5" /> {kitchen.contact_phone}
                  </a>
                )}
                {kitchen.contact_email && (
                  <a href={`mailto:${kitchen.contact_email}`} className="flex items-center gap-2 text-sm text-[#4A6357] hover:text-[#2D6A4F]">
                    <Mail className="w-3.5 h-3.5" /> {kitchen.contact_email}
                  </a>
                )}
              </div>
            )}

            {kitchen.description && (
              <div className="bg-[#EEF8F1] rounded-2xl p-5 border border-[#D4E8DA]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#7A9A88] mb-2">About</p>
                <p className="text-sm text-[#4A6357] leading-relaxed">{kitchen.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenDetailPage;
