import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext"; // Wait, I need CartContext
import { CartContext, type CartContextValue } from "@/context/CartContext";

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
