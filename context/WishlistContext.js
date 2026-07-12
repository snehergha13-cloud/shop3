import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { token, isLoggedIn, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = useCallback(async () => {
    if (!token) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setProducts(data.data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (authLoading) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadWishlist();
  }, [authLoading, loadWishlist]);

  const wishlistIds = useMemo(
    () => new Set(products.map((product) => String(product._id || product.id))),
    [products]
  );

  function isWishlisted(productId) {
    return wishlistIds.has(String(productId));
  }

  async function toggleWishlist(product) {
    if (!isLoggedIn || !token) throw new Error("Please sign in to use your wishlist");

    const productId = product?._id || product?.id || product;
    if (!productId) throw new Error("Product is unavailable");

    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Could not update wishlist");

    if (data.data.wishlisted) {
      const fullProduct = data.data.product || product;
      setProducts((current) => {
        if (current.some((item) => String(item._id || item.id) === String(productId))) return current;
        return [fullProduct, ...current];
      });
    } else {
      setProducts((current) =>
        current.filter((item) => String(item._id || item.id) !== String(productId))
      );
    }

    return data.data.wishlisted;
  }

  return (
    <WishlistContext.Provider
      value={{
        products,
        loading,
        count: products.length,
        isWishlisted,
        toggleWishlist,
        refreshWishlist: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
