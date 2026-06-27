import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";

const categoryHref = (slug) => `/shop?category=${slug}`;

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [categories, setCategories] = useState([]);

    const slides = [
        "/assets/home/SLIDE - 0.jpg",
        "/assets/home/SLIDE - 1.jpg",
        "/assets/home/SLIDE - 2.jpg",
        "/assets/home/SLIDE - 3.jpg",

    ];

    // Mobile gets its own portrait-oriented hero images instead of the
    // desktop landscape slides — same rotation logic, different source.
    const mobileSlides = [
        "/assets/mobile_slideshow/mobile_slideshow-1.png",
        "/assets/mobile_slideshow/mobile_slideshow-2.png",
        "/assets/mobile_slideshow/mobile_slideshow-3.png",
        "/assets/mobile_slideshow/mobile_slideshow-4.png",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    // Used by the mobile-only "shop by category" scroller right under the hero.
    useEffect(() => {
        fetch("/api/categories")
            .then((r) => r.json())
            .then((d) => { if (d.success) setCategories(d.data); })
            .catch(() => {});
    }, []);

    return (
        <>

            <Head>
                <title>Word Of Art</title>
            </Head>

            <Navbar />

            {/* HERO */}
            <section className="hero">

                {/* Desktop slides — hidden on mobile via CSS */}
                {slides.map((slide, index) => (
                    <div
                        key={`desktop-${index}`}
                        className={`slide slide-desktop ${currentSlide === index ? "active" : ""}`}
                        style={{ backgroundImage: `url("${slide}")` }}
                    />
                ))}

                {/* Mobile slides — hidden on desktop via CSS, shown only under the mobile breakpoint */}
                {mobileSlides.map((slide, index) => (
                    <div
                        key={`mobile-${index}`}
                        className={`slide slide-mobile ${currentSlide === index ? "active" : ""}`}
                        style={{ backgroundImage: `url("${slide}")` }}
                    />
                ))}

                {/* Mobile-only overlay — desktop slides already carry their own text */}
                <div className="hero-mobile-overlay">
                    <span className="hero-mobile-eyebrow">WORD OF ART</span>
                    <h1>Ideas. Ink. Impact.</h1>
                    <Link href="/shop" className="hero-mobile-cta">SHOP NOW</Link>
                </div>

                <div className="slide-dots">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${currentSlide === index ? "active-dot" : ""}`}
                        />
                    ))}
                </div>

            </section>

            {/* MOBILE-ONLY: SHOP BY CATEGORY SCROLLER */}
            <section className="mobile-category-scroller">
                {(categories.length > 0 ? categories : [
                    { _id: "notebooks", name: "Notebooks", slug: "notebooks", imageUrl: "/assets/A5_softbound/C_1/A5 Notebooks - 1A.png" },
                    { _id: "journals", name: "Journals", slug: "journals", imageUrl: "/assets/Journals/c1/LUNAR JOURNAL _ A.png" },
                ]).map((cat) => (
                    <Link key={cat._id} href={categoryHref(cat.slug)} className="mobile-category-circle">
                        <div className="mobile-category-circle-img">
                            <img src={cat.imageUrl} alt={cat.name} />
                        </div>
                        <span>{cat.name}</span>
                    </Link>
                ))}
                <Link href="/shop" className="mobile-category-circle">
                    <div className="mobile-category-circle-img">
                        <img src="/assets/home/SLIDE - 1.jpg" alt="All products" />
                    </div>
                    <span>All Products</span>
                </Link>
            </section>

            {/* MOBILE-ONLY: NEW ARRIVALS BANNER */}
            <section className="mobile-new-arrivals">
                <img src="/assets/home/SLIDE - 1.jpg" alt="New Arrivals" />
                <div className="mobile-new-arrivals-overlay">
                    <h2>NEW ARRIVALS</h2>
                    <Link href="/shop">VIEW COLLECTION</Link>
                </div>
            </section>

            {/* SMALL IMAGE CARDS */}
            <section className="small-cards">
                <div className="small-card">
                    <img src="/assets/Journals/LANDING PAGE/Jounal - 1.png" alt="Founder's Note" />
                    <span>FOUNDER&apos;S NOTE</span>
                </div>
                <div className="small-card">
                    <img src="/assets/A5_softbound/C_2/mock up.png" alt="Craft Stories" />
                    <span>CRAFT STORIES</span>
                </div>
                <div className="small-card">
                    <img src="/assets/softbound_notebooks/Product-2/softcover-notebook-a5.jpg" alt="Notebooks" />
                    <span>NOTEBOOKS</span>
                </div>
                <div className="small-card">
                    <img src="/assets/A5_softbound/C_1/Product - 1/Context 1.jpg" alt="Writing Tools" />
                    <span>WRITING TOOLS</span>
                </div>
                <div className="small-card">
                    <img src="/assets/mobile_slideshow/mobile_slideshow-1.png" alt="Desk Objects" />
                    <span>DESK OBJECTS</span>
                </div>
            </section>


            {/* FEATURE IMAGES */}
            <section className="feature-grid">

                <Link href={categoryHref("journals")} className="feature-card">
                    <img src="/assets/Journals/LANDING PAGE/Jounal - 1.png" alt="Journals" />
                    <div className="feature-overlay">
                        <h2>JOURNALS</h2>
                        <p>Crafted for every passing thought.</p>
                        <button>SHOP NOW</button>
                    </div>
                </Link>

                <Link href={categoryHref("notebooks")} className="feature-card">
                    <img src="/assets/A5_softbound/C_1/A5 Notebooks - 1B.png" alt="A5 Notebooks" />
                    <div className="feature-overlay">
                        <h2>A5 NOTEBOOKS</h2>
                        <p>Minimal tools for organized minds.</p>
                        <button>SHOP NOW</button>
                    </div>
                </Link>

            </section>

            {/* SHOP BY CATEGORY */}
            <section className="category-section">

                <h2>SHOP BY CATEGORY</h2>

                <div className="category-grid">
                    <Link className="category-card" href={categoryHref("notebooks")}>
                        <img src="https://via.placeholder.com/600x500" alt="" />
                        <h3>NOTEBOOKS</h3>
                    </Link>
                    <Link className="category-card" href={categoryHref("journals")}>
                        <img src="https://via.placeholder.com/600x500" alt="" />
                        <h3>JOURNALS</h3>
                    </Link>
                    <Link className="category-card" href={categoryHref("sketchbooks")}>
                        <img src="https://via.placeholder.com/600x500" alt="" />
                        <h3>SKETCHBOOKS</h3>
                    </Link>
                    <Link className="category-card" href={categoryHref("planners")}>
                        <img src="https://via.placeholder.com/600x500" alt="" />
                        <h3>PLANNERS</h3>
                    </Link>
                    <Link className="category-card" href={categoryHref("notepads")}>
                        <img src="https://via.placeholder.com/600x500" alt="" />
                        <h3>NOTEPADS</h3>
                    </Link>
                    <Link className="category-card" href={categoryHref("memo-pads")}>
                        <img src="https://via.placeholder.com/600x500" alt="" />
                        <h3>MEMO PADS</h3>
                    </Link>
                    <Link className="category-card" href={categoryHref("writing-pads")}>
                        <img src="https://via.placeholder.com/600x500" alt="" />
                        <h3>WRITING PADS</h3>
                    </Link>
                    <Link className="category-card" href={categoryHref("pocket-notebooks")}>
                        <img src="https://via.placeholder.com/600x500" alt="" />
                        <h3>POCKET NOTEBOOKS</h3>
                    </Link>
                    <Link className="category-card" href={categoryHref("paper-products")}>
                        <img src="https://via.placeholder.com/600x500" alt="" />
                        <h3>PAPER GOODS</h3>
                    </Link>
                </div>

            </section>

            {/* FINAL PRODUCT IMAGES */}
            <section className="product-buttons">
                <Link className="product-card" href={categoryHref("postcards")}>
                    <img src="/assets/card/postcard.jpg" alt="" />
                    <div className="product-overlay">
                        <button>POSTCARDS</button>
                    </div>
                </Link>
                <Link className="product-card" href={categoryHref("greeting-cards")}>
                    <img src="/assets/card/greeting-card.jpg" alt="" />
                    <div className="product-overlay">
                        <button>GREETING CARDS</button>
                    </div>
                </Link>
                <Link className="product-card" href={categoryHref("book-marks")}>
                    <img src="/assets/card/book-mark.jpg" alt="" />
                    <div className="product-overlay">
                        <button>BOOK MARKS</button>
                    </div>
                </Link>
                <Link className="product-card" href={categoryHref("art-prints")}>
                    <img src="/assets/card/art-print.jpg" alt="" />
                    <div className="product-overlay">
                        <button>ARTPRINTS</button>
                    </div>
                </Link>
                <Link className="product-card" href={categoryHref("envelopes")}>
                    <img src="/assets/card/envelope.jpg" alt="" />
                    <div className="product-overlay">
                        <button>ENVELOPES</button>
                    </div>
                </Link>
            </section>


            {/* FOOTER */}
            <footer className="footer">

                <div className="footer-container">

                    <div className="footer-column">
                        <h3>ABOUT WORD OF ART</h3>
                        <p>
                            Word Of Art is a tribute to timeless stationery,
                            thoughtful craftsmanship and modern minimalism.
                            Built around paper goods, journals and artistic
                            essentials, the brand blends functionality with elegance
                            for creators, writers and thinkers.
                        </p>
                        <div className="social-icons">
                            <a href="#">F</a>
                            <a href="#">X</a>
                            <a href="#">IG</a>
                            <a href="#">P</a>
                            <a href="#">YT</a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h3>IMPORTANT LINKS</h3>
                        <ul>
                            <li><a href="#">Catalogue</a></li>
                            <li><a href="#">Stores</a></li>
                            <li><a href="#">Gift Cards</a></li>
                            <li><a href="#">Corporate Gifts</a></li>
                            <li><a href="#">Press</a></li>
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Track Order</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>MAIN MENU</h3>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Collaborations</a></li>
                            <li><a href="#">Journal</a></li>
                            <li><Link href="/projects">Collections</Link></li>
                            <li><Link href="/shop">Shop</Link></li>
                            <li><a href="#">Cafe Dori</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>NEWSLETTER</h3>
                        <p>
                            Subscribe to stay updated about new products,
                            launches and promotional offers.
                        </p>
                        <form className="newsletter-form">
                            <input type="email" placeholder="Enter your email address" />
                            <button type="submit">SUBSCRIBE</button>
                        </form>
                    </div>

                </div>

                <div className="footer-bottom">
                    © WORD OF ART
                </div>

            </footer>
        </>
    );
}