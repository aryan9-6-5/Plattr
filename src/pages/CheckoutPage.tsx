import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Utensils, CreditCard, Info, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-plattr-toast";
import PromoCodeInput from "@/components/cart/PromoCodeInput";
import SummaryRow from "@/components/cart/SummaryRow";

type CheckoutForm = {
  full_name:      string;
  phone:          string;
  address:        string;
  pincode:        string;
  city:           string;
  delivery_date:  string;
  delivery_time:  string;
  special_notes:  string;
  meal_type:      "TIFFIN" | "BULK" | "EVENT" | "ALA_CARTE";
  company_name:   string;
  payment_method: "UPI" | "CARD" | "COD" | "CREDIT";
};

const TIME_SLOTS = [
  { label: "8:00 AM – 10:00 AM", value: "08:00" },
  { label: "10:00 AM – 12:00 PM", value: "10:00" },
  { label: "12:00 PM – 2:00 PM",  value: "12:00" },
  { label: "2:00 PM – 4:00 PM",   value: "14:00" },
  { label: "6:00 PM – 8:00 PM",   value: "18:00" },
];

const PAYMENT_OPTIONS = [
  { 
    value: "UPI",    
    label: "UPI / Google Pay / PhonePe", 
    image: "https://www.vectorlogo.zone/logos/upi/upi-ar21.svg",
    description: "Scan & pay via any UPI app"
  },
  { 
    value: "CARD",   
    label: "Debit / Credit Card",         
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHg6L0yf2DhQrkSIGWp0BnADyYi5OkOI2MPA&s",
    description: "All major cards accepted"
  },
  { 
    value: "COD",    
    label: "Cash on Delivery",            
    image: "https://img.icons8.com/color/1200/cash-in-hand.jpg",
    description: "Pay when you receive"
  },
  { 
    value: "CREDIT", 
    label: "Invoice (B2B only)",          
    image: "https://cdn-icons-png.flaticon.com/512/1055/1055208.png",
    description: "For corporate clients"
  },
] as const;

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

const maxDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
};

const validate = (form: CheckoutForm): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!form.full_name.trim())                        errors.full_name     = "Name is required";
  if (!/^[6-9]\d{9}$/.test(form.phone))             errors.phone         = "Valid 10-digit Indian phone required";
  if (!form.address.trim() || form.address.length < 10) errors.address   = "Please enter your full delivery address";
  if (!/^\d{6}$/.test(form.pincode))                 errors.pincode       = "Valid 6-digit pincode required";
  if (!form.city.trim())                             errors.city          = "City is required";
  if (!form.delivery_date)                           errors.delivery_date = "Please select a delivery date";
  else {
    const sel = new Date(form.delivery_date);
    const tom = new Date(); tom.setDate(tom.getDate() + 1); tom.setHours(0,0,0,0);
    if (sel < tom) errors.delivery_date = "Delivery date must be at least tomorrow";
  }
  if (!form.delivery_time)                           errors.delivery_time = "Please select a delivery time slot";
  if (!form.payment_method)                          errors.payment_method = "Please select a payment method";
  return errors;
};

// ── Input helper ────────────────────────────────────────────────────────────
const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-3 text-sm rounded-xl border bg-white text-[#1B2D24]
   placeholder:text-[#7A9A88] focus:outline-none focus:ring-2
   focus:ring-[#2D6A4F] focus:border-transparent transition-all duration-200
   ${hasError ? "border-[#D32F2F] focus:ring-[#D32F2F]" : "border-[#D4E8DA]"}`;

const labelClass = "text-xs font-semibold tracking-wide text-[#4A6357] uppercase block mb-1.5";

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-xs text-[#D32F2F] mt-1 flex items-center gap-1">⚠ {msg}</p> : null;

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user }   = useAuth();
  const { profile } = useProfile();
  const { addToast } = useToast();
  const {
    items, isEmpty, itemCount, subtotal, discountAmount,
    deliveryFee, tax, total, promoCode, notes, clearCart,
  } = useCart();

  // Detect dominant meal type from cart
  const autoMealType = (): CheckoutForm["meal_type"] => {
    if (items.some(i => i.meal_type === "EVENT")) return "EVENT";
    if (items.some(i => i.meal_type === "BULK"))  return "BULK";
    if (items.some(i => i.meal_type === "TIFFIN")) return "TIFFIN";
    return "ALA_CARTE";
  };

  const [form, setForm] = useState<CheckoutForm>({
    full_name:      "",
    phone:          "",
    address:        "",
    pincode:        "",
    city:           "",
    delivery_date:  tomorrow(),
    delivery_time:  "",
    special_notes:  notes,
    meal_type:      autoMealType(),
    company_name:   "",
    payment_method: "UPI",
  });
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill from profile
  useEffect(() => {
    if (profile) {
      setForm(prev => ({
        ...prev,
        full_name: prev.full_name || profile.full_name || "",
        phone:     prev.phone     || profile.phone     || "",
        city:      prev.city      || profile.city      || "",
        pincode:   prev.pincode   || profile.pincode   || "",
      }));
    }
  }, [profile]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!user) { navigate("/login?redirect=/checkout"); return; }
    if (isEmpty) {
      addToast("Your cart is empty", "info");
      navigate("/catalog");
    }
  }, [isEmpty, user, addToast, navigate]);

  const set = (field: keyof CheckoutForm) => (val: string) =>
    setForm(prev => ({ ...prev, [field]: val }));

  const handlePlaceOrder = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);

    try {
      // 1. Create ORDER
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id:      user!.id,
          status:           "PENDING",
          meal_type:        form.meal_type,
          delivery_address: form.address,
          delivery_pincode: form.pincode,
          delivery_date:    form.delivery_date,
          delivery_time:    form.delivery_time,
          special_notes:    form.special_notes || notes,
          subtotal,
          discount_amount:  discountAmount,
          delivery_fee:     deliveryFee,
          tax_amount:       tax,
          total_amount:     total,
          payment_status:   "PENDING",
          payment_method:   form.payment_method,
        })
        .select("id, order_number")
        .single();

      if (orderError) throw orderError;

      // 2. Create ORDER ITEMS
      const orderItems = items.map(item => ({
        order_id:   order.id,
        dish_id:    item.id,
        quantity:   item.quantity,
        unit_price: item.bulk_price && item.quantity >= item.min_bulk_qty
          ? item.bulk_price
          : item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        // Cleanup orphaned order
        await supabase.from("orders").delete().eq("id", order.id);
        throw itemsError;
      }

      // 3. Increment promo used_count if applied
      if (promoCode) {
        await supabase.rpc("increment_promo_usage", { promo_code: promoCode }).maybeSingle();
        // Non-fatal — don't throw if this fails
      }

      // 4. Clear cart
      clearCart();

      // 5. Navigate to success
      navigate(`/order-success/${order.id}`, {
        state: {
          orderNumber:  order.order_number,
          total,
          deliveryDate: form.delivery_date,
          itemCount,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order. Please try again.";
      addToast(msg, "error");
      setSubmitting(false);
    }
  };

  const sectionClass = "bg-white rounded-2xl p-6 shadow-sm ring-1 ring-[#D4E8DA] space-y-5";
  const sectionTitle = "font-serif text-lg font-bold text-[#1B2D24] flex items-center gap-2 mb-1";

  return (
    <div className="min-h-screen bg-[#F6FFF8] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1B2D24] mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* ── LEFT COLUMN ─────────────────────────────────────── */}
          <div className="space-y-6">

            {/* SECTION 1: Delivery Details */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={sectionClass}
            >
              <h2 className={sectionTitle}><MapPin size={20} className="text-[#52B788]" /> Delivery Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label id="full_name" htmlFor="full_name" className={labelClass}>Full Name</label>
                  <input id="full_name" value={form.full_name} onChange={e => set("full_name")(e.target.value)}
                    placeholder="Arjun Sharma" className={inputClass(!!errors.full_name)} />
                  <ErrorMsg msg={errors.full_name} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone</label>
                  <input id="phone" value={form.phone} onChange={e => set("phone")(e.target.value)}
                    placeholder="9876543210" maxLength={10} className={inputClass(!!errors.phone)} />
                  <ErrorMsg msg={errors.phone} />
                </div>
              </div>

              <div>
                <label htmlFor="address" className={labelClass}>Delivery Address</label>
                <textarea id="address" value={form.address} onChange={e => set("address")(e.target.value)}
                  placeholder="Flat 4B, Sunshine Apartments, MG Road..."
                  rows={2}
                  className={`${inputClass(!!errors.address)} resize-none`} />
                <ErrorMsg msg={errors.address} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pincode" className={labelClass}>Pincode</label>
                  <input id="pincode" value={form.pincode} onChange={e => set("pincode")(e.target.value)}
                    placeholder="500032" maxLength={6} className={inputClass(!!errors.pincode)} />
                  <ErrorMsg msg={errors.pincode} />
                </div>
                <div>
                  <label htmlFor="city" className={labelClass}>City</label>
                  <input id="city" value={form.city} onChange={e => set("city")(e.target.value)}
                    placeholder="Hyderabad" className={inputClass(!!errors.city)} />
                  <ErrorMsg msg={errors.city} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="delivery_date" className={labelClass}>Delivery Date</label>
                  <input id="delivery_date" type="date"
                    value={form.delivery_date}
                    min={tomorrow()} max={maxDate()}
                    onChange={e => set("delivery_date")(e.target.value)}
                    className={inputClass(!!errors.delivery_date)} />
                  <ErrorMsg msg={errors.delivery_date} />
                </div>
                <div>
                  <label htmlFor="delivery_time" className={labelClass}>Time Slot</label>
                  <select id="delivery_time" value={form.delivery_time}
                    onChange={e => set("delivery_time")(e.target.value)}
                    className={inputClass(!!errors.delivery_time)}>
                    <option value="">Select slot…</option>
                    {TIME_SLOTS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <ErrorMsg msg={errors.delivery_time} />
                </div>
              </div>

              <div>
                <label htmlFor="special_notes" className={labelClass}>Special Instructions</label>
                <textarea id="special_notes" value={form.special_notes}
                  onChange={e => set("special_notes")(e.target.value)}
                  placeholder="Less spicy, no onion, extra chutney…"
                  rows={2} className={`${inputClass()} resize-none`} />
              </div>
            </motion.div>

            {/* SECTION 2: Order Type */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={sectionClass}
            >
              <div className="flex items-center justify-between">
                <h2 className={sectionTitle}><Utensils size={20} className="text-[#52B788]" /> Order Type</h2>
                <span className="text-xs text-[#52B788] font-medium">Auto-detected from cart</span>
              </div>

              <div className="flex gap-3">
                {(["ALA_CARTE", "TIFFIN", "BULK", "EVENT"] as const).map(type => (
                  <button key={type}
                    onClick={() => set("meal_type")(type)}
                    className={`flex-1 py-3 px-2 rounded-xl text-xs font-semibold transition-all duration-200
                                border-2 ${form.meal_type === type
                      ? "bg-[#2D6A4F] text-white border-[#2D6A4F]"
                      : "bg-white text-[#4A6357] border-[#D4E8DA] hover:border-[#52B788] hover:text-[#2D6A4F]"
                    }`}>
                    {type === "ALA_CARTE" ? "À La Carte" : type.charAt(0) + type.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              {(form.meal_type === "BULK" || form.meal_type === "EVENT") && (
                <div>
                  <label htmlFor="company_name" className={labelClass}>Company / Event Name</label>
                  <input id="company_name" value={form.company_name}
                    onChange={e => set("company_name")(e.target.value)}
                    placeholder="TechPark Cafeteria / Sharma Wedding"
                    className={inputClass()} />
                </div>
              )}
            </motion.div>

            {/* SECTION 3: Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={sectionClass}
            >
              <h2 className={sectionTitle}><CreditCard size={20} className="text-[#52B788]" /> Payment Method</h2>

              <div className="p-3 rounded-xl bg-[#EEF8F1] text-xs text-[#4A6357] flex items-center gap-2">
                <Info size={14} className="flex-shrink-0" />
                Payments are processed offline. Our team will contact you to confirm.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PAYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => set("payment_method")(opt.value)}
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer
                                transition-all duration-300 text-left relative overflow-hidden
                                ${form.payment_method === opt.value
                      ? "border-[#2D6A4F] bg-[#EEF8F1] shadow-md"
                      : "border-[#D4E8DA] bg-white hover:border-[#52B788] hover:shadow-sm"}`}>
                    
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                      form.payment_method === opt.value ? "border-[#2D6A4F] bg-[#2D6A4F]" : "border-[#D4E8DA]"
                    }`}>
                      {form.payment_method === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1B2D24] uppercase tracking-tight">{opt.label}</span>
                        <img src={opt.image} alt={opt.label} className="h-14 object-contain" />
                      </div>
                      <p className="text-xs text-[#52B788] leading-tight font-medium opacity-80">
                        {opt.description}
                      </p>
                    </div>

                    {form.payment_method === opt.value && (
                      <motion.div 
                        layoutId="active-payment-glow"
                        className="absolute inset-0 bg-gradient-to-tr from-[#52B788]/5 to-transparent pointer-events-none"
                      />
                    )}
                  </button>
                ))}
              </div>
              {errors.payment_method && <ErrorMsg msg={errors.payment_method} />}
            </motion.div>
          </div>

          {/* ── RIGHT SIDEBAR ────────────────────────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm ring-1 ring-[#D4E8DA] space-y-5"
            >
              <h2 className="font-serif text-lg font-bold text-[#1B2D24]">Order Summary</h2>

              {/* Items preview */}
              <div className="space-y-0 divide-y divide-[#E8F5EC]">
                {items.map(item => {
                  const price = (item.bulk_price && item.quantity >= item.min_bulk_qty)
                    ? item.bulk_price : item.price;
                  return (
                    <div key={item.id} className="flex items-center gap-3 py-2.5">
                      <div className="w-10 h-10 rounded-lg bg-[#EEF8F1] flex items-center justify-center flex-shrink-0 text-xl">
                        {item.image_url
                          ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                          : "🍽️"
                        }
                      </div>
                      <p className="text-sm font-medium text-[#1B2D24] flex-1 line-clamp-1">{item.name}</p>
                      <p className="text-sm text-[#4A6357] flex-shrink-0">×{item.quantity} = ₹{(price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  );
                })}
              </div>

              {/* Promo */}
              <div>
                <p className="text-xs font-semibold tracking-wide text-[#4A6357] uppercase mb-2">Promo Code</p>
                <PromoCodeInput />
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 pt-2 border-t border-[#E8F5EC]">
                <SummaryRow label="Subtotal"    value={subtotal} />
                {discountAmount > 0 && <SummaryRow label="Promo discount" value={-discountAmount} isDiscount />}
                <SummaryRow
                  label={deliveryFee === 0 ? "Delivery (Free!)" : "Delivery fee"}
                  value={deliveryFee}
                  isFree={deliveryFee === 0}
                />
                <SummaryRow label="GST (5%)" value={tax} />
                <div className="flex items-center justify-between pt-2 border-t border-[#E8F5EC]">
                  <span className="font-bold text-[#1B2D24]">Total</span>
                  <span className="font-bold text-xl text-[#1B2D24]">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Place Order */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={submitting || isEmpty}
                className="w-full py-4 rounded-full bg-[#D32F2F] hover:bg-[#B71C1C]
                           text-white font-bold text-base tracking-wide
                           shadow-md hover:shadow-lg transition-all duration-200
                           flex items-center justify-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Placing your order…</>
                ) : (
                  <>Place Order — ₹{total.toLocaleString("en-IN")} <ArrowRight size={18} /></>
                )}
              </motion.button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 text-xs text-[#7A9A88]">
                <span>🔒 Secure</span>
                <span>✓ Verified Chefs</span>
                <span>📞 Support</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
