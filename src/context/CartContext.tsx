import { createContext, useReducer, useEffect, useState, useMemo, useRef } from 'react'
import type { CartItem, CartState } from '@/types/cart'
import type { CartContextValue } from "./CartContextType";
import { useAuth } from '@/hooks/useAuth'

// ── TYPES ──────────────────────────────────────────────────────────────────

type CartAction =
  | { type: 'ADD_ITEM';        payload: CartItem }
  | { type: 'REMOVE_ITEM';     payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'APPLY_PROMO';     payload: { code: string; discount: number; promoType: 'flat' | 'percentage' } }
  | { type: 'REMOVE_PROMO' }
  | { type: 'SET_NOTES';       payload: { notes: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE_CART';    payload: CartState }

// ── CONSTANTS & HELPERS ───────────────────────────────────────────────────

const INITIAL_STATE: CartState = {
  items:         [],
  promoCode:     null,
  promoDiscount: 0,
  promoType:     null,
  deliveryFee:   40,
  notes:         '',
}

const BASE_STORAGE_KEY = 'plattr_cart'
const TAX_RATE = 0.05 // 5% GST

const getEffectivePrice = (item: CartItem): number => {
  if (item.bulk_price !== null && item.quantity >= item.min_bulk_qty) {
    return item.bulk_price
  }
  return item.price
}

const computeSubtotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + getEffectivePrice(item) * item.quantity, 0)

const computeDeliveryFee = (subtotal: number): number => {
  if (subtotal === 0)  return 0
  if (subtotal >= 500) return 0   // free above ₹500
  if (subtotal >= 300) return 20
  return 40
}

const computeDiscount = (
  subtotal: number,
  promoDiscount: number,
  promoType: 'flat' | 'percentage' | null
): number => {
  if (!promoType || promoDiscount === 0) return 0
  if (promoType === 'flat')       return Math.min(promoDiscount, subtotal)
  if (promoType === 'percentage') return Math.round((subtotal * promoDiscount) / 100)
  return 0
}

// ── REDUCER ─────────────────────────────────────────────────────────────────

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, action.payload] }
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload.id) }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      }
    }

    case 'APPLY_PROMO':
      return {
        ...state,
        promoCode:     action.payload.code,
        promoDiscount: action.payload.discount,
        promoType:     action.payload.promoType,
      }

    case 'REMOVE_PROMO':
      return { ...state, promoCode: null, promoDiscount: 0, promoType: null }

    case 'SET_NOTES':
      return { ...state, notes: action.payload.notes }

    case 'CLEAR_CART':
      return INITIAL_STATE

    case 'HYDRATE_CART':
      return { ...action.payload }

    default:
      return state
  }
}

// ── CONTEXT ─────────────────────────────────────────────────────────────────

export const CartContext = createContext<CartContextValue | null>(null);

// ── PROVIDER ─────────────────────────────────────────────────────────────────

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const userId = user?.id || 'guest'
  const storageKey = `${BASE_STORAGE_KEY}_${userId}`

  const loadInitialState = (uid: string): CartState => {
    try {
      const stored = localStorage.getItem(`${BASE_STORAGE_KEY}_${uid}`)
      if (stored) return { ...INITIAL_STATE, ...JSON.parse(stored) }
    } catch { /* corrupted storage — ignore */ }
    return INITIAL_STATE
  }

  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE)
  const [isOpen, setIsOpen] = useState(false)
  const isFirstRender = useRef(true)

  // Handle User/Profile context switches
  useEffect(() => {
    const newState = loadInitialState(userId)
    dispatch({ type: 'CLEAR_CART' }) // Reset to initial
    if (newState.items.length > 0) {
      // We need a way to set the whole state, or just loop and add items.
      // Easiest is to add a 'HYDRATE_CART' action.
      dispatch({ type: 'HYDRATE_CART' as any, payload: newState } as any)
    }
  }, [userId])

  // Persist to localStorage on every state change
  useEffect(() => {
    // Skip the very first render to avoid overwriting with initial state before hydration
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch { /* storage full — ignore */ }
  }, [state, storageKey])

  // ── COMPUTED VALUES ────────────────────────────────────────────────────────

  const subtotal       = computeSubtotal(state.items)
  const discountAmount = computeDiscount(subtotal, state.promoDiscount, state.promoType)
  const deliveryFee    = computeDeliveryFee(subtotal - discountAmount)
  const taxableAmount  = subtotal - discountAmount + deliveryFee
  const tax            = Math.round(taxableAmount * TAX_RATE)
  const total          = taxableAmount + tax
  const itemCount      = state.items.reduce((n, i) => n + i.quantity, 0)
  const isEmpty        = state.items.length === 0
  const hasBulkItems   = state.items.some(
    i => i.bulk_price !== null && i.quantity >= i.min_bulk_qty
  )

  // ── ACTIONS ────────────────────────────────────────────────────────────────

  const addItem = (item: CartItem) => {
    console.log('[CartContext] Adding item:', item.name);
    dispatch({ type: 'ADD_ITEM', payload: item })
    setIsOpen(true) // auto-open cart drawer on add
  }

  const removeItem     = (dishId: string) => dispatch({ type: 'REMOVE_ITEM', payload: { id: dishId } })
  const updateQuantity = (dishId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: dishId, quantity } })
  const applyPromo = (code: string, discount: number, type: 'flat' | 'percentage') =>
    dispatch({ type: 'APPLY_PROMO', payload: { code, discount, promoType: type } })
  const removePromo    = () => dispatch({ type: 'REMOVE_PROMO' })
  const setNotes       = (notes: string) => dispatch({ type: 'SET_NOTES', payload: { notes: notes } })
  const clearCart      = () => {
    dispatch({ type: 'CLEAR_CART' })
    localStorage.removeItem(storageKey)
  }
  const openCart   = () => { console.log('[CartContext] Opening Cart'); setIsOpen(true); }
  const closeCart  = () => { console.log('[CartContext] Closing Cart'); setIsOpen(false); }
  const toggleCart = () => setIsOpen(prev => !prev)

  // Memoize the context value to prevent unnecessary re-renders of all consumers
  const value = useMemo(() => ({
    // State
    items:         state.items,
    promoCode:     state.promoCode,
    promoDiscount: state.promoDiscount,
    promoType:     state.promoType,
    notes:         state.notes,
    isOpen,
    // Computed
    itemCount,
    subtotal,
    discountAmount,
    deliveryFee,
    tax,
    total,
    isEmpty,
    hasBulkItems,
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    applyPromo,
    removePromo,
    setNotes,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  }), [state, isOpen, itemCount, subtotal, discountAmount, deliveryFee, tax, total, isEmpty, hasBulkItems])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
