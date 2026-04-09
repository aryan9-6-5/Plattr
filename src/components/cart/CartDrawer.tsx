import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { lockScroll, unlockScroll } from '@/utils/scrollLock'
import { useAuth } from '@/hooks/useAuth'
import CartItemRow from './CartItemRow'
import PromoCodeInput from './PromoCodeInput'
import SummaryRow from './SummaryRow'

const CartDrawer = () => {
  const {
    isOpen, closeCart, items, isEmpty,
    itemCount, subtotal, discountAmount,
    deliveryFee, tax, total, notes, setNotes, clearCart,
  } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const { user }  = useAuth()

  const handleCheckout = () => {
    closeCart()
    if (!user) {
      navigate('/login?redirect=/checkout')
      return
    }
    navigate('/checkout')
  }

  useEffect(() => {
    if (isOpen) {
      lockScroll()
    } else {
      unlockScroll()
    }
    return () => { unlockScroll() }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      closeCart()
    }
  }, [location.pathname])

  return createPortal(
    <>
      {/* Editorial Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-[#1B2D24]/40 backdrop-blur-xl z-[9998] transition-opacity duration-700 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Structured Drawer Panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-[9999]
                   w-full max-w-lg bg-[#F6FFF8] shadow-[0_0_100px_rgba(0,0,0,0.1)] flex flex-col
                   transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] border-l border-[#D4E8DA]
                   ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
            {/* Header: Editorial Identity */}
            <div className="flex items-center justify-between p-10 border-b border-[#D4E8DA] flex-shrink-0 bg-white">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B4332]">System Inventory</span>
                <div className="flex items-center gap-4">
                  <h2 className="font-serif text-3xl font-bold text-[#1B2D24]">Your Pipeline</h2>
                  {itemCount > 0 && (
                    <span className="inline-flex items-center justify-center w-8 h-8
                                     rounded-xl text-[11px] font-black bg-[#1B4332] text-white shadow-xl">
                      {itemCount}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {!isEmpty && (
                  <button
                    onClick={() => { if(confirm('Clear all modules?')) clearCart(); }}
                    className="text-[10px] font-black uppercase tracking-widest text-[#7A9A88] 
                               p-3 hover:text-red-600 transition-colors"
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="w-12 h-12 rounded-full border border-[#D4E8DA] flex items-center justify-center text-[#1B2D24]
                             hover:bg-[#1B4332] hover:text-white transition-all duration-500 shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Empty Configuration */}
            {isEmpty ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 rounded-[32px] bg-white border border-[#D4E8DA] flex items-center justify-center mb-8 shadow-sm">
                  <ShoppingBag size={40} className="text-[#1B4332] opacity-30" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1B2D24]">Pipeline is void.</h3>
                <p className="text-sm text-[#7A9A88] mt-4 leading-relaxed font-sans max-w-xs">
                  The curated network is ready for deployment. Add modules from the catalog to initiate.
                </p>
                <button
                  onClick={() => { closeCart(); navigate('/catalog') }}
                  className="mt-10 px-10 py-5 rounded-2xl bg-[#1B4332] text-white text-[11px]
                             font-black uppercase tracking-[0.25em] shadow-xl hover:bg-[#2D6A4F] transition-all duration-500 active:scale-95"
                >
                  Acquire Supply
                </button>
              </div>
            ) : (
              <>
                {/* Deployment List */}
                <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar">
                  <div className="p-8 space-y-6">
                    <AnimatePresence initial={false}>
                      {items.map(item => (
                        <CartItemRow key={item.id} item={item} />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Operational Notes */}
                  <div className="px-8 pb-8">
                    <label className="text-[10px] font-black tracking-[0.2em] text-[#7A9A88]
                                      uppercase block mb-4">
                      Protocol Instructions
                    </label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Specify dietary constraints or logistical preferences..."
                      rows={3}
                      className="w-full px-6 py-4 text-sm border border-[#D4E8DA] rounded-[24px]
                                 text-[#1B2D24] placeholder:text-[#7A9A88] focus:outline-none
                                 focus:ring-4 focus:ring-[#1B4332]/5 focus:border-[#1B4332] transition-all duration-300 resize-none bg-white font-sans"
                    />
                  </div>

                  {/* Promo Allocation */}
                  <div className="px-8 pb-10">
                    <label className="text-[10px] font-black tracking-[0.2em] text-[#7A9A88]
                                      uppercase block mb-4">
                      Voucher Sync
                    </label>
                    <PromoCodeInput />
                  </div>
                </div>

                {/* Logistics Summary */}
                <div className="border-t border-[#D4E8DA] bg-white p-10 space-y-8 flex-shrink-0 pb-12">
                  <div className="space-y-4">
                    <SummaryRow label="Gross Value" value={subtotal} />
                    {discountAmount > 0 && (
                      <SummaryRow label="System Rebate" value={-discountAmount} isDiscount />
                    )}
                    <SummaryRow
                      label={deliveryFee === 0 ? 'Logistics (Priority)' : 'Logistics Fee'}
                      value={deliveryFee}
                      isFree={deliveryFee === 0}
                    />
                    <SummaryRow label="Pipeline Tax" value={tax} />

                    <div className="pt-8 border-t border-[#D4E8DA] flex items-end justify-between">
                      <div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-[#7A9A88] uppercase block mb-1">Final Settlement</span>
                        <span className="font-serif font-bold text-4xl text-[#1B2D24]">
                          ₹{total.toLocaleString()}
                        </span>
                      </div>
                      
                      {deliveryFee > 0 && subtotal < 500 && (
                        <p className="text-[10px] text-[#7A9A88] font-black uppercase tracking-widest italic opacity-50">
                          Gap to priority: ₹{(500 - subtotal).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleCheckout}
                      className="w-full py-6 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F]
                                 text-white text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl
                                 shadow-[#1B4332]/20 transition-all duration-700
                                 flex items-center justify-center gap-4 group"
                    >
                      Clear for Deployment
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
                    </motion.button>
                    <button
                      onClick={() => { closeCart(); }}
                      className="w-full text-[10px] font-black text-[#7A9A88] uppercase tracking-[0.3em]
                                 hover:text-[#1B4332] transition-colors duration-500"
                    >
                      Continue Acquisition
                    </button>
                  </div>
                </div>
              </>
            )}
      </div>
    </>,
    document.body
  )
}

export default CartDrawer
