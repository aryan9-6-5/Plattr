import { createContext } from "react";
import type { CartItem } from "@/types/cart";

export type CartContextValue = {
  // State
  items:          CartItem[]
  promoCode:      string | null
  promoDiscount:  number
  promoType:      'flat' | 'percentage' | null
  notes:          string
  isOpen:         boolean

  // Computed
  itemCount:      number
  subtotal:       number
  discountAmount: number
  deliveryFee:    number
  tax:            number
  total:          number
  isEmpty:        boolean
  hasBulkItems:   boolean

  // Actions
  addItem:        (item: CartItem) => void
  removeItem:     (dishId: string) => void
  updateQuantity: (dishId: string, quantity: number) => void
  applyPromo:     (code: string, discount: number, type: 'flat' | 'percentage') => void
  removePromo:    () => void
  setNotes:       (notes: string) => void
  clearCart:      () => void
  openCart:       () => void
  closeCart:      () => void
  toggleCart:     () => void
}

export const CartContext = createContext<CartContextValue | null>(null);
