import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const CartButton = () => {
  const { itemCount, toggleCart } = useCart()

  return (
    <button
      onClick={toggleCart}
      className="relative p-2.5 rounded-full hover:bg-[#EEF8F1] text-[#4A6357]
                 hover:text-[#2D6A4F] transition-colors duration-200"
      aria-label={`Cart (${itemCount} items)`}
    >
      <ShoppingBag size={22} />

      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full
                       bg-[#D32F2F] text-white text-[10px] font-bold
                       flex items-center justify-center pointer-events-none"
          >
            {itemCount > 9 ? '9+' : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

export default CartButton
