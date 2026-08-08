import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [slide, setSlide] = useState(0);

  const heroSlides = [
    {
      image: "/images/hero-1.jpg",
      title: "The Art of Writing",
      subtitle: "Stationery designed for everyday moments.",
      button: "SHOP NOW",
    },
    {
      image: "/images/hero-2.jpg",
      title: "Made to Be Written In",
      subtitle: "Thoughtfully crafted notebooks and journals.",
      button: "SHOP NOW",
    },
    {
      image: "/images/hero-3.jpg",
      title: "For Your Desk",
      subtitle: "Elegant essentials for work, study and life.",
      button: "EXPLORE",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((current) => (current + 1) % heroSlides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  const categories = [
    {
      image: "/images/category-new.jpg",
      title: "NEW ARRIVALS",
    },
    {
      image: "/images/category-notebooks.jpg",
      title: "NOTEBOOKS",
    },
    {
      image: "/images/category-journals.jpg",
      title: "JOURNALS",
    },
    {
      image: "/images/category-writing.jpg",
      title: "WRITING",
    },
    {
      image: "/images/category-desk.jpg",
      title: "DESK ESSENTIALS",
    },
  ];

  return (
    <>
      <Head>
        <title>WordArt — Elegant Stationery</title>
        <meta
          name="description"
          content="Elegant stationery for thoughtful writing."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>

      <div className="page">

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <header className="navbar">

          <button className="menu-button">
            <span />
            <span />
            <span />
          </button>

          <div className="logo">
            W O R D A R T
          </div>

          <nav className="desktop-nav">
            <a href="#">NOTEBOOKS</a>
            <a href="#">JOURNALS</a>
            <a href="#">WRITING</a>
            <a href="#">DESK</a>
            <a href="#">GIFTS</a>
          </nav>

          <div className="nav-actions">

            <button className="search">
              <span />
            </button>

            <button className="currency">
              INR <b>⌄</b>
            </button>

            <button className="bag">
              <span />
            </button>

          </div>

        </header>


        {/* ==================================================
            HERO
        ================================================== */}

        <section className="hero">

          {heroSlides.map((item, index) => (
            <div
              key={index}
              className={`hero-slide ${
                slide === index ? "visible" : ""
              }`}
              style={{
                backgroundImage: `url(${item.image})`,
              }}
            >

              <div className="hero-overlay" />

              <div className="hero-copy">

                <span className="hero-small">
                  WORDART COLLECTION
                </span>

                <h1>{item.title}</h1>

                <div className="hero-decoration">
                  <span />
                  <i>✦</i>
                  <span />
                </div>

                <p>{item.subtitle}</p>

                <button className="hero-button">
                  {item.button}
                </button>

              </div>

            </div>
          ))}


          <div className="hero-pagination">

            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={slide === index ? "selected" : ""}
                onClick={() => setSlide(index)}
              />
            ))}

          </div>


          <button className="scroll-button">
            <span />
          </button>

        </section>


        {/* ==================================================
            EDITORIAL TWO-COLUMN SECTION
        ================================================== */}

        <section className="editorial-section">

          <div className="editorial-grid">

            <article className="editorial-card">

              <img
                src="/images/editorial-1.jpg"
                alt="WordArt stationery"
              />

              <div className="editorial-text">
                <small>THE DESK EDIT</small>
                <h2>Made for the<br />working day.</h2>
                <a href="#">DISCOVER</a>
              </div>

            </article>


            <article className="editorial-card">

              <img
                src="/images/editorial-2.jpg"
                alt="WordArt journals"
              />

              <div className="editorial-text">
                <small>THE NOTEBOOK EDIT</small>
                <h2>Thoughts worth<br />keeping.</h2>
                <a href="#">DISCOVER</a>
              </div>

            </article>

          </div>

        </section>


        {/* ==================================================
            WIDE CAMPAIGN
        ================================================== */}

        <section className="campaign">

          <div className="campaign-image">

            <img
              src="/images/slings.jpg"
              alt="WordArt journals collection"
            />

            <div className="campaign-overlay" />

            <div className="campaign-copy">

              <span>THE JOURNAL COLLECTION</span>

              <h2>
                Made for every
                <br />
                thought.
              </h2>

              <p>
                Premium paper. Considered details.
                <br />
                Designed to be kept.
              </p>

              <button>
                SHOP NOW
              </button>

            </div>

          </div>

        </section>


        {/* ==================================================
            SPLIT CAMPAIGN
        ================================================== */}

        <section className="split-section">

          <div className="split-image">

            <img
              src="/images/laptop-bags.jpg"
              alt="WordArt notebooks"
            />

            <div className="split-overlay" />

            <div className="split-copy">

              <span>THE NOTEBOOK EDIT</span>

              <h2>
                Your ideas
                <br />
                belong here.
              </h2>

              <button>
                SHOP NOW
              </button>

            </div>

          </div>


          <div className="split-text">

            <span>WORDART</span>

            <h2>
              Objects for
              <br />
              thoughtful
              <br />
              living.
            </h2>

            <p>
              We believe the things you use every day
              should be beautifully made.
            </p>

            <a href="#">
              OUR STORY
            </a>

          </div>

        </section>


        {/* ==================================================
            SHOP BY CATEGORY
        ================================================== */}

        <section className="category-section">

          <div className="section-heading">
            <span>EXPLORE</span>
            <h2>SHOP BY CATEGORY</h2>
          </div>


          <div className="category-row">

            {categories.map((category, index) => (
              <a
                href="#"
                className="category-item"
                key={index}
              >

                <div className="category-circle">
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


        {/* ==================================================
            FINAL LARGE CAMPAIGN
        ================================================== */}

        <section className="final-campaign">

          <img
            src="/images/luggage.jpg"
            alt="WordArt collection"
          />

          <div className="final-overlay" />

          <div className="final-copy">

            <span>THE WORDART COLLECTION</span>

            <h2>
              Beautiful things
              <br />
              for everyday use.
            </h2>

            <button>
              EXPLORE COLLECTION
            </button>

          </div>

        </section>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer>

          <div className="footer-top">

            <div className="footer-brand">
              W O R D A R T
            </div>

            <div className="footer-column">
              <h4>SHOP</h4>
              <a href="#">Notebooks</a>
              <a href="#">Journals</a>
              <a href="#">Writing</a>
              <a href="#">Desk</a>
            </div>

            <div className="footer-column">
              <h4>ABOUT</h4>
              <a href="#">Our Story</a>
              <a href="#">Journal</a>
              <a href="#">Contact</a>
            </div>

            <div className="footer-column">
              <h4>HELP</h4>
              <a href="#">Shipping</a>
              <a href="#">Returns</a>
              <a href="#">FAQs</a>
            </div>

          </div>

          <div className="footer-bottom">
            © {new Date().getFullYear()} WORDART
          </div>

        </footer>

      </div>
    </>
  );
}