import { Link } from "react-router-dom";
import { RefreshCw, Calendar, MapPin } from "lucide-react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/utils/formatDate";
import { formatRupees } from "@/utils/formatCurrency";

const SubscriptionsPage = () => {
  const { subscriptions, loading, error } = useSubscriptions();

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold text-[#1B2D24]">My Subscriptions</h1>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 ring-1 ring-[#D4E8DA] animate-pulse h-32" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-[#D32F2F] bg-[#FFEBEE] px-4 py-3 rounded-xl">{error}</p>
      ) : subscriptions.length === 0 ? (
        <EmptyState
          icon={RefreshCw}
          title="No active subscriptions"
          description="Subscribe to a tiffin plan to get daily meals delivered"
          actionLabel="Browse Tiffin Plans"
          actionHref="/catalog?meal_type=TIFFIN"
        />
      ) : (
        <div className="grid gap-4">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl p-6 ring-1 ring-[#D4E8DA]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1B2D24]">{sub.plan ?? "Tiffin Plan"}</h3>
                  <p className="text-xs text-[#7A9A88] mt-0.5">{sub.meal_type?.replace(/_/g, " ")}</p>
                </div>
                <StatusBadge status={sub.status} type="subscription" />
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Start Date",   value: formatDate(sub.start_date) },
                  { label: "End Date",     value: formatDate(sub.end_date) },
                  { label: "Meals/Day",    value: sub.meals_per_day ?? "—" },
                  { label: "Price/Meal",   value: sub.price_per_meal ? formatRupees(sub.price_per_meal) : "—" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-[10px] text-[#7A9A88] font-bold uppercase tracking-wider mb-0.5">{label}</dt>
                    <dd className="text-sm font-semibold text-[#1B2D24]">{String(value)}</dd>
                  </div>
                ))}
              </dl>
              {sub.delivery_address && (
                <p className="mt-4 text-xs text-[#7A9A88] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {sub.delivery_address}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
