import { useContext } from "react";
import { CartContext } from "@/context/CartContextType";
import type { CartContextValue } from "@/context/CartContextType";

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export type { CartContextValue };
