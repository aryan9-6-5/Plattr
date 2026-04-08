import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tag, AlertCircle, CheckCircle, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useCart } from '@/hooks/use-cart'

const PromoCodeInput = () => {
  const { promoCode, applyPromo, removePromo, subtotal } = useCart()
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleApply = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data, error: dbError } = await supabase
        .from('promotions')
        .select('*')
        .eq('code', input.trim().toUpperCase())
        .eq('is_active', true)
        .lte('valid_from', new Date().toISOString())
        .gte('valid_until', new Date().toISOString())
        .single()

      if (dbError || !data) {
        setError('Invalid or expired promo code')
        return
      }

      if (data.min_order_value && subtotal < data.min_order_value) {
        setError(`Minimum order ₹${data.min_order_value} required for this code`)
        return
      }

      if (data.max_uses && data.used_count >= data.max_uses) {
        setError('This promo code has reached its usage limit')
        return
      }

      if (data.discount_pct) {
        applyPromo(data.code, data.discount_pct, 'percentage')
        setSuccess(`${data.discount_pct}% discount applied!`)
      } else if (data.discount_flat) {
        applyPromo(data.code, data.discount_flat, 'flat')
        setSuccess(`₹${data.discount_flat} discount applied!`)
      }

      setInput('')
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // Applied state
  if (promoCode) {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl
                      bg-[#D8F3DC] border border-[#52B788]/30">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-[#2D6A4F]" />
          <div>
            <span className="text-sm font-semibold text-[#1B4332] font-mono tracking-wider">
              {promoCode}
            </span>
            <p className="text-xs text-[#4A6357]">Applied</p>
          </div>
        </div>
        <button
          onClick={removePromo}
          className="flex items-center gap-1 text-xs font-semibold text-[#D32F2F] hover:underline"
        >
          <X size={12} /> Remove
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && handleApply()}
          placeholder="Enter promo code"
          className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-[#D4E8DA] bg-white
                     text-[#1B2D24] placeholder:text-[#7A9A88] focus:outline-none
                     focus:ring-2 focus:ring-[#2D6A4F] font-mono tracking-wider"
        />
        <button
          onClick={handleApply}
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#2D6A4F] text-white
                     hover:bg-[#1e4d38] disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200 flex-shrink-0"
        >
          {loading ? '…' : 'Apply'}
        </button>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-[#D32F2F] flex items-center gap-1"
        >
          <AlertCircle size={12} /> {error}
        </motion.p>
      )}
      {success && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-[#2D6A4F] flex items-center gap-1 font-semibold"
        >
          <CheckCircle size={12} /> {success}
        </motion.p>
      )}
    </div>
  )
}

export default PromoCodeInput
