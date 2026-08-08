import { useEffect, useState } from "react";
import Head from "next/head";

const slides = [
  {
    image: "/images/hero-01.jpg",
    eyebrow: "THE ART OF WRITING",
    title: "Made for\nthoughts worth keeping.",
    text: "Elegant paper goods, designed for everyday rituals.",
    button: "EXPLORE COLLECTION",
  },
  {
    image: "/images/hero-02.jpg",
    eyebrow: "THE NOTEBOOK EDIT",
    title: "Put your ideas\nsomewhere beautiful.",
    text: "Thoughtfully made notebooks for notes, plans and everything between.",
    button: "SHOP NOTEBOOKS",
  },
  {
    image: "/images/hero-03.jpg",
    eyebrow: "THE DESK EDIT",
    title: "A desk,\nwell considered.",
    text: "Objects that make working feel a little more intentional.",
    button: "DISCOVER THE EDIT",
  },
];

const categories = [
  {
    title: "NEW ARRIVALS",
    image: "/images/category-01.jpg",
  },
  {
    title: "NOTEBOOKS",
    image: "/images/category-02.jpg",
  },
  {
    title: "WRITING",
    image: "/images/category-03.jpg",
  },
  {
    title: "DESK OBJECTS",
    image: "/images/category-04.jpg",
  },
  {
    title: "GIFTS",
    image: "/images/category-05.jpg",
  },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6500);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[activeSlide];

  return (
    <>
      <Head>
        <title>WORDART — Elegant Stationery</title>
        <meta
          name="description"
          content="WORDART creates elegant stationery for writing, thinking and everyday rituals."
        />
        <meta name="theme-color" content="#25221d" />
      </Head>

      <main className="site">

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <header className="navbar">
          <button
            className={`menu-button ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="brand">
            W<span>O</span>R<span>D</span>A<span>R</span>T
          </div>

          <nav className="desktop-nav">
            <a href="#shop">SHOP</a>
            <a href="#collections">COLLECTIONS</a>
            <a href="#studio">STUDIO</a>
            <a href="#journal">JOURNAL</a>
          </nav>

          <div className="nav-actions">
            <button aria-label="Search" className="nav-icon search-icon">
              <span></span>
            </button>

            <button className="currency">
              INR
              <span className="chevron">⌄</span>
            </button>

            <button aria-label="Shopping bag" className="bag-icon">
              <span className="bag-handle"></span>
              <span className="bag-body"></span>
              <small>0</small>
            </button>
          </div>
        </header>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <div className="mobile-menu-inner">
            <p className="mobile-menu-label">WORDART</p>

            <a href="#shop" onClick={() => setMenuOpen(false)}>
              SHOP
            </a>

            <a href="#collections" onClick={() => setMenuOpen(false)}>
              COLLECTIONS
            </a>

            <a href="#studio" onClick={() => setMenuOpen(false)}>
              STUDIO
            </a>

            <a href="#journal" onClick={() => setMenuOpen(false)}>
              JOURNAL
            </a>

            <div className="mobile-menu-footer">
              <span>INSTAGRAM</span>
              <span>CONTACT</span>
            </div>
          </div>
        </div>

        {/* =====================================================
            HERO SLIDESHOW
        ===================================================== */}

        <section className="hero">

          {slides.map((item, index) => (
            <div
              key={item.image}
              className={`hero-slide ${
                index === activeSlide ? "active" : ""
              }`}
              style={{
                backgroundImage: `url("${item.image}")`,
              }}
            >
              <div className="hero-overlay"></div>

              <div className="hero-content">

                <p className="hero-eyebrow">{item.eyebrow}</p>

                <h1>
                  {item.title.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h1>

                <p className="hero-description">
                  {item.text}
                </p>

                <a href="#shop" className="hero-button">
                  {item.button}
                  <span>→</span>
                </a>

              </div>
            </div>
          ))}

          <div className="hero-controls">

            <div className="slide-counter">
              <span>
                {String(activeSlide + 1).padStart(2, "0")}
              </span>
              <i></i>
              <span>
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            <div className="hero-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={index === activeSlide ? "active" : ""}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <button
            className="scroll-button"
            onClick={() =>
              document
                .getElementById("collections")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label="Scroll down"
          >
            ↓
          </button>
        </section>

        {/* =====================================================
            INTRODUCTION
        ===================================================== */}

        <section className="intro-section">

          <div className="section-number">01 / 05</div>

          <div className="intro-content">
            <p className="small-label">THE WORDART PHILOSOPHY</p>

            <h2>
              Stationery should be
              <em> felt</em>, not simply used.
            </h2>

            <p className="intro-copy">
              We believe the things surrounding your thoughts should
              deserve as much consideration as the thoughts themselves.
            </p>

            <a href="#studio" className="text-link">
              OUR STORY
              <span>→</span>
            </a>
          </div>

        </section>

        {/* =====================================================
            EDITORIAL SPLIT
        ===================================================== */}

        <section className="editorial-grid" id="collections">

          <article className="editorial-card editorial-large">
            <div
              className="editorial-image"
              style={{
                backgroundImage:
                  "url('/images/editorial-01.jpg')",
              }}
            />

            <div className="editorial-overlay"></div>

            <div className="editorial-content">
              <p>THE PAPER COLLECTION</p>
              <h3>
                Pages made
                <br />
                for ideas.
              </h3>

              <a href="#shop">
                EXPLORE <span>→</span>
              </a>
            </div>
          </article>

          <article className="editorial-card">
            <div
              className="editorial-image"
              style={{
                backgroundImage:
                  "url('/images/editorial-02.jpg')",
              }}
            />

            <div className="editorial-overlay"></div>

            <div className="editorial-content">
              <p>WRITING INSTRUMENTS</p>
              <h3>
                Write
                <br />
                beautifully.
              </h3>

              <a href="#shop">
                DISCOVER <span>→</span>
              </a>
            </div>
          </article>

        </section>

        {/* =====================================================
            FEATURE CAMPAIGN
        ===================================================== */}

        <section className="feature-section" id="shop">

          <div
            className="feature-image"
            style={{
              backgroundImage:
                "url('/images/notebook.jpg')",
            }}
          />

          <div className="feature-overlay"></div>

          <div className="feature-content">
            <p className="feature-label">THE NOTEBOOK COLLECTION</p>

            <h2>
              For thoughts
              <br />
              in progress.
            </h2>

            <p>
              Linen covers. Considered details.
              <br />
              Pages waiting for you.
            </p>

            <a href="#shop" className="cream-button">
              SHOP NOTEBOOKS
            </a>
          </div>

        </section>

        {/* =====================================================
            SECOND FEATURE
        ===================================================== */}

        <section className="wide-feature">

          <div
            className="wide-feature-image"
            style={{
              backgroundImage:
                "url('/images/writing.jpg')",
            }}
          />

          <div className="wide-feature-copy">
            <p className="small-label">WRITING, REFINED</p>

            <h2>
              A good pen changes
              <br />
              the way a thought arrives.
            </h2>

            <p>
              Discover writing instruments designed to become
              part of your daily ritual.
            </p>

            <a href="#shop" className="text-link">
              VIEW WRITING
              <span>→</span>
            </a>
          </div>

        </section>

        {/* =====================================================
            CATEGORIES
        ===================================================== */}

        <section className="category-section">

          <div className="section-heading">

            <div>
              <span className="section-kicker">
                04 / 05
              </span>

              <h2>SHOP BY CATEGORY</h2>
            </div>

            <p>
              Objects for writing,
              <br />
              working and gifting.
            </p>

          </div>

          <div className="category-scroll">

            {categories.map((category, index) => (
              <a
                href="#shop"
                className="category"
                key={category.title}
              >
                <div className="category-image">
                  <img
                    src={category.image}
                    alt={category.title}
                  />

                  <span className="category-number">
                    0{index + 1}
                  </span>
                </div>

                <h3>{category.title}</h3>

                <span className="category-arrow">
                  →
                </span>
              </a>
            ))}

          </div>

        </section>

        {/* =====================================================
            DESK CAMPAIGN
        ===================================================== */}

        <section className="desk-section">

          <div
            className="desk-image"
            style={{
              backgroundImage:
                "url('/images/desk.jpg')",
            }}
          />

          <div className="desk-overlay"></div>

          <div className="desk-content">

            <p>THE DESK EDIT</p>

            <h2>
              Make room
              <br />
              for good work.
            </h2>

            <a href="#shop" className="cream-button">
              EXPLORE THE DESK EDIT
            </a>

          </div>

        </section>

        {/* =====================================================
            STUDIO
        ===================================================== */}

        <section className="studio-section" id="studio">

          <div className="studio-number">
            05 / 05
          </div>

          <div className="studio-content">

            <p className="small-label">
              FROM THE WORDART STUDIO
            </p>

            <h2>
              Designed slowly.
              <br />
              Made to stay.
            </h2>

            <p>
              From the grain of a notebook cover to the weight
              of a pen in your hand, every WORDART object begins
              with a simple question:
              <br />
              <strong>
                can everyday things be made more beautiful?
              </strong>
            </p>

            <a href="#journal" className="text-link">
              VISIT OUR JOURNAL
              <span>→</span>
            </a>

          </div>

        </section>

        {/* =====================================================
            NEWSLETTER
        ===================================================== */}

        <section className="newsletter" id="journal">

          <p className="small-label">
            THE WORDART LETTER
          </p>

          <h2>
            Notes from
            <br />
            our desk.
          </h2>

          <p>
            New collections, studio stories and things
            worth writing about.
          </p>

          <form className="newsletter-form">
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              aria-label="Email address"
            />

            <button type="submit">
              →
            </button>
          </form>

        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="footer">

          <div className="footer-top">

            <div className="footer-brand">
              WORDART
              <span>
                ELEGANT STATIONERY
              </span>
            </div>

            <div className="footer-columns">

              <div>
                <h4>SHOP</h4>
                <a href="#shop">Notebooks</a>
                <a href="#shop">Writing</a>
                <a href="#shop">Desk</a>
                <a href="#shop">Gifts</a>
              </div>

              <div>
                <h4>ABOUT</h4>
                <a href="#studio">Our Story</a>
                <a href="#studio">Studio</a>
                <a href="#journal">Journal</a>
                <a href="#journal">Contact</a>
              </div>

              <div>
                <h4>FOLLOW</h4>
                <a href="#instagram">Instagram</a>
                <a href="#instagram">Pinterest</a>
              </div>

            </div>

          </div>

          <div className="footer-bottom">

            <span>
              © {new Date().getFullYear()} WORDART
            </span>

            <span>
              MADE FOR THE THINGS WORTH WRITING DOWN.
            </span>

            <span>
              INDIA
            </span>

          </div>

        </footer>

        {/* =====================================================
            FLOATING WHATSAPP
        ===================================================== */}

        <a
          href="https://wa.me/"
          className="whatsapp"
          aria-label="WhatsApp"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L.2 24l6.5-1.7a11.8 11.8 0 0 0 5.4 1.3h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.1-1.2-6.1-3.5-8.3Zm-8.4 18.1h-.1a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.9 1 1-3.8-.3-.4a9.8 9.8 0 0 1-1.5-5.1C1.9 6.4 6.4 1.9 12 1.9c2.7 0 5.1 1 7 2.9 1.9 1.9 2.9 4.3 2.9 7 0 5.4-4.4 9.8-9.8 9.8Zm5.4-7.3c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.8-1.7.1-.2 0-.4-.1-.6-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9 0 1.7 1.2 3.4 1.4 3.6.2.2 2.4 3.7 5.8 5.1 2.2 1 2.7.8 3.2.8.5-.1 1.8-.7 2.1-1.3.3-.6.3-1.1.2-1.3-.1-.1-.3-.2-.6-.4Z"
              fill="currentColor"
            />
          </svg>
        </a>

      </main>
    </>
  );
}