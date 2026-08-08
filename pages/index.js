import Head from "next/head";
import { useEffect, useState } from "react";

const heroSlides = [
  {
    label: "THE WORDART COLLECTION",
    title: "The Art of Writing",
    text: "Elegant stationery designed for everyday moments.",
  },
  {
    label: "THE NOTEBOOK COLLECTION",
    title: "Made to Be Written In",
    text: "Thoughtfully designed notebooks and journals.",
  },
  {
    label: "THE DESK COLLECTION",
    title: "For Your Everyday Ideas",
    text: "Beautiful objects for your desk and daily rituals.",
  },
];

const categories = [
  "NEW ARRIVALS",
  "NOTEBOOKS",
  "JOURNALS",
  "WRITING",
  "DESK ESSENTIALS",
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>WordArt — Elegant Stationery</title>
        <meta
          name="description"
          content="WordArt — elegant stationery designed for everyday life."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="wordart">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="header">

          <div className="header-left">

            <button className="hamburger" aria-label="Menu">
              <span />
              <span />
              <span />
            </button>

            <nav className="desktop-menu">
              <a href="#">SHOP</a>
              <a href="#">COLLECTIONS</a>
              <a href="#">ABOUT</a>
            </nav>

          </div>

          <a href="#" className="logo">
            WORDART
          </a>

          <div className="header-right">

            <button className="header-search" aria-label="Search">
              <span />
            </button>

            <button className="currency">
              INR <small>⌄</small>
            </button>

            <button className="bag" aria-label="Shopping bag">
              <span />
            </button>

          </div>

        </header>


        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="hero">

          {heroSlides.map((item, index) => (
            <div
              className={`hero-slide ${
                index === activeSlide ? "active" : ""
              }`}
              key={item.title}
            >

              <div className="placeholder hero-placeholder">
                <span>HERO IMAGE</span>
              </div>

              <div className="hero-shade" />

              <div className="hero-content">

                <p className="eyebrow">
                  {item.label}
                </p>

                <h1>{item.title}</h1>

                <p className="hero-description">
                  {item.text}
                </p>

                <button className="outline-button">
                  SHOP NOW
                </button>

              </div>

            </div>
          ))}


          <div className="hero-controls">

            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={index === activeSlide ? "active" : ""}
                onClick={() => setActiveSlide(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}

          </div>


          <button
            className="hero-scroll"
            aria-label="Scroll down"
            onClick={() =>
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              })
            }
          >
            <span />
          </button>

        </section>


        {/* =====================================================
            INTRO
        ===================================================== */}

        <section className="intro">

          <p className="section-label">
            WORDART
          </p>

          <h2>
            Objects for thoughtful
            <br />
            everyday living.
          </h2>

          <p className="intro-text">
            We believe stationery should be more than something
            functional. It should feel considered, beautiful and
            worth keeping.
          </p>

        </section>


        {/* =====================================================
            TWO EDITORIAL PANELS
        ===================================================== */}

        <section className="content-section">

          <div className="two-column">

            <article className="editorial-card">

              <div className="placeholder editorial-placeholder">
                <span>EDITORIAL IMAGE</span>
              </div>

              <div className="editorial-content">

                <p>THE DESK EDIT</p>

                <h3>
                  Made for
                  <br />
                  the working day.
                </h3>

                <a href="#">DISCOVER</a>

              </div>

            </article>


            <article className="editorial-card">

              <div className="placeholder editorial-placeholder">
                <span>EDITORIAL IMAGE</span>
              </div>

              <div className="editorial-content">

                <p>THE NOTEBOOK EDIT</p>

                <h3>
                  Thoughts
                  <br />
                  worth keeping.
                </h3>

                <a href="#">DISCOVER</a>

              </div>

            </article>

          </div>

        </section>


        {/* =====================================================
            WIDE FEATURE
        ===================================================== */}

        <section className="content-section">

          <article className="wide-feature">

            <div className="placeholder wide-placeholder">
              <span>CAMPAIGN IMAGE</span>
            </div>

            <div className="wide-overlay" />

            <div className="wide-content">

              <p>THE JOURNAL COLLECTION</p>

              <h2>
                Made for every
                <br />
                thought.
              </h2>

              <a href="#" className="white-button">
                SHOP NOW
              </a>

            </div>

          </article>

        </section>


        {/* =====================================================
            SPLIT FEATURE
        ===================================================== */}

        <section className="split-feature">

          <div className="split-image">

            <div className="placeholder">
              <span>CAMPAIGN IMAGE</span>
            </div>

          </div>


          <div className="split-information">

            <p className="section-label">
              THE NOTEBOOK EDIT
            </p>

            <h2>
              Your ideas
              <br />
              belong here.
            </h2>

            <p>
              Premium paper and considered details,
              designed around the way you write.
            </p>

            <a href="#" className="dark-button">
              EXPLORE NOTEBOOKS
            </a>

          </div>

        </section>


        {/* =====================================================
            CATEGORY
        ===================================================== */}

        <section className="categories">

          <div className="section-heading">

            <p>EXPLORE</p>

            <h2>SHOP BY CATEGORY</h2>

          </div>


          <div className="category-grid">

            {categories.map((category, index) => (
              <a href="#" className="category" key={category}>

                <div className={`category-placeholder category-${index}`}>
                  <span>{index + 1}</span>
                </div>

                <h3>{category}</h3>

              </a>
            ))}

          </div>

        </section>


        {/* =====================================================
            FINAL FEATURE
        ===================================================== */}

        <section className="final-feature">

          <div className="placeholder final-placeholder">
            <span>FINAL CAMPAIGN IMAGE</span>
          </div>

          <div className="final-overlay" />

          <div className="final-content">

            <p>THE WORDART COLLECTION</p>

            <h2>
              Beautiful things
              <br />
              for everyday use.
            </h2>

            <a href="#" className="white-button">
              EXPLORE COLLECTION
            </a>

          </div>

        </section>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="footer">

          <div className="footer-inner">

            <div className="footer-logo">
              WORDART
            </div>

            <div className="footer-links">

              <div>
                <h4>SHOP</h4>
                <a href="#">Notebooks</a>
                <a href="#">Journals</a>
                <a href="#">Writing</a>
                <a href="#">Desk</a>
              </div>

              <div>
                <h4>ABOUT</h4>
                <a href="#">Our Story</a>
                <a href="#">Journal</a>
                <a href="#">Contact</a>
              </div>

              <div>
                <h4>HELP</h4>
                <a href="#">Shipping</a>
                <a href="#">Returns</a>
                <a href="#">FAQs</a>
              </div>

            </div>

          </div>

          <div className="footer-bottom">
            © {new Date().getFullYear()} WORDART
          </div>

        </footer>

      </main>
    </>
  );
}