// =============================================
// context/CartContext.js
// Global cart state.
//
// - Logged in: the cart lives in MongoDB (via /api/cart/*) so it follows
//   the user across devices and survives refreshes.
// - Logged out: a "guest cart" is kept in memory (and mirrored to
//   localStorage) so people can still browse and add items before
//   creating an account. When they log in, the guest cart is merged
//   into their server cart automatically.
// =============================================

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const GUEST_CART_KEY = "woa_guest_cart";

function readGuestCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeGuestCart(items) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

// Normalises both the guest cart shape and the server cart shape into
// a single { product: { id, name, price, image, stock }, quantity } shape
// that every page in the app already expects.
function normaliseServerCart(serverCart) {
  if (!serverCart?.items) return [];
  return serverCart.items
    .filter((item) => item.product) // product may have been deleted
    .map((item) => ({
      product: {
        id: item.product._id,
        name: item.product.name,
        price: item.product.price / 100,
        image: item.product.images?.[0] || "",
        stock: item.product.stock,
      },
      quantity: item.quantity,
    }));
}

export function CartProvider({ children }) {
  const { isLoggedIn, authHeaders, loading: authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const hasMergedGuestCart = useRef(false);

  const fetchServerCart = useCallback(async () => {
    const res = await fetch("/api/cart", { headers: authHeaders() });
    const data = await res.json();
    if (data.success) setCart(normaliseServerCart(data.data));
  }, [authHeaders]);

  // Wait for auth to resolve before deciding which cart source to use,
  // so a logged-in user doesn't flash an empty/guest cart on first paint.
  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCart(readGuestCart());
      setCartLoading(false);
      hasMergedGuestCart.current = false;
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect

    async function syncOnLogin() {
      setCartLoading(true);
      // Merge any items added while logged out into the server cart, once.
      if (!hasMergedGuestCart.current) {
        const guestItems = readGuestCart();
        for (const item of guestItems) {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ productId: item.product.id, quantity: item.quantity }),
          }).catch(() => {});
        }
        if (guestItems.length) writeGuestCart([]);
        hasMergedGuestCart.current = true;
      }
      await fetchServerCart();
      setCartLoading(false);
    }

    syncOnLogin();
  }, [isLoggedIn, authLoading, authHeaders, fetchServerCart]);

  // Add an item, or set its quantity if already in the cart.
  // `quantity` is the quantity to ADD (mirrors the old behaviour where
  // pages called addToCart once per unit); pass an explicit amount instead
  // of looping for clarity and fewer network calls.
  async function addToCart(product, quantity = 1) {
    if (isLoggedIn) {
      const existing = cart.find((item) => item.product.id === product.id);
      const newQuantity = (existing?.quantity || 0) + quantity;
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ productId: product.id, quantity: newQuantity }),
      });
      const data = await res.json();
      if (data.success) setCart(normaliseServerCart(data.data));
      else throw new Error(data.error || "Could not add to cart");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const next = existing
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prev, { product, quantity }];
      writeGuestCart(next);
      return next;
    });
  }

  async function removeFromCart(productId) {
    if (isLoggedIn) {
      const res = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) setCart(normaliseServerCart(data.data));
      return;
    }

    setCart((prev) => {
      const next = prev.filter((item) => item.product.id !== productId);
      writeGuestCart(next);
      return next;
    });
  }

  async function clearCart() {
    if (isLoggedIn) {
      await fetch("/api/cart", { method: "DELETE", headers: authHeaders() });
    } else {
      writeGuestCart([]);
    }
    setCart([]);
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, cartLoading, addToCart, removeFromCart, clearCart, cartCount, cartTotal, refreshCart: fetchServerCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
