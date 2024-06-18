// hooks/useCart.ts

import { useEffect, useState } from 'react';
import useCartStore, { CartItem } from '@/store/cartStore';
import { Product } from '@/types/product';

interface CartHook {
  items: CartItem[];
  addToCart: (product: Product, selectedSize: string) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (productId: string, selectedSize: string) => boolean;
  getItem: (productId: string, selectedSize: string) => CartItem | undefined;
}

const useCart = (): CartHook => {
  const cartStore = useCartStore();
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const calculateTotals = () => {
      const items = cartStore.items;
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const price = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      setTotalItems(itemCount);
      setTotalPrice(price);
    };

    calculateTotals();
  }, [cartStore.items]);

  const addToCart = (product: Product, selectedSize: string) => {
    cartStore.addToCart(product, selectedSize);
  };

  const removeFromCart = (productId: string, selectedSize: string) => {
    cartStore.removeFromCart(productId, selectedSize);
  };

  const updateQuantity = (productId: string, selectedSize: string, quantity: number) => {
    cartStore.updateQuantity(productId, selectedSize, quantity);
  };

  const clearCart = () => {
    cartStore.clearCart();
  };

  const isInCart = (productId: string, selectedSize: string): boolean => {
    return cartStore.isInCart(productId, selectedSize);
  };

  const getItem = (productId: string, selectedSize: string): CartItem | undefined => {
    return cartStore.getItem(productId, selectedSize);
  };

  return {
    items: cartStore.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isInCart,
    getItem,
  };
};

export default useCart;