import { Product } from "@/types/product";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, selectedSize: string) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  getTotals: () => { totalItems: number; totalPrice: number };
  isInCart: (productId: string, selectedSize: string) => boolean;
  getItem: (productId: string, selectedSize: string) => CartItem | undefined;
}

const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      items: [],

      addToCart: (product: Product, selectedSize: string) => {
        if (!product || !product.pid) {
          console.error("Invalid product");
          return;
        }
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.pid === product.pid && item.selectedSize === selectedSize
          );
          if (existingItemIndex !== -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity = Math.min(newItems[existingItemIndex].quantity + 1, 10);
            return { items: newItems };
          } else {
            return {
              items: [...state.items, { product, selectedSize, quantity: 1 }],
            };
          }
        });
      },

      removeFromCart: (productId: string, selectedSize: string) => {
        if (!productId) {
          console.error("Invalid product ID");
          return;
        }
        set((state) => ({
          items: state.items.filter((item) => !(item.product.pid === productId && item.selectedSize === selectedSize)),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      updateQuantity: (productId: string, selectedSize: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.pid === productId && item.selectedSize === selectedSize
              ? { ...item, quantity: Math.max(1, Math.min(quantity, 10)) }
              : item
          ),
        }));
      },

      getTotals: () => {
        const items = get().items;
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        return { totalItems, totalPrice };
      },

      isInCart: (productId: string, selectedSize: string) => {
        return get().items.some((item) => item.product.pid === productId && item.selectedSize === selectedSize);
      },

      getItem: (productId: string, selectedSize: string) => {
        return get().items.find((item) => item.product.pid === productId && item.selectedSize === selectedSize);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;