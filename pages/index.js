import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";

const categoryHref = (slug) => `/shop?category=${slug}`;

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        "/assets/home/slide-11.jpg",
        "/assets/home/slide-11.jpg",
        "/assets/home/slide-11.jpg",
        "/assets/home/slide-11.jpg",
        "/assets/home/slide-11.jpg",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>

            <Head>
                <title>Word Of Art</title>

                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />

                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                />
            </Head>

            <Navbar />

            {/* HERO */}
            <section className="hero">

                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`slide ${currentSlide === index ? "active" : ""}`}
                        style={{ backgroundImage: `url(${slide})` }}
                    />
                ))}

                <div className="slide-dots">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${currentSlide === index ? "active-dot" : ""}`}
                        />
                    ))}
                </div>

            </section>

            {/* SMALL IMAGE CARDS */}
            <section className="small-cards">
                <div className="small-card">
                    <img src="https://via.placeholder.com/500x700" alt="" />
                    <span>FOUNDER'S NOTE</span>
                </div>
                <div className="small-card">
                    <img src="https://via.placeholder.com/500x700" alt="" />
                    <span>CRAFT STORIES</span>
                </div>
                <div className="small-card">
                    <img src="https://via.placeholder.com/500x700" alt="" />
                    <span>NOTEBOOKS</span>
                </div>
                <div className="small-card">
                    <img src="https://via.placeholder.com/500x700" alt="" />
                    <span>WRITING TOOLS</span>
                </div>
                <div className="small-card">
                    <img src="https://via.placeholder.com/500x700" alt="" />
                    <span>DESK OBJECTS</span>
                </div>
            </section>

            {/* FEATURE IMAGES */}
            <section className="feature-grid">

                <Link href={categoryHref("journals")} className="feature-card">
                    <img src="/Jounal - 1A.png" alt="" />
                    <div className="feature-overlay">
                        <h2>JOURNALS</h2>
                        <p>Crafted for every passing thought.</p>
                        <button>SHOP NOW</button>
                    </div>
                </Link>

                <Link href={categoryHref("notebooks")} className="feature-card">
                    <img src="/A5 Notebooks - 1B.png" alt="" />
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
                    <img src="https://via.placeholder.com/500x700" alt="" />
                    <div className="product-overlay">
                        <button>POSTCARDS</button>
                    </div>
                </Link>
                <Link className="product-card" href={categoryHref("greeting-cards")}>
                    <img src="https://via.placeholder.com/500x700" alt="" />
                    <div className="product-overlay">
                        <button>GREETING CARDS</button>
                    </div>
                </Link>
                <Link className="product-card" href={categoryHref("book-marks")}>
                    <img src="https://via.placeholder.com/500x700" alt="" />
                    <div className="product-overlay">
                        <button>BOOK MARKS</button>
                    </div>
                </Link>
                <Link className="product-card" href={categoryHref("art-prints")}>
                    <img src="https://via.placeholder.com/500x700" alt="" />
                    <div className="product-overlay">
                        <button>ARTPRINTS</button>
                    </div>
                </Link>
                <Link className="product-card" href={categoryHref("envelopes")}>
                    <img src="https://via.placeholder.com/500x700" alt="" />
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