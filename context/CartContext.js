// =============================================
// context/CartContext.js
// Global cart state.
//
// - Logged in: the cart lives in MongoDB (via /api/cart/*) so it follows
//   the user across devices and survives refreshes.
// - Logged out: a guest cart is kept in localStorage and is merged into
//   the user's server cart after login.
// =============================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import { calculateBundlePricing } from "../lib/bundlePricing";

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

function normaliseReference(reference) {
  if (!reference) return null;
  if (typeof reference === "string") return { slug: reference };
  return {
    id: reference._id || reference.id,
    name: reference.name,
    slug: reference.slug,
  };
}

function normaliseServerCart(serverCart) {
  if (!serverCart?.items) return [];

  return serverCart.items
    .filter((item) => item.product)
    .map((item) => ({
      product: {
        id: item.product._id,
        name: item.product.name,
        price: item.product.price / 100,
        image: item.product.images?.[0] || "",
        stock: item.product.stock,
        category: normaliseReference(item.product.category),
        collection: normaliseReference(item.product.collection),
      },
      quantity: item.quantity,
    }));
}

function normaliseGuestProduct(product) {
  return {
    ...product,
    id: product.id || product._id,
    category: normaliseReference(product.category),
    collection: normaliseReference(product.collection),
  };
}

async function hydrateGuestCart(items) {
  return Promise.all(
    items.map(async (item) => {
      const product = normaliseGuestProduct(item.product || {});

      if (product.category?.slug && product.collection?.slug) {
        return { ...item, product };
      }

      if (!product.id) return { ...item, product };

      try {
        const response = await fetch(`/api/products/${product.id}`);
        const data = await response.json();
        if (!data.success) return { ...item, product };

        const serverProduct = data.data;
        return {
          ...item,
          product: {
            ...product,
            id: serverProduct._id,
            name: serverProduct.name,
            price: serverProduct.price / 100,
            image: serverProduct.images?.[0] || product.image || "",
            stock: serverProduct.stock,
            category: normaliseReference(serverProduct.category),
            collection: normaliseReference(serverProduct.collection),
          },
        };
      } catch {
        return { ...item, product };
      }
    })
  );
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

  useEffect(() => {
    if (authLoading) return undefined;

    let cancelled = false;

    if (!isLoggedIn) {
      async function loadGuestCart() {
        setCartLoading(true);
        const hydrated = await hydrateGuestCart(readGuestCart());
        if (cancelled) return;
        writeGuestCart(hydrated);
        setCart(hydrated);
        setCartLoading(false);
        hasMergedGuestCart.current = false;
      }

      loadGuestCart();
      return () => {
        cancelled = true;
      };
    }

    async function syncOnLogin() {
      setCartLoading(true);

      if (!hasMergedGuestCart.current) {
        const guestItems = readGuestCart();
        for (const item of guestItems) {
          const productId = item.product?.id || item.product?._id;
          if (!productId) continue;

          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ productId, quantity: item.quantity }),
          }).catch(() => {});
        }

        if (guestItems.length) writeGuestCart([]);
        hasMergedGuestCart.current = true;
      }

      await fetchServerCart();
      if (!cancelled) setCartLoading(false);
    }

    syncOnLogin();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, authLoading, authHeaders, fetchServerCart]);

  async function addToCart(product, quantity = 1) {
    if (isLoggedIn) {
      const existing = cart.find((item) => item.product.id === (product.id || product._id));
      const newQuantity = (existing?.quantity || 0) + quantity;
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          productId: product.id || product._id,
          quantity: newQuantity,
        }),
      });
      const data = await res.json();
      if (data.success) setCart(normaliseServerCart(data.data));
      else throw new Error(data.error || "Could not add to cart");
      return;
    }

    const normalisedProduct = normaliseGuestProduct(product);

    setCart((previous) => {
      const existing = previous.find(
        (item) => item.product.id === normalisedProduct.id
      );
      const next = existing
        ? previous.map((item) =>
            item.product.id === normalisedProduct.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...previous, { product: normalisedProduct, quantity }];
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

    setCart((previous) => {
      const next = previous.filter((item) => item.product.id !== productId);
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
  const pricing = useMemo(
    () => calculateBundlePricing(cart, { priceScale: 1 }),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal: pricing.regularSubtotal,
        cartDiscount: pricing.discount,
        cartTotal: pricing.total,
        bundleOffers: pricing.offers,
        refreshCart: fetchServerCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
