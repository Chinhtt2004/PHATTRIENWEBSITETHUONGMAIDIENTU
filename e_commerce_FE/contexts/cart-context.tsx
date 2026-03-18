"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchCartItems, fetchProducts, removeCartItem, addToCart } from "@/lib/api";
import { type Product } from "@/lib/data";
import { toast } from "sonner";

interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  variant: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  loadCart: () => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const [items, products] = await Promise.all([fetchCartItems(), fetchProducts()]);
      const productMap = new Map<number, Product>(products.map((product) => [Number(product.id), product]));

      setCartItems(
        items.map((item) => {
          const product = productMap.get(item.productId);
          return {
            id: String(item.id),
            productId: String(item.productId),
            variantId: product?.variants[0]?.id || `var-${item.productId}`,
            slug: product?.slug || "",
            name: item.productName,
            variant: product?.variants[0]?.name || "Mặc định",
            image: product?.images[0]?.url || "/placeholder.svg",
            price: product?.price || 0,
            quantity: item.quantity,
          };
        })
      );
    } catch (error) {
      // Silently handle errors (user might not be logged in)
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    const item = cartItems.find((cartItem) => cartItem.id === itemId);
    if (!item) return;

    try {
      await removeCartItem(Number(item.productId));
      setCartItems((items) => items.filter((cartItem) => cartItem.id !== itemId));
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa sản phẩm");
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const item = cartItems.find((cartItem) => cartItem.id === itemId);
    if (!item) return;

    try {
      await addToCart(Number(item.productId), newQuantity);
      setCartItems((items) =>
        items.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
        )
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể cập nhật số lượng");
    }
  };

  const addItem = async (productId: number, quantity: number) => {
    try {
      await addToCart(productId, quantity);
      await loadCart();
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể thêm sản phẩm");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, isLoading, loadCart, removeItem, updateQuantity, addItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
