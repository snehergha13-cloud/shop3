// =============================================
// context/CartContext.js
// Global cart state — wraps the whole app so
// any page can read/update the cart
// =============================================

import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]); // cart = array of { product, quantity }

  // Add item or increase quantity if already in cart
  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  // Remove item from cart completely
  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }

  // Total number of items in cart
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Total price
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook — use this in any component to access cart
export function useCart() {
  return useContext(CartContext);
}
