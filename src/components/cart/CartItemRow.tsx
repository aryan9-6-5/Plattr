import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
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
      className="flex gap-3 p-3 bg-[#F6FFF8] rounded-2xl ring-1 ring-[#E8F5EC]"
    >
      {/* IMAGE */}
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#EEF8F1]">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
        )}
      </div>

      {/* DETAILS */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-[#1B2D24] leading-tight line-clamp-2">
            {item.name}
          </h4>
          <button
            onClick={() => removeItem(item.id)}
            className="flex-shrink-0 p-1 rounded-full text-[#7A9A88] hover:text-[#D32F2F]
                       hover:bg-[#FFEBEE] transition-colors duration-150"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`w-2 h-2 rounded-sm flex-shrink-0 ${dietDot[item.diet_type] ?? 'bg-gray-400'}`} />
          <p className="text-xs text-[#7A9A88] truncate">{item.source_name}</p>
        </div>

        {isBulkPrice && (
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold
                           bg-[#D8F3DC] text-[#1B4332]">
            Bulk price applied
          </span>
        )}

        {/* QUANTITY + PRICE ROW */}
        <div className="flex items-center justify-between mt-2">

          {/* QUANTITY CONTROLS */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 rounded-full border border-[#D4E8DA]
                         flex items-center justify-center
                         text-[#4A6357] hover:border-[#2D6A4F]
                         hover:text-[#2D6A4F] hover:bg-[#EEF8F1]
                         transition-all duration-150 text-sm font-bold"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-semibold text-[#1B2D24]">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-7 h-7 rounded-full border border-[#D4E8DA]
                         flex items-center justify-center
                         text-[#4A6357] hover:border-[#2D6A4F]
                         hover:text-[#2D6A4F] hover:bg-[#EEF8F1]
                         transition-all duration-150 text-sm font-bold"
            >
              +
            </button>
          </div>

          {/* LINE TOTAL */}
          <div className="text-right">
            <span className="text-sm font-bold text-[#1B2D24]">
              ₹{lineTotal.toLocaleString('en-IN')}
            </span>
            {isBulkPrice && (
              <p className="text-xs text-[#7A9A88] line-through">
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
