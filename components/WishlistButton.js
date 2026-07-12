import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

export default function WishlistButton({ product, className = "wishlist", label, activeLabel = "Wishlisted" }) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [saving, setSaving] = useState(false);

  const productId = product?._id || product?.id;
  const active = productId ? isWishlisted(productId) : false;

  async function handleToggle(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn) {
      const redirect = router.asPath || "/shop";
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    if (!productId || saving) return;
    setSaving(true);
    try {
      await toggleWishlist(product);
    } catch (err) {
      alert(err.message || "Could not update wishlist");
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      className={`${className}${active ? " wishlisted" : ""}`}
      onClick={handleToggle}
      disabled={saving}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <i className={`${active ? "fa-solid" : "fa-regular"} fa-heart`}></i>
      {label && <span>{active ? activeLabel : label}</span>}
    </button>
  );
}
