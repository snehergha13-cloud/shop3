// pages/products/[id].js  →  URL: /products/[id]

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=85",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=85",
  "https://images.unsplash.com/photo-1455642305367-68834a1da7ab?w=800&q=85",
  "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&q=85",
  "https://images.unsplash.com/photo-1609172964404-5e97a3cecd90?w=800&q=85",
];

const RELATED = [
  { name: "Gilded Era Block Pad", price: "₹1,000.00", img: "https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?w=500&q=80" },
  { name: "Heritage Deco Set", price: "From: ₹1,200.00", img: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500&q=80" },
  { name: "Correspondence Cards", price: "From: ₹2,000.00", img: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=500&q=80" },
];

const fmt = (paise) => `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart, cartCount } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [personalise, setPersonalise] = useState("no");
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [cartMsg, setCartMsg] = useState("");
  const [shopDropdown, setShopDropdown] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProduct(data.data);
        setLoading(false);
      });
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    for (let i = 0; i < qty; i += 1) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price / 100,
        image: imgs[0],
      });
    }
    setCartMsg("Added to cart!");
    setTimeout(() => setCartMsg(""), 2500);
  }

  const imgs = product?.images?.length ? product.images : FALLBACK_IMGS;

  return (
    <>
      <Head>
        <title>{product ? `${product.name} – Word Of Art` : "Loading..."}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --cream:#f7f3ee; --dark:#1a1a1a; --mid:#5a5a5a; --light:#8a8a8a; --border:#ddd8d0; }
        body { font-family:'Jost',sans-serif; background:#fff; color:var(--dark); font-size:14px; line-height:1.7; padding-top:132px; }

        nav { position:fixed; font-family:'Jost',sans-serif; top:0; left:0; width:100%; height:80px; display:flex; justify-content:space-between; align-items:center; padding:0 60px; background:rgba(15,15,15,0.45); backdrop-filter:blur(12px); z-index:1000; border-bottom:1px solid rgba(255,255,255,0.08); }
        .nav-left { width:200px; }
        .nav-left a { text-decoration:none; color:white; font-size:13px; letter-spacing:2px; font-weight:500; }
        .logo { display:flex; align-items:center; color:white; gap:20px; font-size:20px; font-weight:300; letter-spacing:8px; }
        .nav-icons { width:200px; display:flex; justify-content:flex-end; align-items:center; gap:22px; color:white; }
        .nav-icons i { font-size:18px; cursor:pointer; transition:0.3s; }
        .nav-icons i:hover { opacity:0.7; }

        .menu-bar { position:fixed; top:80px; left:0; width:100%; height:52px; display:flex; justify-content:center; align-items:center; gap:45px; background:rgba(15,15,15,0.45); backdrop-filter:blur(12px); z-index:999; border-bottom:1px solid rgba(255,255,255,0.08); font-family:'Jost',sans-serif; }
        .menu-bar a { text-decoration:none; color:white; font-size:13px; letter-spacing:2px; font-weight:500; transition:0.3s; }
        .menu-bar a:hover { opacity:0.7; }

        .shop-wrapper { position:relative; height:100%; display:flex; align-items:center; }
        .shop-dropdown { position:absolute; top:52px; left:50%; transform:translateX(-35%); width:950px; padding:45px 55px; display:flex; justify-content:space-between; gap:60px; background:rgba(245,240,232,0.16); backdrop-filter:blur(22px); border:1px solid rgba(255,255,255,0.12); border-radius:0 0 24px 24px; opacity:0; visibility:hidden; transition:all 0.35s ease; box-shadow:0 20px 60px rgba(0,0,0,0.35); z-index:1000; }
        .shop-dropdown.open { opacity:1; visibility:visible; }
        .dropdown-column { min-width:220px; display:flex; flex-direction:column; gap:14px; }
        .dropdown-column h3 { color:white; font-size:14px; letter-spacing:3px; font-weight:600; margin-bottom:8px; }
        .dropdown-column a { color:rgba(255,255,255,0.88); text-decoration:none; font-size:13px; letter-spacing:2px; transition:0.3s; }
        .dropdown-column a:hover { color:#e0b88d; }

        .breadcrumb { padding:12px 60px; font-size:11px; color:var(--light); letter-spacing:0.05em; border-bottom:1px solid var(--border); background:#fff; }
        .breadcrumb a { color:var(--light); text-decoration:none; }
        .breadcrumb a:hover { color:var(--dark); }
        .breadcrumb span { margin:0 7px; }

        .product-section { display:flex; gap:0; max-width:1280px; margin:0 auto; padding:40px 60px 64px; align-items:flex-start; }
        .thumb-col { display:flex; flex-direction:column; gap:10px; width:110px; flex-shrink:0; margin-right:18px; }
        .thumb { width:100px; height:100px; border:1px solid var(--border); border-radius:3px; overflow:hidden; cursor:pointer; transition:border-color 0.2s; }
        .thumb.active { border:2px solid var(--dark); }
        .thumb:hover { border-color:#999; }
        .thumb img { width:100%; height:100%; object-fit:cover; }
        .main-img-wrap { flex:1; min-width:0; margin-right:48px; }
        .main-img-wrap img { width:100%; height:520px; object-fit:cover; border-radius:4px; display:block; background:var(--cream); }
        .product-info { width:380px; flex-shrink:0; }
        .product-title { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:500; line-height:1.2; margin-bottom:20px; }
        .personalise-label { font-size:12px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:10px; }
        .personalise-options { display:flex; gap:24px; margin-bottom:22px; }
        .personalise-options label { display:flex; align-items:center; gap:8px; font-size:13px; letter-spacing:0.05em; cursor:pointer; }
        .personalise-options input[type="radio"] { accent-color:var(--dark); width:16px; height:16px; cursor:pointer; }
        .product-price { font-size:20px; font-weight:400; margin-bottom:26px; letter-spacing:0.02em; }
        .add-row { display:flex; gap:12px; align-items:center; margin-bottom:16px; }
        .qty-ctrl { display:flex; align-items:center; border:1px solid var(--border); border-radius:3px; overflow:hidden; height:48px; }
        .qty-ctrl button { background:none; border:none; width:38px; height:48px; font-size:20px; cursor:pointer; color:var(--dark); transition:background 0.15s; font-weight:300; }
        .qty-ctrl button:hover { background:var(--cream); }
        .qty-ctrl span { width:38px; text-align:center; font-size:14px; font-weight:500; border-left:1px solid var(--border); border-right:1px solid var(--border); line-height:48px; }
        .btn-cart { flex:1; height:48px; background:var(--dark); color:#fff; border:none; border-radius:3px; font-family:'Jost',sans-serif; font-size:12px; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:9px; transition:background 0.2s; }
        .btn-cart:hover { background:#333; }
        .btn-buynow { width:100%; height:48px; background:#fff; color:var(--dark); border:1px solid var(--dark); border-radius:3px; font-family:'Jost',sans-serif; font-size:12px; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; cursor:pointer; margin-bottom:24px; transition:background 0.2s,color 0.2s; }
        .btn-buynow:hover { background:var(--dark); color:#fff; }
        .share-row { display:flex; align-items:center; gap:12px; font-size:12px; color:var(--mid); margin-bottom:32px; letter-spacing:0.06em; text-transform:uppercase; }
        .share-icon { width:30px; height:30px; border-radius:50%; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:border-color 0.2s; }
        .share-icon:hover { border-color:var(--dark); }
        .share-icon svg { width:14px; height:14px; fill:var(--mid); }
        .accordion-item { border-top:1px solid var(--border); }
        .accordion-item:last-child { border-bottom:1px solid var(--border); }
        .accordion-header { display:flex; align-items:center; justify-content:space-between; padding:16px 0; cursor:pointer; user-select:none; }
        .accordion-header h3 { font-size:13px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; }
        .accordion-toggle { font-size:22px; color:var(--mid); font-weight:300; line-height:1; transition:transform 0.25s; }
        .accordion-toggle.open { transform:rotate(45deg); }
        .accordion-body { display:none; padding-bottom:18px; font-size:13.5px; color:var(--mid); line-height:1.85; }
        .accordion-body.open { display:block; }
        .accordion-body ul { list-style:none; padding:0; margin-top:10px; }
        .accordion-body ul li::before { content:"• "; color:var(--light); }
        .accordion-body ul li { padding:2px 0; }

        .cart-msg { padding:10px 14px; background:#edfaf0; color:#1a6633; border:1px solid #b3e8c4; border-radius:3px; font-size:13px; margin-bottom:14px; }

        .related-section { max-width:1280px; margin:0 auto 70px; padding:0 60px; }
        .related-section h2 { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:400; text-align:center; margin-bottom:6px; }
        .related-section .sub { text-align:center; font-size:12px; color:var(--light); letter-spacing:0.06em; margin-bottom:32px; }
        .related-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
        .related-card { cursor:pointer; }
        .related-card-img { aspect-ratio:1; overflow:hidden; border-radius:3px; background:var(--cream); margin-bottom:12px; }
        .related-card-img img { width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease; }
        .related-card:hover .related-card-img img { transform:scale(1.05); }
        .related-card-name { font-size:14px; font-weight:500; margin-bottom:5px; }
        .related-card-price { font-size:13px; color:var(--mid); }

        footer { background:#f5f5f3; padding:110px 70px 40px; border-top:1px solid rgba(0,0,0,0.08); font-family:'Jost',sans-serif; }
        .footer-container { display:grid; grid-template-columns:1.3fr 1fr 1fr 1fr; gap:80px; }
        .footer-column h3 { font-size:1rem; letter-spacing:5px; font-weight:400; margin-bottom:35px; }
        .footer-column p { color:#666; line-height:2; font-size:0.95rem; max-width:350px; }
        .footer-column ul { list-style:none; }
        .footer-column ul li { margin-bottom:18px; }
        .footer-column ul li a { color:#666; font-size:0.95rem; text-decoration:none; transition:0.3s; }
        .footer-column ul li a:hover { color:black; }
        .social-icons { display:flex; gap:28px; margin-top:35px; }
        .social-icons a { color:#666; font-size:1rem; text-decoration:none; transition:0.3s; }
        .social-icons a:hover { color:black; }
        .newsletter-form { margin-top:25px; }
        .newsletter-form input { width:100%; height:48px; border:1px solid rgba(0,0,0,0.12); padding:0 16px; font-size:0.95rem; background:white; outline:none; margin-bottom:20px; font-family:'Jost',sans-serif; }
        .newsletter-form button { height:48px; padding:0 32px; border:none; background:#111; color:white; letter-spacing:3px; cursor:pointer; transition:0.3s; font-family:'Jost',sans-serif; font-size:0.85rem; }
        .newsletter-form button:hover { background:#2b2b2b; }
        .footer-bottom { margin-top:110px; color:#777; letter-spacing:4px; font-size:0.8rem; }

        @media(max-width:900px) {
          nav { padding:0 20px; } .logo { gap:10px; font-size:15px; letter-spacing:4px; } .menu-bar { gap:20px; }
          .product-section { flex-direction:column; padding:20px 24px; }
          .thumb-col { flex-direction:row; width:100%; margin-right:0; margin-bottom:12px; }
          .main-img-wrap { margin-right:0; margin-bottom:24px; }
          .main-img-wrap img { height:340px; }
          .product-info { width:100%; }
          .related-section { padding:0 24px; } .breadcrumb { padding:12px 24px; }
          .footer-container { grid-template-columns:1fr 1fr; gap:60px; }
        }
        @media(max-width:700px) { footer { padding:80px 30px 40px; } .footer-container { grid-template-columns:1fr; } .related-grid { grid-template-columns:1fr 1fr; } }
      `}</style>

      {/* NAVBAR */}
      <nav>
        <div className="nav-left"><Link href="/">HOME</Link></div>
        <div className="logo">
          <span>W</span><span>O</span><span>R</span><span>D</span>
          <span style={{ width: 10, display: "inline-block" }}></span>
          <span>A</span><span>R</span><span>T</span>
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

      {/* MENU BAR */}
      <div className="menu-bar">
        <Link href="#">ABOUT US</Link>
        <div className="shop-wrapper" onMouseEnter={() => setShopDropdown(true)} onMouseLeave={() => setShopDropdown(false)}>
          <Link href="/" className="shop-link" style={{ textDecoration: "none", color: "white", fontSize: "13px", letterSpacing: "2px", fontWeight: 500 }}>SHOP</Link>
          <div className={`shop-dropdown${shopDropdown ? " open" : ""}`}>
            <div className="dropdown-column">
              <h3>SHOP BY CATEGORIES</h3>
              <Link href="#">Stationery</Link>
              <Link href="#">Paper Products</Link>
            </div>
            <div className="dropdown-column">
              <h3>SHOP STATIONERY</h3>
              <Link href="#">NOTEBOOKS</Link>
              <Link href="#">JOURNALS</Link>
              <Link href="#">NOTEPADS</Link>
              <Link href="#">MEMO PADS</Link>
            </div>
            <div className="dropdown-column">
              <h3>SHOP PAPER GOODS</h3>
              <Link href="#">POSTCARDS</Link>
              <Link href="#">GREETING CARDS</Link>
              <Link href="#">ENVELOPES</Link>
              <Link href="#">ART PRINTS</Link>
            </div>
          </div>
        </div>
        <Link href="#">COLLECTIONS</Link>
        <Link href="#">JOURNAL</Link>
        <Link href="#">CONTACT</Link>
      </div>

      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <Link href="/">Home</Link><span>›</span>
        <Link href="/">{product?.category?.name || "Products"}</Link><span>›</span>
        {product?.name || "Loading..."}
      </div>

      {loading ? (
        <div style={{ padding: "80px 60px", fontFamily: "'Jost',sans-serif", color: "#8a8a8a" }}>Loading product…</div>
      ) : !product ? (
        <div style={{ padding: "80px 60px" }}>Product not found. <Link href="/">Go back</Link></div>
      ) : (
        <>
          {/* PRODUCT SECTION */}
          <div className="product-section">

            {/* Thumbnails */}
            <div className="thumb-col">
              {imgs.map((src, i) => (
                <div key={i} className={`thumb${mainImg === i ? " active" : ""}`} onClick={() => setMainImg(i)}>
                  <img src={src} alt="" />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="main-img-wrap">
              <img src={imgs[mainImg]} alt={product.name} />
            </div>

            {/* Info */}
            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>

              <div className="personalise-label">Personalise:</div>
              <div className="personalise-options">
                <label><input type="radio" name="personalise" value="no" checked={personalise === "no"} onChange={() => setPersonalise("no")} /> NO</label>
                <label><input type="radio" name="personalise" value="yes" checked={personalise === "yes"} onChange={() => setPersonalise("yes")} /> YES</label>
              </div>

              <div className="product-price">{fmt(product.price)}</div>

              {cartMsg && <div className="cart-msg">{cartMsg}</div>}

              <div className="add-row">
                <div className="qty-ctrl">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}>+</button>
                </div>
                <button className="btn-cart" onClick={handleAddToCart} disabled={product.stock === 0}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                  {product.stock === 0 ? "Out of Stock" : "Add To Cart"}
                </button>
              </div>

              <button className="btn-buynow">Buy It Now</button>

              <div className="share-row">
                <span>Share:</span>
                <div className="share-icon"><svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></div>
                <div className="share-icon"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="#5a5a5a" strokeWidth="1.5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="#5a5a5a" strokeWidth="2" strokeLinecap="round"/></svg></div>
                <div className="share-icon"><svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg></div>
              </div>

              {/* Details Accordion */}
              <div className="accordion-item">
                <div className="accordion-header" onClick={() => setDetailsOpen(o => !o)}>
                  <h3>Details</h3>
                  <span className={`accordion-toggle${detailsOpen ? " open" : ""}`}>+</span>
                </div>
                <div className={`accordion-body${detailsOpen ? " open" : ""}`}>
                  <p>{product.description}</p>
                  <ul style={{ marginTop: 14 }}>
                    {Object.entries(product.attributes || {}).map(([k, v]) => (
                      <li key={k}>{k.charAt(0).toUpperCase() + k.slice(1)}: {v}</li>
                    ))}
                    {product.sku && <li>SKU: {product.sku}</li>}
                    {product.stock !== undefined && <li>In stock: {product.stock}</li>}
                  </ul>
                </div>
              </div>

              {/* Reviews Accordion */}
              <div className="accordion-item">
                <div className="accordion-header" onClick={() => setReviewsOpen(o => !o)}>
                  <h3>Reviews ({product.numReviews || 0})</h3>
                  <span className={`accordion-toggle${reviewsOpen ? " open" : ""}`}>+</span>
                </div>
                <div className={`accordion-body${reviewsOpen ? " open" : ""}`}>
                  {!product.reviews?.length
                    ? <p>No reviews yet.</p>
                    : product.reviews.map((r, i) => (
                        <p key={i} style={{ marginBottom: 10 }}>
                          {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)} — <em>"{r.comment}"</em>
                        </p>
                      ))
                  }
                </div>
              </div>
            </div>
          </div>

          {/* RELATED */}
          <div className="related-section">
            <h2>You may also like</h2>
            <p className="sub">Explore Related Products and Recommendations</p>
            <div className="related-grid">
              {RELATED.map((r, i) => (
                <div key={i} className="related-card">
                  <div className="related-card-img"><img src={r.img} alt={r.name} /></div>
                  <div className="related-card-name">{r.name}</div>
                  <div className="related-card-price">{r.price}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* FOOTER */}
      <footer>
        <div className="footer-container">
          <div className="footer-column">
            <h3>ABOUT WORD OF ART</h3>
            <p>Word Of Art is a tribute to timeless stationery, thoughtful craftsmanship and modern minimalism.</p>
            <div className="social-icons">
              <a href="#">F</a><a href="#">X</a><a href="#">IG</a><a href="#">P</a><a href="#">YT</a>
            </div>
          </div>
          <div className="footer-column">
            <h3>IMPORTANT LINKS</h3>
            <ul>
              {["Catalogue","Stores","Gift Cards","Corporate Gifts","Press","Contact","Terms & Conditions","Privacy Policy","Track Order"].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-column">
            <h3>MAIN MENU</h3>
            <ul>
              {["About Us","Collaborations","Journal","Collections","Cafe Dori"].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-column">
            <h3>NEWSLETTER</h3>
            <p>Subscribe to stay updated about new products, launches and promotional offers.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button>SUBSCRIBE</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© WORD OF ART</div>
      </footer>
    </>
  );
}
