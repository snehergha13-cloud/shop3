import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/images/hero-1.jpg",
      eyebrow: "THE WORDART COLLECTION",
      title: "Stationery Made Beautiful",
      subtitle: "Thoughtfully designed for everyday moments",
    },
    {
      image: "/images/hero-2.jpg",
      eyebrow: "THE CLASSIC COLLECTION",
      title: "Made To Be Kept",
      subtitle: "Elegant stationery for work, study & beyond",
    },
    {
      image: "/images/hero-3.jpg",
      eyebrow: "THE DESK EDIT",
      title: "For Your Everyday Ideas",
      subtitle: "Paper goods designed around the way you create",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const categories = [
    {
      image: "/images/category-new.jpg",
      title: "NEW ARRIVAL",
    },
    {
      image: "/images/category-men.jpg",
      title: "NOTEBOOKS",
    },
    {
      image: "/images/category-women.jpg",
      title: "JOURNALS",
    },
  ];

  return (
    <>
      <Head>
        <title>WordArt — Elegant Stationery</title>
        <meta
          name="description"
          content="WordArt — elegant stationery designed for everyday moments."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="site">

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <header className="navbar">

          <button className="menu-button" aria-label="Open menu">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="brand">
            W&nbsp;&nbsp;O&nbsp;&nbsp;R&nbsp;&nbsp;D&nbsp;&nbsp;A&nbsp;&nbsp;R&nbsp;&nbsp;T
          </div>

          <div className="nav-right">

            <button className="search-button" aria-label="Search">
              <span className="search-circle"></span>
              <span className="search-handle"></span>
            </button>

            <button className="currency">
              INR
              <span className="currency-arrow">⌄</span>
            </button>

            <button className="bag-button" aria-label="Shopping bag">
              <span className="bag-icon"></span>
            </button>

          </div>

        </header>


        {/* =====================================================
            HERO SLIDESHOW
        ====================================================== */}

        <section className="hero">

          {slides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${
                index === currentSlide ? "active" : ""
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >

              <div className="hero-content">

                <div className="hero-eyebrow">
                  {slide.eyebrow}
                </div>

                <h1>{slide.title}</h1>

                <div className="hero-line"></div>

                <p>{slide.subtitle}</p>

                <button className="shop-button">
                  SHOP NOW
                </button>

              </div>

            </div>
          ))}


          <div className="hero-dots">

            {slides.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${
                  index === currentSlide ? "active" : ""
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}

          </div>


          <button className="hero-down" aria-label="Scroll down">
            <span></span>
          </button>

        </section>


        {/* =====================================================
            EDITORIAL TWO IMAGE SECTION
        ====================================================== */}

        <section className="editorial">

          <div className="editorial-grid">

            <div className="editorial-image">
              <img
                src="/images/editorial-1.jpg"
                alt="WordArt stationery collection"
              />

              <div className="editorial-overlay">
                <span>THE DESK EDIT</span>
              </div>

            </div>


            <div className="editorial-image">
              <img
                src="/images/editorial-2.jpg"
                alt="WordArt notebooks"
              />

              <div className="editorial-overlay">
                <span>THE NOTEBOOK EDIT</span>
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            LARGE FEATURE — SLINGS STYLE
        ====================================================== */}

        <section className="feature-section">

          <div className="feature-image">

            <img
              src="/images/slings.jpg"
              alt="WordArt collection"
            />

            <div className="feature-content">

              <h2>JOURNALS</h2>

              <p>
                Made for every thought, idea and everyday moment.
              </p>

              <button className="feature-button">
                SHOP NOW
              </button>

            </div>

          </div>

        </section>


        {/* =====================================================
            SECOND LARGE FEATURE
        ====================================================== */}

        <section className="feature-section feature-second">

          <div className="feature-image">

            <img
              src="/images/laptop-bags.jpg"
              alt="WordArt stationery and writing collection"
            />

            <div className="feature-content">

              <h2>NOTEBOOKS</h2>

              <p>
                Paper goods designed for work, study & beyond.
              </p>

              <button className="feature-button">
                SHOP NOW
              </button>

            </div>

          </div>

        </section>


        {/* =====================================================
            SHOP BY CATEGORY
        ====================================================== */}

        <section className="categories">

          <h2>SHOP BY CATEGORY</h2>

          <div className="category-grid">

            {categories.map((category, index) => (
              <a href="#" className="category" key={index}>

                <div className="category-image">
                  <img
                    src={category.image}
                    alt={category.title}
                  />
                </div>

                <h3>{category.title}</h3>

              </a>
            ))}

          </div>

        </section>


        {/* =====================================================
            LUGGAGE / FINAL FEATURE
        ====================================================== */}

        <section className="luggage">

          <div className="luggage-image">

            <img
              src="/images/luggage.jpg"
              alt="WordArt collection"
            />

            <div className="luggage-content">

              <h2>THE WORDART COLLECTION</h2>

              <button className="luggage-button">
                SHOP NOW
              </button>

            </div>

          </div>

        </section>


        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="footer">

          <div className="footer-brand">
            W&nbsp;&nbsp;O&nbsp;&nbsp;R&nbsp;&nbsp;D&nbsp;&nbsp;A&nbsp;&nbsp;R&nbsp;&nbsp;T
          </div>

          <div className="footer-links">
            <a href="#">ABOUT</a>
            <a href="#">CONTACT</a>
            <a href="#">SHIPPING</a>
            <a href="#">PRIVACY</a>
          </div>

          <div className="footer-copy">
            © {new Date().getFullYear()} WordArt. All rights reserved.
          </div>

        </footer>

      </main>
    </>
  );
}