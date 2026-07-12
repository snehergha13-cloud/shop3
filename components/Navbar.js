import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const { isLoggedIn } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data); })
      .catch(() => {});

    fetch("/api/collections")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCollections(d.data); })
      .catch(() => {});
  }, []);

  return (
    <>
      <nav>
        <div className="nav-left">
          <Link href="/">HOME</Link>
        </div>

        <div className="logo">
          <Link href="/">
            <img
              src="/assets/BRAND LOGO - PNG/LOGO - WORDART.png"
              alt="Word Art"
              style={{ height: "50px", objectFit: "contain" }}
            />
          </Link>
        </div>

        <div className="nav-icons">
          <Link
            href={isLoggedIn ? "/account" : "/login"}
            aria-label={isLoggedIn ? "My account" : "Sign in"}
          >
            <i className="fa-regular fa-user"></i>
          </Link>

          <i className="fa-solid fa-magnifying-glass"></i>

          <Link
            href={isLoggedIn ? "/account#wishlist" : "/login?redirect=/account%23wishlist"}
            className="wishlist-nav-button"
            aria-label="Wishlist"
          >
            <i className="fa-regular fa-heart"></i>
            {isLoggedIn && wishlistCount > 0 && (
              <span className="wishlist-count-bubble">{wishlistCount}</span>
            )}
          </Link>

          <Link href="/cart" className="cart-nav-button" aria-label="Cart">
            <i className="fa-solid fa-cart-shopping"></i>
            {cartCount > 0 && (
              <span className="cart-count-bubble">{cartCount}</span>
            )}
          </Link>
        </div>
      </nav>

      <div className="menu-bar">
        <Link className="menu-text" href="/about">
          ABOUT US
        </Link>

        <div className="shop-wrapper">
          <Link href="/shop" className="shop-link">
            SHOP
          </Link>

          <div className="shop-dropdown">
            <div className="dropdown-column">
              <h3>SHOP BY CATEGORIES</h3>
              {categories.length > 0
                ? categories.map((cat) => (
                    <Link key={cat._id} href={`/shop?category=${cat.slug}`}>
                      {cat.name}
                    </Link>
                  ))
                : (
                  <>
                    <Link href="/shop?category=notebooks">Notebooks</Link>
                    <Link href="/shop?category=journals">Journals</Link>
                    <Link href="/shop?category=stationery">Stationery</Link>
                    <Link href="/shop?category=paper-products">Paper Products</Link>
                  </>
                )}
            </div>

            <div className="dropdown-column">
              <h3>SHOP COLLECTIONS</h3>
              {collections.length > 0
                ? collections.map((col) => (
                    <Link key={col._id} href={`/collections/${col.slug}`}>
                      {col.name}
                    </Link>
                  ))
                : (
                  <>
                    <Link href="/projects?category=notebooks">NOTEBOOKS</Link>
                    <Link href="/projects?category=journals">JOURNALS</Link>
                    <Link href="/projects?category=sketchbooks">SKETCHBOOKS</Link>
                    <Link href="/projects?category=planners">PLANNERS</Link>
                  </>
                )}
            </div>

            <div className="dropdown-column">
              <h3>SHOP PAPER GOODS</h3>
              <Link href="/shop?category=postcards">POSTCARDS</Link>
              <Link href="/shop?category=greeting-cards">GREETING CARDS</Link>
              <Link href="/shop?category=book-marks">BOOK MARKS</Link>
              <Link href="/shop?category=art-prints">ART PRINTS</Link>
              <Link href="/shop?category=envelopes">ENVELOPES</Link>
            </div>
          </div>
        </div>

        <Link className="menu-text" href="/projects">
          COLLECTIONS
        </Link>
      </div>
    </>
  );
}
