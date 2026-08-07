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

            {/* MOBILE-ONLY: SHOP BY CATEGORY SCROLLER */}
            

            {/* MOBILE-ONLY: NEW ARRIVALS BANNER */}
           

            {/* SMALL IMAGE CARDS */}
            <section className="carousel-shell small-cards-shell" aria-label="Featured stories and categories">
                <button
                    type="button"
                    className="carousel-arrow carousel-arrow-left"
                    aria-label="Scroll featured cards left"
                    onClick={() => scrollCarousel(smallCardsRef, -1)}
                >
                    <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
                </button>
                <div className="small-cards" ref={smallCardsRef}>
                <Link href="/about" className="small-card" aria-label="Read the founder's note">
                    <img src="/assets/tittle card/founders note image.jpeg" alt="Founder's Note" />
                    <span>FOUNDER&apos;S NOTE</span>
                </Link>
                <Link href="/about" className="small-card" aria-label="Read WordArt craft stories">
                    <img src="/assets/tittle card/craft_stories.jpg" alt="Craft Stories" />
                    <span>CRAFT STORIES</span>
                </Link>
                <Link href={categoryHref("notebooks")} className="small-card" aria-label="Shop notebooks">
                    <img src="/assets/A5_softbound/C_1/A5 Notebooks - 1A.png" alt="Notebooks" />
                    <span>NOTEBOOKS</span>
                </Link>
                <Link href="/search?q=writing" className="small-card" aria-label="Search writing tools">
                    <img src="/assets/tittle card/writing_instrument.jpg" alt="Writing Tools" />
                    <span>WRITING TOOLS</span>
                </Link>
                <Link href={categoryHref("desk_obj")} className="small-card" aria-label="Shop desk objects">
                    <img src="/assets/desk_obj/5.jpeg" alt="Desk Objects" />
                    <span>DESK OBJECTS</span>
                </Link>
                </div>
                <button
                    type="button"
                    className="carousel-arrow carousel-arrow-right"
                    aria-label="Scroll featured cards right"
                    onClick={() => scrollCarousel(smallCardsRef, 1)}
                >
                    <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                </button>
            </section>


            {/* FEATURE IMAGES */}
            <section className="feature-grid">

                <Link href={categoryHref("journals")} className="feature-card" aria-label="Shop journals">
                    <img src="/assets/Journals/LANDING PAGE/Jounal - 1.png" alt="Journals" />
                    <div className="feature-overlay">
                        <div className="feature-overlay-text">
                            
                        </div>
                        <span className="heroBannerBtn">SHOP NOW</span>
                    </div>
                </Link>

                <Link href={categoryHref("notebooks")} className="feature-card" aria-label="Shop A5 notebooks">
                    <img src="/assets/A5_softbound/C_1/A5 Notebooks - 1B.png" alt="A5 Notebooks" />
                    <div className="feature-overlay">
                        <div className="feature-overlay-text">
                            
                        </div>
                        <span className="heroBannerBtn">SHOP NOW</span>
                    </div>
                </Link>

            </section>

            {/* SHOP BY CATEGORY */}
            <section className="category-section">

                <h2>SHOP BY CATEGORY</h2>

                <div className="category-grid">
                    <Link className="category-card" href={categoryHref("notebooks")}>
                        <img src="/assets/A5_softbound/C_1/A5 Notebooks - 1B.png" alt="" />
                        <h3>NOTEBOOKS</h3>
                    </Link>
                    <Link className="category-card" href={categoryHref("journals")}>
                        <img src="/assets/Journals/LANDING PAGE/Jounal - 1.png" alt="" />
                        <h3>JOURNALS</h3>
                    </Link>
                    <Link className="category-card" href={categoryHref("sketchbooks")}>
                        <img src="/assets/tittle card/sketchbook.png" alt="" />
                        <h3>SKETCHBOOKS</h3>
                    </Link>
                    <Link className="category-card" href={categoryHref("planners")}>
                        <img src="/assets/tittle card/planner.jpg" alt="" />
                        <h3>PLANNERS</h3>
                    </Link>
                    <Link className="category-card" href={categoryHref("pocket-notebooks")}>
                        <img src="/assets/tittle card/pocket_notebooks.jpg" alt="" />
                        <h3>POCKET NOTEBOOKS</h3>
                    </Link>
                
                </div>

            </section>

            {/* FINAL PRODUCT IMAGES */}
            <section className="carousel-shell product-buttons-shell" aria-label="Paper goods categories">
                <button
                    type="button"
                    className="carousel-arrow carousel-arrow-left"
                    aria-label="Scroll paper goods left"
                    onClick={() => scrollCarousel(productButtonsRef, -1)}
                >
                    <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
                </button>
                <div className="product-buttons" ref={productButtonsRef}>
                <Link className="product-card" href={categoryHref("postcards")} aria-label="Shop postcards">
                    <img src="/assets/card/postcard.jpg" alt="Postcards" />
                </Link>
                <Link className="product-card" href={categoryHref("greeting-cards")} aria-label="Shop greeting cards">
                    <img src="/assets/card/greeting-card.jpg" alt="Greeting Cards" />
                </Link>
                <Link className="product-card" href={categoryHref("book-marks")} aria-label="Shop book marks">
                    <img src="/assets/card/book-mark.jpg" alt="Book Marks" />
                </Link>
                <Link className="product-card" href={categoryHref("art-prints")} aria-label="Shop art prints">
                    <img src="/assets/card/art-print.jpg" alt="Art Prints" />
                </Link>
                <Link className="product-card" href={categoryHref("envelopes")} aria-label="Shop envelopes">
                    <img src="/assets/card/envelope.jpg" alt="Envelopes" />
                </Link>
                </div>
                <button
                    type="button"
                    className="carousel-arrow carousel-arrow-right"
                    aria-label="Scroll paper goods right"
                    onClick={() => scrollCarousel(productButtonsRef, 1)}
                >
                    <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                </button>
            </section>


            </div>

            {/* FOOTER */}

            <Footer />
        </>
    );
}