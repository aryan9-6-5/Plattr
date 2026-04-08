import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Package } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate } from "@/utils/formatDate";
import { formatRupees } from "@/utils/formatCurrency";

const ORDER_STATUSES = [
  { key: "PENDING",          label: "Order Placed",           icon: "📋" },
  { key: "CONFIRMED",        label: "Confirmed",              icon: "✅" },
  { key: "PREPARING",        label: "Preparing",              icon: "👨‍🍳" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery",       icon: "🚚" },
  { key: "DELIVERED",        label: "Delivered",              icon: "🎉" },
] as const;

type OrderStatus = typeof ORDER_STATUSES[number]["key"];

type OrderItem = {
  id:         string;
  quantity:   number;
  unit_price: number;
  dish_id:    string;
  dishes?: {
    id:        string;
    name:      string;
    cuisine:   string;
    meal_type: string;
  } | null;
};

type FullOrder = {
  id:               string;
  order_number:     string | null;
  status:           string;
  created_at:       string;
  delivery_date:    string | null;
  delivery_address: string | null;
  total_amount:     number;
  subtotal:         number;
  discount_amount:  number;
  delivery_fee:     number;
  tax_amount:       number;
  payment_method:   string | null;
  payment_status:   string;
  meal_type:        string;
  special_notes:    string | null;
  order_items:      OrderItem[];
};

const FOOD_EMOJIS: Record<string, string> = {
  HYDERABADI:"🍛",NORTH_INDIAN:"🫓",SOUTH_INDIAN:"🥘",GUJARATI:"🫙",BENGALI:"🐟",
  MAHARASHTRIAN:"🌿",KERALA:"🥥",MUGHLAI:"🍢",CHETTINAD:"🌶",AWADHI:"🍖",COASTAL:"🦐",
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder]     = useState<FullOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id || !user) return;
    const fetch = async () => {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("orders")
        .select(`
          id, order_number, status, created_at,
          delivery_date, delivery_address,
          total_amount, subtotal, discount_amount,
          delivery_fee, tax_amount,
          payment_method, payment_status,
          meal_type, special_notes,
          order_items (
            id, quantity, unit_price, dish_id,
            dishes ( id, name, cuisine, meal_type )
          )
        `)
        .eq("id", id)
        .eq("customer_id", user.id)
        .single();

      if (err) setError("Order not found");
      else      setOrder(data as unknown as FullOrder);
      setLoading(false);
    };
    fetch();
  }, [id, user?.id]);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !order) return (
    <div className="text-center py-24">
      <Package className="w-10 h-10 text-[#D4E8DA] mx-auto mb-3" />
      <p className="text-[#7A9A88]">{error ?? "Order not found"}</p>
      <Link to="/dashboard/orders" className="mt-4 inline-flex text-sm font-semibold text-[#2D6A4F] hover:underline">
        ← Back to Orders
      </Link>
    </div>
  );

  const statusIndex = ORDER_STATUSES.findIndex(s => s.key === order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard/orders" className="p-2 rounded-full hover:bg-[#EEF8F1] text-[#4A6357] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-bold text-[#1B2D24]">
              {order.order_number ? `#${order.order_number}` : `Order`}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-[#7A9A88] mt-0.5">Placed on {formatDate(order.created_at)}</p>
        </div>
      </div>

      {/* Cancelled banner */}
      {isCancelled && (
        <div className="p-4 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2]">
          <p className="text-sm font-semibold text-[#D32F2F]">This order was cancelled</p>
          <p className="text-xs text-[#D32F2F]/70 mt-1">Contact support if you believe this is an error.</p>
        </div>
      )}

      {/* Status Timeline */}
      {!isCancelled && (
        <div className="bg-white rounded-2xl ring-1 ring-[#D4E8DA] p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1B2D24] mb-5">
            Order Progress
          </h2>
          <div className="flex items-start justify-between relative">
            {/* Connector line */}
            <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-[#D4E8DA]" />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: Math.min(1, (statusIndex) / (ORDER_STATUSES.length - 1)) }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              style={{ transformOrigin: "left" }}
              className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-[#2D6A4F]"
            />

            {ORDER_STATUSES.map((step, i) => {
              const done    = i <= statusIndex;
              const current = i === statusIndex;
              return (
                <div key={step.key} className="relative flex flex-col items-center text-center"
                     style={{ width: "20%", zIndex: 1 }}>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                                border-2 transition-all duration-500 bg-white
                                ${done ? "border-[#2D6A4F] shadow-sm" : "border-[#D4E8DA]"}
                                ${current ? "ring-2 ring-[#52B788] ring-offset-2" : ""}`}
                  >
                    {step.icon}
                  </motion.div>
                  <p className={`text-[11px] font-semibold mt-2 leading-tight ${
                    done ? "text-[#2D6A4F]" : "text-[#7A9A88]"
                  }`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Items */}
        <div className="bg-white rounded-2xl ring-1 ring-[#D4E8DA] p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1B2D24] mb-4">
            Items ({order.order_items.length})
          </h2>
          <div className="space-y-3">
            {order.order_items.map(item => {
              const cuisine = item.dishes?.cuisine ?? "NORTH_INDIAN";
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF8F1] flex items-center justify-center text-xl flex-shrink-0">
                    {FOOD_EMOJIS[cuisine] ?? "🍽️"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1B2D24] line-clamp-1">
                      {item.dishes?.name ?? "Unknown dish"}
                    </p>
                    <p className="text-xs text-[#7A9A88]">×{item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[#1B2D24] flex-shrink-0">
                    {formatRupees(item.unit_price * item.quantity)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Delivery info */}
          <div className="bg-white rounded-2xl ring-1 ring-[#D4E8DA] p-5 space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1B2D24] mb-3">
              Delivery
            </h2>
            {order.delivery_date && (
              <p className="text-sm text-[#4A6357]">
                📅 <span className="font-semibold">{formatDate(order.delivery_date)}</span>
              </p>
            )}
            {order.delivery_address && (
              <p className="text-sm text-[#4A6357]">📍 {order.delivery_address}</p>
            )}
            {order.special_notes && (
              <p className="text-sm text-[#4A6357]">📝 {order.special_notes}</p>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl ring-1 ring-[#D4E8DA] p-5 space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1B2D24] mb-3">
              Payment
            </h2>
            {order.payment_method && (
              <p className="text-sm text-[#4A6357]">Method: <span className="font-semibold">{order.payment_method}</span></p>
            )}
            <p className="text-sm text-[#4A6357]">
              Status: <span className={`font-semibold ${order.payment_status === "PAID" ? "text-[#2D6A4F]" : "text-yellow-600"}`}>
                {order.payment_status}
              </span>
            </p>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-2xl ring-1 ring-[#D4E8DA] p-5 space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1B2D24] mb-3">
              Bill Summary
            </h2>
            {[
              { label: "Subtotal",  value: order.subtotal },
              ...(order.discount_amount > 0 ? [{ label: "Discount", value: -order.discount_amount }] : []),
              { label: "Delivery",  value: order.delivery_fee },
              { label: "Tax (GST)", value: order.tax_amount },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-[#4A6357]">{row.label}</span>
                <span className={row.value < 0 ? "text-[#2D6A4F] font-semibold" : "font-medium text-[#1B2D24]"}>
                  {row.value < 0 ? `−${formatRupees(-row.value)}` : formatRupees(row.value)}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t border-[#E8F5EC]">
              <span>Total</span>
              <span>{formatRupees(order.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
