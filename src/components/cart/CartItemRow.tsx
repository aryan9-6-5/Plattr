import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import type { CartItem } from '@/types/cart'

const CartItemRow = ({ item }: { item: CartItem }) => {
  const { updateQuantity, removeItem } = useCart()

  const isBulkPrice    = item.bulk_price !== null && item.quantity >= item.min_bulk_qty
  const effectivePrice = isBulkPrice ? item.bulk_price! : item.price
  const lineTotal      = effectivePrice * item.quantity

  const dietDot: Record<string, string> = {
    VEG:     'bg-green-500',
    NON_VEG: 'bg-red-500',
    EGG:     'bg-yellow-500',
    VEGAN:   'bg-emerald-600',
    JAIN:    'bg-orange-500',
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-2 lg:gap-3 p-2 lg:p-3 bg-[#F6FFF8] rounded-2xl ring-1 ring-[#E8F5EC]"
    >
      {/* IMAGE */}
      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg lg:rounded-xl overflow-hidden flex-shrink-0 bg-[#EEF8F1]">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl lg:text-2xl">🍽️</div>
        )}
      </div>

      {/* DETAILS */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1 lg:gap-2">
          <h4 className="text-[13px] lg:text-sm font-semibold text-[#1B2D24] leading-tight line-clamp-2">
            {item.name}
          </h4>
          <button
            onClick={() => removeItem(item.id)}
            className="flex-shrink-0 p-1 rounded-full text-[#7A9A88] hover:text-[#D32F2F]
                       hover:bg-[#FFEBEE] transition-colors duration-150"
          >
            <X size={12} className="lg:w-3.5 lg:h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-sm flex-shrink-0 ${dietDot[item.diet_type] ?? 'bg-gray-400'}`} />
          <p className="text-[10px] lg:text-xs text-[#7A9A88] truncate">{item.source_name}</p>
        </div>

        {isBulkPrice && (
          <span className="inline-block mt-1 px-2 py-0.5 lg:py-1 rounded-full text-[9px] lg:text-xs font-semibold
                           bg-[#D8F3DC] text-[#1B4332]">
            Bulk price applied
          </span>
        )}

        {/* MEALBOX SUB-ITEMS */}
        {item.sub_items && item.sub_items.length > 0 && (
          <div className="mt-1.5 lg:mt-2 space-y-1">
            <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-[#7A9A88]">Inside this box:</p>
            <div className="flex flex-wrap gap-1 lg:gap-1.5">
              {item.sub_items.map((sub, idx) => (
                <span key={idx} className="text-[9px] lg:text-[10px] bg-[#EEF8F1] text-[#2D6A4F] px-1.5 py-0.5 rounded-lg border border-[#D4E8DA]">
                  {sub.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* QUANTITY + PRICE ROW */}
        <div className="flex items-center justify-between mt-2">

          {/* QUANTITY CONTROLS */}
          <div className="flex items-center gap-1 lg:gap-1.5">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-6 h-6 lg:w-7 lg:h-7 rounded-full border border-[#D4E8DA]
                         flex items-center justify-center
                         text-[#4A6357] hover:border-[#2D6A4F]
                         hover:text-[#2D6A4F] hover:bg-[#EEF8F1]
                         transition-all duration-150 text-xs lg:text-sm font-bold"
            >
              −
            </button>
            <span className="w-5 lg:w-6 text-center text-xs lg:text-sm font-semibold text-[#1B2D24]">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-6 h-6 lg:w-7 lg:h-7 rounded-full border border-[#D4E8DA]
                         flex items-center justify-center
                         text-[#4A6357] hover:border-[#2D6A4F]
                         hover:text-[#2D6A4F] hover:bg-[#EEF8F1]
                         transition-all duration-150 text-xs lg:text-sm font-bold"
            >
              +
            </button>
          </div>

          {/* LINE TOTAL */}
          <div className="text-right">
            <span className="text-[13px] lg:text-sm font-bold text-[#1B2D24]">
              ₹{lineTotal.toLocaleString('en-IN')}
            </span>
            {isBulkPrice && (
              <p className="text-[10px] lg:text-xs text-[#7A9A88] line-through leading-none">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CartItemRow
