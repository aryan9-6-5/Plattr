import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, LayoutDashboard } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// ── CSS-only confetti ─────────────────────────────────────────────────────────
const CONFETTI_COLORS = ["#52B788","#2D6A4F","#D8F3DC","#F59E0B","#D32F2F","#60a5fa","#a78bfa"];

const Confetti = () => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, x: `${Math.random() * 100}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: 0, rotate: Math.random() * 720 - 360 }}
          transition={{ duration: 2.5 + Math.random() * 1, delay: Math.random() * 0.5, ease: "easeIn" }}
          style={{
            position: "absolute",
            top: 0,
            width:  6 + Math.random() * 8,
            height: 6 + Math.random() * 8,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          }}
        />
      ))}
    </div>
  );
};

// ── FORMAT DATE ─────────────────────────────────────────────────────────────
const fmtDate = (d?: string) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });
};

// ── MAIN ─────────────────────────────────────────────────────────────────────
const OrderSuccessPage = () => {
  const { orderId }  = useParams<{ orderId: string }>();
  const { state }    = useLocation();
  const navigate     = useNavigate();

  const [orderNumber,  setOrderNumber]  = useState<string | null>(state?.orderNumber  ?? null);
  const [total,        setTotal]        = useState<number>(state?.total               ?? 0);
  const [deliveryDate, setDeliveryDate] = useState<string>(state?.deliveryDate        ?? "");
  const [itemCount,    setItemCount]    = useState<number>(state?.itemCount           ?? 0);

  // Fallback fetch if page refreshed
  useEffect(() => {
    if (!orderNumber && orderId) {
      supabase
        .from("orders")
        .select("order_number, total_amount, delivery_date")
        .eq("id", orderId)
        .single()
        .then(({ data }) => {
          if (data) {
            setOrderNumber(data.order_number);
            setTotal(Number(data.total_amount));
            setDeliveryDate(data.delivery_date);
          }
        });
    }
  }, [orderId, orderNumber]);

  return (
    <>
      <Confetti />

      <div className="min-h-screen bg-[#F6FFF8] flex flex-col items-center justify-center px-4 py-16">

        {/* ── Checkmark ── */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          className="w-24 h-24 rounded-full bg-[#D8F3DC] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <CheckCircle size={48} className="text-[#2D6A4F]" />
          </motion.div>
        </motion.div>

        {/* ── Headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="font-serif text-3xl font-bold text-[#1B2D24] mt-6 text-center"
        >
          Order Placed! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.3 }}
          className="text-[#7A9A88] text-sm mt-2 text-center"
        >
          Sit back — your meal is on its way.
        </motion.p>

        {/* ── Order Details Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-[#D4E8DA]
                     mt-8 max-w-sm w-full text-center"
        >
          {orderNumber && (
            <p className="text-xs font-bold tracking-widest uppercase text-[#52B788]">
              Order #{orderNumber}
            </p>
          )}
          <p className="text-2xl font-bold text-[#1B2D24] font-serif mt-1">
            ₹{total.toLocaleString("en-IN")}
          </p>
          {deliveryDate && (
            <p className="text-sm text-[#4A6357] mt-2">
              Arriving <span className="font-semibold">{fmtDate(deliveryDate)}</span>
            </p>
          )}
          {itemCount > 0 && (
            <p className="text-sm text-[#7A9A88] mt-1">{itemCount} item{itemCount > 1 ? "s" : ""} ordered</p>
          )}
        </motion.div>

        {/* ── Next Steps ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="mt-8 space-y-3 max-w-xs w-full"
        >
          {[
            { icon: "✓", text: "Order confirmed — our team is notified" },
            { icon: "⏱", text: "Chef begins preparation the day before" },
            { icon: "🚚", text: `Delivered by your chosen time slot on ${fmtDate(deliveryDate)}` },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-[#4A6357]">
              <span className="w-6 h-6 rounded-full bg-[#D8F3DC] text-[#2D6A4F] flex items-center
                               justify-center text-xs font-bold flex-shrink-0">
                {step.icon}
              </span>
              {step.text}
            </div>
          ))}
        </motion.div>

        {/* ── Action Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 mt-10 justify-center w-full max-w-xs"
        >
          <Link
            to={`/dashboard/orders/${orderId}`}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full
                       bg-[#2D6A4F] text-white text-sm font-semibold
                       hover:bg-[#1B4332] transition-colors shadow-sm"
          >
            <LayoutDashboard size={16} />
            Track Order
          </Link>
          <Link
            to="/catalog"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full
                       border border-[#D4E8DA] text-sm font-semibold text-[#4A6357]
                       hover:bg-[#EEF8F1] transition-colors"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default OrderSuccessPage;
