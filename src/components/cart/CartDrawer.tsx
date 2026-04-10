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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                   transition-transform duration-700 ease-smooth2 border-l border-[#D4E8DA]
                   ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
            {/* Header: Editorial Identity */}
            <div className="flex items-center justify-between p-6 xs:p-8 lg:p-10 border-b border-[#D4E8DA] flex-shrink-0 bg-white">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] text-[#1B4332]">System Inventory</span>
                <div className="flex items-center gap-2 lg:gap-4">
                  <h2 className="font-serif text-xl lg:text-3xl font-bold text-[#1B2D24] whitespace-nowrap">Your Pipeline</h2>
                  {itemCount > 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8
                                     rounded-lg lg:rounded-xl text-[10px] lg:text-[11px] font-black bg-[#1B4332] text-white shadow-lg">
                      {itemCount}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 lg:gap-4">
                {!isEmpty && (
                  <button
                    onClick={() => { if(confirm('Clear all modules?')) clearCart(); }}
                    className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-[#7A9A88] 
                               px-2 lg:p-3 hover:text-red-600 transition-colors"
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-[#D4E8DA] flex items-center justify-center text-[#1B2D24]
                             hover:bg-[#1B4332] hover:text-white transition-all duration-500 shadow-sm"
                >
                  <X size={18} className="lg:w-5 lg:h-5" />
                </button>
              </div>
            </div>

            {/* Empty Configuration */}
            {isEmpty ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 text-center">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[28px] lg:rounded-[32px] bg-white border border-[#D4E8DA] flex items-center justify-center mb-6 lg:mb-8 shadow-sm">
                  <ShoppingBag size={32} className="lg:w-10 lg:h-10 text-[#1B4332] opacity-30" />
                </div>
                <h3 className="font-serif text-xl lg:text-2xl font-bold text-[#1B2D24]">Pipeline is void.</h3>
                <p className="text-xs lg:text-sm text-[#7A9A88] mt-3 lg:mt-4 leading-relaxed font-sans max-w-xs px-4">
                  The curated network is ready for deployment. Add modules from the catalog to initiate.
                </p>
                <button
                  onClick={() => { closeCart(); navigate('/catalog') }}
                  className="mt-8 lg:mt-10 px-8 py-4 lg:px-10 lg:py-5 rounded-2xl bg-[#1B4332] text-white text-[10px] lg:text-[11px]
                             font-black uppercase tracking-[0.2em] lg:tracking-[0.25em] shadow-xl hover:bg-[#2D6A4F] transition-all duration-500 active:scale-95"
                >
                  Acquire Supply
                </button>
              </div>
            ) : (
              <>
                {/* Deployment List */}
                <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar">
                  <div className="p-4 xs:p-6 lg:p-8 space-y-4 lg:space-y-6">
                    <AnimatePresence initial={false}>
                      {items.map(item => (
                        <CartItemRow key={item.id} item={item} />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Operational Notes */}
                  <div className="px-4 xs:px-6 lg:px-8 pb-8">
                    <label className="text-[9px] lg:text-[10px] font-black tracking-[0.2em] text-[#7A9A88]
                                      uppercase block mb-3 lg:mb-4">
                      Protocol Instructions
                    </label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Specify dietary constraints..."
                      rows={2}
                      className="w-full px-5 py-3 lg:px-6 lg:py-4 text-xs lg:text-sm border border-[#D4E8DA] rounded-[20px] lg:rounded-[24px]
                                 text-[#1B2D24] placeholder:text-[#7A9A88] focus:outline-none bg-white font-sans"
                    />
                  </div>
                </div>

                {/* Logistics Summary */}
                <div className="border-t border-[#D4E8DA] bg-white p-6 xs:p-8 lg:p-10 space-y-6 lg:space-y-8 flex-shrink-0 pb-10 lg:pb-12">
                  <div className="space-y-3 lg:space-y-4">
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

                    <div className="pt-6 lg:pt-8 border-t border-[#D4E8DA] flex flex-col xs:flex-row xs:items-end justify-between gap-4">
                      <div>
                        <span className="text-[9px] lg:text-[10px] font-black tracking-[0.2em] lg:tracking-[0.3em] text-[#7A9A88] uppercase block mb-1">Final Settlement</span>
                        <span className="font-serif font-bold text-3xl lg:text-4xl text-[#1B2D24]">
                          ₹{total.toLocaleString()}
                        </span>
                      </div>
                      
                      {deliveryFee > 0 && subtotal < 500 && (
                        <p className="text-[9px] lg:text-[10px] text-[#7A9A88] font-black uppercase tracking-widest italic opacity-60">
                          Gap to priority: ₹{(500 - subtotal).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 lg:space-y-4">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleCheckout}
                      className="w-full py-5 lg:py-6 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F]
                                 text-white text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] lg:tracking-[0.25em] shadow-xl
                                 transition-all duration-700
                                 flex items-center justify-center gap-3 lg:gap-4 group"
                    >
                      Clear for Deployment
                      <ArrowRight size={18} className="lg:w-5 lg:h-5 group-hover:translate-x-2 transition-transform duration-500" />
                    </motion.button>
                    <button
                      onClick={() => { closeCart(); }}
                      className="w-full text-[9px] lg:text-[10px] font-black text-[#7A9A88] uppercase tracking-[0.2em] lg:tracking-[0.3em]
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
