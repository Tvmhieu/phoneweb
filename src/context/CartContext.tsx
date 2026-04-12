"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Định nghĩa Giỏ hàng Lai (Vừa Mua / Vừa Thuê)
export type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  type: "BUY" | "RENT";
  rentalDays?: number; // Số ngày thuê (Nếu type là RENT)
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
    if (saved) setItems(JSON.parse(saved));
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

  // Hàm tính Tổng tiền: Mua (Giá x SL) + Thuê (Giá thuê x SL x Số ngày)
  const cartTotal = items.reduce((total, item) => {
    if (item.type === "BUY") return total + item.price * item.quantity;
    return total + (item.price * item.quantity * (item.rentalDays || 1));
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
