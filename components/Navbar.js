import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();
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
          <i className="fa-regular fa-user"></i>
          <i className="fa-solid fa-magnifying-glass"></i>
          <i className="fa-regular fa-heart"></i>
          <Link href="/cart" className="cart-nav-button" aria-label="Cart">
            <i className="fa-solid fa-cart-shopping"></i>
            {cartCount > 0 && (
              <span className="cart-count-bubble">{cartCount}</span>
            )}
          </Link>
        </div>

      </nav>

      <div className="menu-bar">

        <a className="menu-text" href="#">
          ABOUT US
        </a>

        <div className="shop-wrapper">

          <Link href="/shop" className="shop-link">
            SHOP
          </Link>

          <div className="shop-dropdown">

            {/* SHOP BY CATEGORIES — links to /shop?category=slug */}
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

            {/* SHOP COLLECTIONS — links to /collections/slug */}
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

            {/* SHOP PAPER GOODS — static links, these are aspirational categories */}
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