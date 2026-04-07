import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ShoppingBag, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/hooks/useAuth'
import CartItemRow from './CartItemRow'
import PromoCodeInput from './PromoCodeInput'
import SummaryRow from './SummaryRow'

const CartDrawer = () => {
  const {
    isOpen, closeCart, items, isEmpty,
    itemCount, subtotal, discountAmount,
    deliveryFee, tax, total, notes, setNotes,
  } = useCart()
  const navigate = useNavigate()
  const { user }  = useAuth()

  const handleCheckout = () => {
    closeCart()
    if (!user) {
      navigate('/login?redirect=/checkout')
      return
    }
    navigate('/checkout')
  }

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* DRAWER PANEL */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50
                       w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between p-5 border-b border-[#E8F5EC] flex-shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-xl font-bold text-[#1B2D24]">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="inline-flex items-center justify-center w-6 h-6
                                   rounded-full text-xs font-bold bg-[#2D6A4F] text-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-[#EEF8F1] text-[#4A6357]
                           hover:text-[#1B2D24] transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* EMPTY STATE */}
            {isEmpty ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-[#EEF8F1] flex items-center justify-center mb-4">
                  <ShoppingBag size={32} className="text-[#52B788]" />
                </div>
                <h3 className="font-semibold text-[#1B2D24] text-lg">Your cart is empty</h3>
                <p className="text-sm text-[#7A9A88] mt-2 leading-relaxed">
                  Add dishes from our catalog to get started
                </p>
                <button
                  onClick={() => { closeCart(); navigate('/catalog') }}
                  className="mt-6 px-5 py-2.5 rounded-full bg-[#2D6A4F] text-white text-sm
                             font-semibold hover:bg-[#1e4d38] transition-colors duration-200"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <>
                {/* ITEMS LIST */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                  <div className="p-4 space-y-3">
                    <AnimatePresence initial={false}>
                      {items.map(item => (
                        <CartItemRow key={item.id} item={item} />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* NOTES */}
                  <div className="px-4 pb-4">
                    <label className="text-xs font-semibold tracking-wide text-[#4A6357]
                                      uppercase block mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Less spicy, no onion, extra raita…"
                      rows={2}
                      className="w-full px-4 py-3 text-sm border border-[#D4E8DA] rounded-xl
                                 text-[#1B2D24] placeholder:text-[#7A9A88] focus:outline-none
                                 focus:ring-2 focus:ring-[#2D6A4F] resize-none bg-[#F6FFF8]"
                    />
                  </div>

                  {/* PROMO CODE */}
                  <div className="px-4 pb-4">
                    <label className="text-xs font-semibold tracking-wide text-[#4A6357]
                                      uppercase block mb-2">
                      Promo Code
                    </label>
                    <PromoCodeInput />
                  </div>
                </div>

                {/* ORDER SUMMARY */}
                <div className="border-t border-[#E8F5EC] p-5 flex-shrink-0 space-y-2">
                  <SummaryRow label="Subtotal"    value={subtotal} />
                  {discountAmount > 0 && (
                    <SummaryRow label="Promo discount" value={-discountAmount} isDiscount />
                  )}
                  <SummaryRow
                    label={deliveryFee === 0 ? 'Delivery (Free!)' : 'Delivery fee'}
                    value={deliveryFee}
                    isFree={deliveryFee === 0}
                  />
                  <SummaryRow label="GST (5%)" value={tax} />

                  <div className="pt-2 border-t border-[#E8F5EC] flex items-center justify-between">
                    <span className="font-bold text-[#1B2D24]">Total</span>
                    <span className="font-bold text-xl text-[#1B2D24]">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {deliveryFee > 0 && subtotal < 500 && (
                    <p className="text-xs text-[#7A9A88] text-center">
                      Add ₹{(500 - subtotal).toLocaleString('en-IN')} more for free delivery
                    </p>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="p-4 pt-0 flex-shrink-0 space-y-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full py-3.5 rounded-full bg-[#2D6A4F] hover:bg-[#1e4d38]
                               text-white font-semibold text-sm tracking-wide shadow-sm
                               transition-colors duration-200
                               flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </motion.button>
                  <button
                    onClick={closeCart}
                    className="w-full py-2.5 text-sm font-medium text-[#4A6357]
                               hover:text-[#2D6A4F] transition-colors duration-200"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default CartDrawer
