"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Định nghĩa Giỏ hàng
export type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Tải giỏ hàng từ localStorage khi Tải trang
  useEffect(() => {
    const saved = localStorage.getItem("nhanviet_cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Dùng setTimeout để tránh lỗi "Calling setState synchronously within an effect"
        setTimeout(() => setItems(parsed), 0);
      } catch (e) {
        console.error("Lỗi giỏ hàng:", e);
      }
    }
  }, []);

  // Lưu giỏ hàng mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("nhanviet_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, "id">) => {
    setItems((prev) => [...prev, { ...item, id: Date.now() }]);
    alert(`Đã thêm ${item.name} vào Giỏ hàng!`);
  };

  const removeFromCart = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));
  
  const clearCart = () => setItems([]);

  // Hàm tính Tổng tiền: Mua (Giá x SL)
  const cartTotal = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};
