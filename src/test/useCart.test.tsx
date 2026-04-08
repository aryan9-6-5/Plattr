import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { CartProvider } from "@/context/CartContext";
import { useCart } from "@/hooks/useCart";
import React from "react";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const MOCK_ITEM = {
  id: "dish-1",
  name: "Mock Biryani",
  price: 200,
  quantity: 1,
  image_url: "",
  source_type: "RESTAURANT" as const,
  source_id: "res-1",
  meal_type: "ALA_CARTE" as const,
  bulk_price: 150,
  min_bulk_qty: 10,
};

describe("useCart Hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should start with an empty cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.subtotal).toBe(0);
  });

  it("should add an item to the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem(MOCK_ITEM);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe("dish-1");
    expect(result.current.subtotal).toBe(200);
  });

  it("should apply bulk pricing when threshold is met", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem({ ...MOCK_ITEM, quantity: 10 });
    });

    // 10 items * 150 (bulk_price) = 1500
    expect(result.current.subtotal).toBe(1500);
    expect(result.current.hasBulkItems).toBe(true);
  });

  it("should handle tiered delivery fees", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Case 1: Subtotal < 300 -> ₹40 fee
    act(() => {
      result.current.addItem({ ...MOCK_ITEM, price: 100, quantity: 1, bulk_price: null });
    });
    expect(result.current.deliveryFee).toBe(40);

    // Case 2: Subtotal >= 300 -> ₹20 fee
    act(() => {
      result.current.updateQuantity("dish-1", 3);
    });
    expect(result.current.subtotal).toBe(300);
    expect(result.current.deliveryFee).toBe(20);

    // Case 3: Subtotal >= 500 -> Free delivery
    act(() => {
      result.current.updateQuantity("dish-1", 5);
    });
    expect(result.current.subtotal).toBe(500);
    expect(result.current.deliveryFee).toBe(0);
  });

  it("should apply flat promo code", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem({ ...MOCK_ITEM, quantity: 1 }); // 200
      result.current.applyPromo("SAVE50", 50, "flat");
    });

    expect(result.current.discountAmount).toBe(50);
    expect(result.current.total).toBeGreaterThan(150);
  });

  it("should apply percentage promo code", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem({ ...MOCK_ITEM, quantity: 2 }); // 400
      result.current.applyPromo("OFF10", 10, "percentage");
    });

    expect(result.current.discountAmount).toBe(40); // 10% of 400
  });

  it("should calculate GST (5%) correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem({ ...MOCK_ITEM, price: 1000, quantity: 1, bulk_price: null });
    });

    // Subtotal = 1000
    // Discount = 0
    // Delivery = 0 (>= 500)
    // Taxable = 1000
    // Tax = 1000 * 0.05 = 50
    // Total = 1050
    expect(result.current.tax).toBe(50);
    expect(result.current.total).toBe(1050);
  });

  it("should clear the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem(MOCK_ITEM);
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.isEmpty).toBe(true);
  });
});
