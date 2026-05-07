import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

const CartButton = ({ scrolled = false }: { scrolled?: boolean }) => {
  const { itemCount, toggleCart } = useCart()

  return (
    <motion.button
      onClick={toggleCart}
      animate={itemCount > 0 ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative p-2.5 rounded-full [transition:all_800ms_cubic-bezier(0.4,0,0.2,1)]
                 ${scrolled 
                   ? "text-white hover:bg-white/10" 
                   : "text-[#4A6357] hover:bg-[#EEF8F1] hover:text-[#2D6A4F]"
                 }`}
      aria-label={`Cart (${itemCount} items)`}
    >
      <ShoppingBag size={22} />

      <AnimatePresence mode="popLayout">
        {itemCount > 0 && (
          <motion.span
            key={itemCount}
            initial={{ scale: 0.5, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -10 }}
            transition={{ 
              type: 'spring', 
              stiffness: 600, 
              damping: 20 
            }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full
                       bg-[#D32F2F] text-white text-[10px] font-bold
                       flex items-center justify-center pointer-events-none shadow-lg"
          >
            {itemCount > 9 ? '9+' : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default CartButton
