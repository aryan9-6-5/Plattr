import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

// ── TYPES ───────────────────────────────────────────────────────────────────

import { ToastContext } from "@/hooks/use-plattr-toast";
import type { ToastType, ToastContextValue } from "@/hooks/use-plattr-toast";
    
type Toast = {
  id:      string
  message: string
  type:    ToastType
}


type ToastAction =
  | { type: 'ADD';    payload: Toast }
  | { type: 'REMOVE'; payload: { id: string } }

// ── REDUCER ─────────────────────────────────────────────────────────────────

const toastReducer = (state: Toast[], action: ToastAction): Toast[] => {
  switch (action.type) {
    case 'ADD': {
      const next = [...state, action.payload]
      return next.length > 4 ? next.slice(next.length - 4) : next  // max 4
    }
    case 'REMOVE':
      return state.filter(t => t.id !== action.payload.id)
    default:
      return state
  }
}

// ── CONTEXT ─────────────────────────────────────────────────────────────────



// ── TOAST ITEM ───────────────────────────────────────────────────────────────

const toastConfig: Record<ToastType, {
  icon: typeof CheckCircle
  border: string
  iconColor: string
}> = {
  success: { icon: CheckCircle,   border: 'border-[#52B788]', iconColor: 'text-[#2D6A4F]' },
  error:   { icon: AlertCircle,   border: 'border-[#D32F2F]', iconColor: 'text-[#D32F2F]' },
  info:    { icon: Info,          border: 'border-[#D4E8DA]', iconColor: 'text-[#4A6357]' },
  warning: { icon: AlertTriangle, border: 'border-yellow-400', iconColor: 'text-yellow-500' },
}

const ToastItem = ({
  toast,
  onRemove,
}: {
  toast: Toast
  onRemove: (id: string) => void
}) => {
  const cfg  = toastConfig[toast.type]
  const Icon = cfg.icon

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.9 }}
      animate={{ opacity: 1, x: 0,  scale: 1 }}
      exit={{   opacity: 0, x: 40, scale: 0.9, height: 0, marginBottom: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg
                  max-w-xs w-full bg-white border ${cfg.border}
                  text-sm font-medium text-[#1B2D24] overflow-hidden`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${cfg.iconColor}`} />
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-[#7A9A88] hover:text-[#4A6357] transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 3, ease: 'linear' }}
        style={{ transformOrigin: 'left' }}
        className={`absolute bottom-0 left-0 h-[3px] w-full ${
          toast.type === 'success' ? 'bg-[#52B788]' :
          toast.type === 'error'   ? 'bg-[#D32F2F]' :
          toast.type === 'warning' ? 'bg-yellow-400' :
          'bg-[#52B788]'
        }`}
      />
    </motion.div>
  )
}

// ── PROVIDER ─────────────────────────────────────────────────────────────────

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, dispatch] = useReducer(toastReducer, [])

  const addToast = useCallback((message: string, type: ToastType) => {
    dispatch({
      type:    'ADD',
      payload: { id: `toast-${Date.now()}-${Math.random()}`, message, type },
    })
  }, [])

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', payload: { id } })
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container — above cart drawer (z-60) */}
      <div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 items-end">
        <AnimatePresence mode="sync">
          {toasts.map(t => (
            <ToastItem key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}


