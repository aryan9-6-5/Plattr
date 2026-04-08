import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import type { CartItem, CartState } from '@/types/cart'

// ── TYPES ──────────────────────────────────────────────────────────────────

type CartAction =
  | { type: 'ADD_ITEM';        payload: CartItem }
  | { type: 'REMOVE_ITEM';     payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'APPLY_PROMO';     payload: { code: string; discount: number; promoType: 'flat' | 'percentage' } }
  | { type: 'REMOVE_PROMO' }
  | { type: 'SET_NOTES';       payload: { notes: string } }
  | { type: 'CLEAR_CART' }

import { CartContext } from "./CartContextType";
import type { CartContextValue } from "./CartContextType";


// ── INITIAL STATE ───────────────────────────────────────────────────────────

const INITIAL_STATE: CartState = {
  items:         [],
  promoCode:     null,
  promoDiscount: 0,
  promoType:     null,
  deliveryFee:   40,
  notes:         '',
}

const STORAGE_KEY = 'plattr_cart'

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

    default:
      return state
  }
}

// ── COMPUTED HELPERS ────────────────────────────────────────────────────────

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

const TAX_RATE = 0.05 // 5% GST

// ── CONTEXT ─────────────────────────────────────────────────────────────────



// ── PROVIDER ─────────────────────────────────────────────────────────────────

export const CartProvider = ({ children }: { children: React.ReactNode }) => {

  const loadInitialState = (): CartState => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return { ...INITIAL_STATE, ...JSON.parse(stored) }
    } catch { /* corrupted storage — ignore */ }
    return INITIAL_STATE
  }

  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE, loadInitialState)
  const [isOpen, setIsOpen] = useState(false)

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch { /* storage full — ignore */ }
  }, [state])

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
    dispatch({ type: 'ADD_ITEM', payload: item })
    setIsOpen(true) // auto-open cart drawer on add
  }

  const removeItem     = (dishId: string) => dispatch({ type: 'REMOVE_ITEM', payload: { id: dishId } })
  const updateQuantity = (dishId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: dishId, quantity } })
  const applyPromo = (code: string, discount: number, type: 'flat' | 'percentage') =>
    dispatch({ type: 'APPLY_PROMO', payload: { code, discount, promoType: type } })
  const removePromo    = () => dispatch({ type: 'REMOVE_PROMO' })
  const setNotes       = (notes: string) => dispatch({ type: 'SET_NOTES', payload: { notes } })
  const clearCart      = () => {
    dispatch({ type: 'CLEAR_CART' })
    localStorage.removeItem(STORAGE_KEY)
  }
  const openCart   = () => setIsOpen(true)
  const closeCart  = () => setIsOpen(false)
  const toggleCart = () => setIsOpen(prev => !prev)

  return (
    <CartContext.Provider value={{
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
    }}>
      {children}
    </CartContext.Provider>
  )
}


