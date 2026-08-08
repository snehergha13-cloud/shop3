import Head from "next/head";
import { useEffect, useState } from "react";
import "../styles/home.css";

const slides = [
  {
    eyebrow: "THE ART OF WRITING",
    title: "Make space for\nbeautiful thoughts.",
    description:
      "Thoughtfully designed stationery for notes, ideas, sketches, and everything worth remembering.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=2200&q=90",
    button: "Explore collection",
  },
  {
    eyebrow: "THE NEW EDITION",
    title: "Objects made\nto be kept.",
    description:
      "A considered collection of notebooks, journals, paper goods and desk essentials.",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=2200&q=90",
    button: "Discover new arrivals",
  },
  {
    eyebrow: "FOR SLOW MORNINGS",
    title: "Write something\nworth remembering.",
    description:
      "Paper with character. Details with intention. Stationery designed for everyday rituals.",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=2200&q=90",
    button: "Shop journals",
  },
];

const products = [
  {
    name: "The Daily Journal",
    category: "Journals",
    price: "₹649",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=90",
  },
  {
    name: "Linen Notes",
    category: "Notebooks",
    price: "₹449",
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1000&q=90",
  },
  {
    name: "Paper Archive",
    category: "Writing Sets",
    price: "₹799",
    image:
      "https://images.unsplash.com/photo-1455885666463-5e8f0e3c0c18?auto=format&fit=crop&w=1000&q=90",
  },
];

const collections = [
  {
    number: "01",
    title: "Journals",
    description: "For thoughts that deserve more space.",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1400&q=90",
  },
  {
    number: "02",
    title: "Desk Essentials",
    description: "A quieter, better workspace.",
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1400&q=90",
  },
  {
    number: "03",
    title: "Paper Goods",
    description: "The little things that make writing better.",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1400&q=90",
  },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[activeSlide];

  return (
    <>
      <Head>
        <title>ARCADIA — Stationery Co.</title>
        <meta
          name="description"
          content="Elegant stationery designed for everyday rituals."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="home">

        {/* ───────────────── ANNOUNCEMENT ───────────────── */}

        <div className="announcement">
          <span>FREE SHIPPING ON ORDERS ABOVE ₹699</span>
          <span className="announcement-separator">·</span>
          <span>MADE FOR THE EVERYDAY RITUAL</span>
        </div>

        {/* ───────────────── NAVBAR ───────────────── */}

        <header className="navbar">
          <a href="/" className="brand">
            <span>ARCADIA</span>
            <small>STATIONERY CO.</small>
          </a>

          <nav className={`navigation ${menuOpen ? "open" : ""}`}>
            <a href="#shop">Shop</a>
            <a href="#collections">Collections</a>
            <a href="#journal">Journal</a>
            <a href="#story">Our Story</a>
          </nav>

          <div className="nav-actions">
            <button aria-label="Search">
              <SearchIcon />
            </button>

            <button aria-label="Account">
              <UserIcon />
            </button>

            <button className="bag-button" aria-label="Shopping bag">
              <BagIcon />
              <span>0</span>
            </button>

            <button
              className="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <i />
              <i />
            </button>
          </div>
        </header>

        {/* ───────────────── HERO ───────────────── */}

        <section className="hero">

          <div
            key={activeSlide}
            className="hero-background"
            style={{
              backgroundImage: `url("${slide.image}")`,
            }}
          />

          <div className="hero-overlay" />

          <div className="hero-content">
            <p className="hero-eyebrow">{slide.eyebrow}</p>

            <h1>{slide.title}</h1>

            <p className="hero-description">
              {slide.description}
            </p>

            <a href="#shop" className="hero-button">
              {slide.button}
              <ArrowIcon />
            </a>
          </div>

          <div className="hero-bottom">

            <div className="slide-counter">
              <strong>0{activeSlide + 1}</strong>
              <span>/</span>
              <span>0{slides.length}</span>
            </div>

            <div className="slide-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={index === activeSlide ? "active" : ""}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

          </div>
        </section>

        {/* ───────────────── INTRO ───────────────── */}

        <section className="intro-section">

          <div className="intro-label">
            01 — OUR PHILOSOPHY
          </div>

          <div className="intro-content">
            <h2>
              We believe the objects around us should make
              ordinary moments feel a little more considered.
            </h2>

            <a href="#story" className="underlined-link">
              Discover our story
              <ArrowIcon />
            </a>
          </div>

        </section>

        {/* ───────────────── PRODUCTS ───────────────── */}

        <section className="products-section" id="shop">

          <div className="section-heading">

            <div>
              <p>CURATED FOR YOU</p>
              <h2>Quietly beautiful things.</h2>
            </div>

            <a href="#shop" className="outline-button">
              View all products
              <ArrowIcon />
            </a>

          </div>

          <div className="product-grid">

            {products.map((product) => (
              <article className="product-card" key={product.name}>

                <div className="product-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <button className="quick-add">
                    ADD TO BAG
                  </button>

                </div>

                <div className="product-details">

                  <div>
                    <p>{product.category}</p>
                    <h3>{product.name}</h3>
                  </div>

                  <span>{product.price}</span>

                </div>

              </article>
            ))}

          </div>

        </section>

        {/* ───────────────── EDITORIAL ───────────────── */}

        <section className="editorial">

          <div className="editorial-image">
            <img
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1800&q=90"
              alt="Writing with a fountain pen"
            />
          </div>

          <div className="editorial-content">

            <p>THE WRITING RITUAL</p>

            <h2>
              Put pen
              <br />
              to paper.
            </h2>

            <div className="editorial-description">
              There is something different about writing by hand.
              Slower than a screen. More deliberate. More yours.
            </div>

            <a href="#journal" className="underlined-link">
              Read the journal
              <ArrowIcon />
            </a>

          </div>

        </section>

        {/* ───────────────── COLLECTIONS ───────────────── */}

        <section className="collections-section" id="collections">

          <div className="section-heading">

            <div>
              <p>EXPLORE</p>
              <h2>Find your paper.</h2>
            </div>

          </div>

          <div className="collections-grid">

            {collections.map((collection) => (
              <a
                href="#shop"
                className="collection-card"
                key={collection.title}
              >

                <img
                  src={collection.image}
                  alt={collection.title}
                />

                <div className="collection-overlay" />

                <div className="collection-info">

                  <span>{collection.number}</span>

                  <h3>{collection.title}</h3>

                  <p>{collection.description}</p>

                  <ArrowIcon />

                </div>

              </a>
            ))}

          </div>

        </section>

        {/* ───────────────── STORY ───────────────── */}

        <section className="story-section" id="story">

          <div className="story-number">
            02
          </div>

          <div className="story-content">

            <p>MADE WITH INTENTION</p>

            <h2>
              Less noise.
              <br />
              More meaning.
            </h2>

            <div className="story-text">
              Arcadia was created around a simple idea:
              stationery should feel special without trying
              too hard.

              <br />
              <br />

              We work with tactile papers, considered colours,
              practical formats and details that reveal
              themselves over time.
            </div>

            <a href="#story" className="story-button">
              About Arcadia
              <ArrowIcon />
            </a>

          </div>

          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1400&q=90"
              alt="Elegant stationery"
            />
          </div>

        </section>

        {/* ───────────────── JOURNAL ───────────────── */}

        <section className="journal-section" id="journal">

          <div className="journal-heading">

            <div>
              <p>FROM THE JOURNAL</p>
              <h2>Notes on living slowly.</h2>
            </div>

            <a href="#journal" className="underlined-link">
              Read all stories
              <ArrowIcon />
            </a>

          </div>

          <div className="journal-grid">

            <article className="featured-story">

              <img
                src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=90"
                alt="A calm desk"
              />

              <p>DESK / 08.08.26</p>

              <h3>The case for a slower desk.</h3>

              <a href="#journal" className="underlined-link">
                Read story
                <ArrowIcon />
              </a>

            </article>

            <div className="journal-list">

              <article>
                <span>01</span>

                <div>
                  <p>WRITING</p>
                  <h3>Why handwriting still matters.</h3>
                  <a href="#journal">Read more →</a>
                </div>
              </article>

              <article>
                <span>02</span>

                <div>
                  <p>DESIGN</p>
                  <h3>Inside the making of our journals.</h3>
                  <a href="#journal">Read more →</a>
                </div>
              </article>

              <article>
                <span>03</span>

                <div>
                  <p>RITUALS</p>
                  <h3>Five minutes to reset your desk.</h3>
                  <a href="#journal">Read more →</a>
                </div>
              </article>

            </div>

          </div>

        </section>

        {/* ───────────────── NEWSLETTER ───────────────── */}

        <section className="newsletter">

          <div>
            <p>THE ARCADIA LETTER</p>

            <h2>
              Good things,
              <br />
              occasionally.
            </h2>

            <span>
              New collections, studio notes and little
              things worth knowing.
            </span>
          </div>

          <form className="newsletter-form">

            <input
              type="email"
              placeholder="Your email address"
            />

            <button type="submit">
              Subscribe
              <ArrowIcon />
            </button>

          </form>

        </section>

        {/* ───────────────── FOOTER ───────────────── */}

        <footer className="footer">

          <div className="footer-brand">

            <a href="/" className="brand">
              <span>ARCADIA</span>
              <small>STATIONERY CO.</small>
            </a>

            <p>
              Elegant stationery for
              <br />
              everyday rituals.
            </p>

          </div>

          <div className="footer-column">

            <h4>SHOP</h4>

            <a href="#shop">All stationery</a>
            <a href="#shop">Journals</a>
            <a href="#shop">Notebooks</a>
            <a href="#shop">Desk essentials</a>

          </div>

          <div className="footer-column">

            <h4>ABOUT</h4>

            <a href="#story">Our story</a>
            <a href="#journal">Journal</a>
            <a href="#story">Contact</a>
            <a href="#story">Stockists</a>

          </div>

          <div className="footer-column">

            <h4>FOLLOW</h4>

            <a href="#">Instagram</a>
            <a href="#">Pinterest</a>
            <a href="#">YouTube</a>

          </div>

          <div className="footer-bottom">

            <span>
              © 2026 ARCADIA STATIONERY CO.
            </span>

            <span>
              MADE WITH INTENTION.
            </span>

            <span>
              PRIVACY · TERMS
            </span>

          </div>

        </footer>

      </main>
    </>
  );
}

/* ───────────── ICONS ───────────── */

function ArrowIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
      />

      <path
        d="M16 16L21 21"
        stroke="currentColor"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
        stroke="currentColor"
      />

      <path
        d="M5 21C5.8 16.8 8.1 14.5 12 14.5C15.9 14.5 18.2 16.8 19 21"
        stroke="currentColor"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 8.5H19L18 21H6L5 8.5Z"
        stroke="currentColor"
      />

      <path
        d="M9 9V6.5C9 4.8 10.3 3.5 12 3.5C13.7 3.5 15 4.8 15 6.5V9"
        stroke="currentColor"
      />
    </svg>
  );
}