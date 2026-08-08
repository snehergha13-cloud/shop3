import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categoryHref = (slug) => `/shop?category=${slug}`;

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

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [categories, setCategories] = useState([]);
    const smallCardsRef = useRef(null);
    const productButtonsRef = useRef(null);
    const afterHeroRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    // Used by the mobile-only "shop by category" scroller right under the hero.
    const scrollCarousel = (ref, direction) => {
        const container = ref.current;
        if (!container) return;

        const firstCard = container.querySelector("a");
        const cardWidth = firstCard?.getBoundingClientRect().width || container.clientWidth * 0.75;
        const gap = Number.parseFloat(getComputedStyle(container).gap) || 10;

        container.scrollBy({
            left: direction * (cardWidth + gap),
            behavior: "smooth",
        });
    };

    const scrollPastHero = () => {
        afterHeroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    useEffect(() => {
        fetch("/api/categories")
            .then((r) => r.json())
            .then((d) => { if (d.success) setCategories(d.data); })
            .catch(() => {});
    }, []);

    return (
        <>

            <Head>
                <title>WordArt</title>
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

                <button
                    type="button"
                    className="hero-scroll-down"
                    aria-label="Scroll down"
                    onClick={scrollPastHero}
                >
                    <svg
                        className="hero-scroll-down-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

            </section>

            <div id="homepage-content" ref={afterHeroRef}>

            {/* SHOP BY CATEGORY — icon slider, shown at every screen size,
                matching Nappa Dori's category strip rather than being a
                mobile-only element. */}
            <section className="category-scroller-shell">
                <h2 className="category-scroller-heading">Shop By Category</h2>
                <div className="mobile-category-scroller">
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
                    <Link href={categoryHref("postcards")} className="mobile-category-circle">
                        <div className="mobile-category-circle-img">
                            <img src="/assets/card/postcard.jpg" alt="Postcards" />
                        </div>
                        <span>Postcards</span>
                    </Link>
                    <Link href={categoryHref("book-marks")} className="mobile-category-circle">
                        <div className="mobile-category-circle-img">
                            <img src="/assets/card/book-mark.jpg" alt="Book Marks" />
                        </div>
                        <span>Book Marks</span>
                    </Link>
                    <Link href="/shop" className="mobile-category-circle">
                        <div className="mobile-category-circle-img">
                            <img src="/assets/home/SLIDE - 1.jpg" alt="All products" />
                        </div>
                        <span>All Products</span>
                    </Link>
                </div>
            </section>

            {/* FEATURED BANNER — single full-bleed promo, Nappa Dori's
                "Luggage" collection-banner equivalent. */}
            <section className="featured-banner">
                <img src="/assets/home/SLIDE - 1.jpg" alt="Shop the full collection" />
                <div className="featured-banner-overlay">
                    <div className="featured-banner-text">
                        <h2>THE FULL COLLECTION</h2>
                        <p>Every notebook, journal and paper good in one place.</p>
                    </div>
                    <Link href="/shop" className="heroBannerBtn">SHOP NOW</Link>
                </div>
            </section>

            {/* DUAL BANNER — two side-by-side promos, mirrors Nappa Dori's
                FOR HIM / FOR HER pairing. */}
            <section className="feature-grid">

                <Link href={categoryHref("journals")} className="feature-card" aria-label="Shop journals">
                    <img src="/assets/Journals/LANDING PAGE/Jounal - 1.png" alt="Journals" />
                    <div className="feature-overlay">
                        <div className="feature-overlay-text">
                            <h2>JOURNALS</h2>
                            <p>Crafted for every passing thought.</p>
                        </div>
                        <span className="heroBannerBtn">SHOP NOW</span>
                    </div>
                </Link>

                <Link href={categoryHref("notebooks")} className="feature-card" aria-label="Shop A5 notebooks">
                    <img src="/assets/A5_softbound/C_1/A5 Notebooks - 1B.png" alt="A5 Notebooks" />
                    <div className="feature-overlay">
                        <div className="feature-overlay-text">
                            <h2>A5 NOTEBOOKS</h2>
                            <p>Minimal tools for organized minds.</p>
                        </div>
                        <span className="heroBannerBtn">SHOP NOW</span>
                    </div>
                </Link>

            </section>

            {/* OUR BEST SELLERS — product slider, mirrors Nappa Dori's
                best-sellers carousel. */}
            <section className="carousel-shell product-buttons-shell" aria-label="Our best sellers">
                <h2 className="section-heading">Our Best Sellers</h2>
                <div className="carousel-track">
                <button
                    type="button"
                    className="carousel-arrow carousel-arrow-left"
                    aria-label="Scroll best sellers left"
                    onClick={() => scrollCarousel(productButtonsRef, -1)}
                >
                    <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
                </button>
                <div className="product-buttons" ref={productButtonsRef}>
                <Link className="product-card" href={categoryHref("postcards")} aria-label="Shop postcards">
                    <img src="/assets/card/postcard.jpg" alt="Postcards" />
                    <span>Postcards</span>
                </Link>
                <Link className="product-card" href={categoryHref("greeting-cards")} aria-label="Shop greeting cards">
                    <img src="/assets/card/greeting-card.jpg" alt="Greeting Cards" />
                    <span>Greeting Cards</span>
                </Link>
                <Link className="product-card" href={categoryHref("book-marks")} aria-label="Shop book marks">
                    <img src="/assets/card/book-mark.jpg" alt="Book Marks" />
                    <span>Book Marks</span>
                </Link>
                <Link className="product-card" href={categoryHref("art-prints")} aria-label="Shop art prints">
                    <img src="/assets/card/art-print.jpg" alt="Art Prints" />
                    <span>Art Prints</span>
                </Link>
                <Link className="product-card" href={categoryHref("envelopes")} aria-label="Shop envelopes">
                    <img src="/assets/card/envelope.jpg" alt="Envelopes" />
                    <span>Envelopes</span>
                </Link>
                </div>
                <button
                    type="button"
                    className="carousel-arrow carousel-arrow-right"
                    aria-label="Scroll best sellers right"
                    onClick={() => scrollCarousel(productButtonsRef, 1)}
                >
                    <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                </button>
                </div>
            </section>

            {/* OUR CRAFT — brand-story pairing, mirrors Nappa Dori's
                "Design Definition" section. */}
            <section className="carousel-shell small-cards-shell" aria-label="Our craft">
                <h2 className="section-heading">Our Craft</h2>
                <div className="small-cards" ref={smallCardsRef}>
                <Link href="/about" className="small-card" aria-label="Read the founder's note">
                    <img src="/assets/tittle card/founders note image.jpeg" alt="Founder's Note" />
                    <span>FOUNDER&apos;S NOTE</span>
                </Link>
                <Link href="/about" className="small-card" aria-label="Read WordArt craft stories">
                    <img src="/assets/tittle card/craft_stories.jpg" alt="Craft Stories" />
                    <span>CRAFT STORIES</span>
                </Link>
                </div>
            </section>

            </div>

            {/* FOOTER */}

            <Footer />
        </>
    );
}