import { useState } from 'react';

// Global mock state so it persists across component remounts
let globalCart = [];
let listeners = [];

const notify = () => listeners.forEach(l => l([...globalCart]));

export default function useCart() {
  const [cartItems, setCartItems] = useState(globalCart);

  // Subscribe to changes
  useState(() => {
    const listener = (newCart) => setCartItems(newCart);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const addToCart = (product) => {
    const existing = globalCart.find(i => i.product._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      globalCart.push({ product, quantity: 1 });
    }
    notify();
  };

  const removeFromCart = (id) => {
    globalCart = globalCart.filter(i => i.product._id !== id);
    notify();
  };

  const updateQuantity = (id, quantity) => {
    const existing = globalCart.find(i => i.product._id === id);
    if (existing) {
      existing.quantity = quantity;
    }
    notify();
  };

  const clearCart = () => {
    globalCart = [];
    notify();
  };

  return {
    cartItems,
    cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
    cartTotal: cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
