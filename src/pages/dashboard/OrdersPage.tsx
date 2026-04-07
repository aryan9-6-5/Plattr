import { Link } from "react-router-dom";
import { UtensilsCrossed, ArrowRight } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/utils/formatDate";
import { formatRupees } from "@/utils/formatCurrency";

const OrdersPage = () => {
  const { orders, loading, error } = useOrders();

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold text-[#1B2D24]">My Orders</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 ring-1 ring-[#D4E8DA] animate-pulse h-16" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-[#D32F2F] bg-[#FFEBEE] px-4 py-3 rounded-xl">{error}</p>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No orders yet"
          description="Start by exploring our dish catalog"
          actionLabel="Browse Catalog"
          actionHref="/catalog"
        />
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-[#D4E8DA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="border-b border-[#E8F5EC]">
                <tr>
                  {["Order #", "Placed On", "Delivery", "Meal Type", "Amount", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#7A9A88]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6FFF8]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F6FFF8] transition-colors group">
                    <td className="px-5 py-4 font-mono text-xs text-[#4A6357]">{o.order_number ?? o.id.slice(0,8)}</td>
                    <td className="px-5 py-4 text-[#4A6357]">{formatDate(o.created_at)}</td>
                    <td className="px-5 py-4 text-[#4A6357]">{formatDate(o.delivery_date)}</td>
                    <td className="px-5 py-4 text-[#4A6357] capitalize">{o.meal_type?.toLowerCase() ?? "—"}</td>
                    <td className="px-5 py-4 font-semibold text-[#1B2D24]">{formatRupees(o.total_amount)}</td>
                    <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-4">
                      <Link
                        to={`/dashboard/orders/${o.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D6A4F]
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:underline"
                      >
                        View <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
