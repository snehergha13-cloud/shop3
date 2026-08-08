import Head from "next/head";
import { useEffect, useState } from "react";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=2200&q=90",
    kicker: "THE NEW NOTEBOOK COLLECTION",
    title: "Made for\nthe things\nworth keeping.",
    text: "Paper objects designed to become part of your everyday.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=2200&q=90",
    kicker: "THE WRITING EDIT",
    title: "Put your\nthoughts\nsomewhere.",
    text: "Beautifully considered tools for writing, sketching and planning.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=2200&q=90",
    kicker: "OBJECTS FOR THE DESK",
    title: "A desk\nworth sitting\nat.",
    text: "Stationery and desk objects with purpose, character and restraint.",
  },
];

const products = [
  {
    name: "Classic Journal",
    type: "HARD COVER · RULED",
    price: "₹695",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=90",
  },
  {
    name: "Field Notes",
    type: "POCKET NOTEBOOK · PLAIN",
    price: "₹395",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1000&q=90",
  },
  {
    name: "Desk Folio",
    type: "DESK ORGANISER",
    price: "₹1,850",
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1000&q=90",
  },
  {
    name: "Correspondence Set",
    type: "PAPER · ENVELOPES",
    price: "₹545",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1000&q=90",
  },
];

const categories = [
  {
    title: "Journals",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1400&q=90",
  },
  {
    title: "Writing",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=90",
  },
  {
    title: "Desk Objects",
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1400&q=90",
  },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Head>
        <title>ARTHUR & CO. — Objects for Writing</title>
        <meta
          name="description"
          content="Thoughtfully designed stationery and objects for everyday life."
        />
      </Head>

      <div className="site">

        {/* TOP STRIP */}

        <div className="top-strip">
          <span>DESIGNED IN INDIA</span>
          <span>•</span>
          <span>FREE SHIPPING ABOVE ₹699</span>
          <span>•</span>
          <span>CRAFTED FOR EVERYDAY USE</span>
        </div>

        {/* HEADER */}

        <header className="header">

          <button
            className="mobile-toggle"
            onClick={() => setMenu(!menu)}
          >
            <span />
            <span />
          </button>

          <nav className={`main-nav ${menu ? "mobile-open" : ""}`}>
            <a href="#shop">SHOP</a>
            <a href="#collections">COLLECTIONS</a>
            <a href="#journal">JOURNAL</a>
          </nav>

          <a className="logo" href="/">
            <span>ARTHUR & CO.</span>
            <small>OBJECTS FOR EVERYDAY LIFE</small>
          </a>

          <div className="header-right">

            <a href="#search" className="desktop-only">
              SEARCH
            </a>

            <a href="#account" className="desktop-only">
              ACCOUNT
            </a>

            <a href="#bag">
              BAG <sup>0</sup>
            </a>

          </div>

        </header>

        {/* HERO */}

        <section className="hero">

          {heroSlides.map((item, index) => (
            <div
              key={item.title}
              className={`hero-slide ${
                index === slide ? "hero-active" : ""
              }`}
              style={{
                backgroundImage: `url("${item.image}")`,
              }}
            />
          ))}

          <div className="hero-shade" />

          <div className="hero-copy">

            <div className="hero-kicker">
              {heroSlides[slide].kicker}
            </div>

            <h1>
              {heroSlides[slide].title}
            </h1>

            <p>
              {heroSlides[slide].text}
            </p>

            <a href="#shop" className="hero-link">
              EXPLORE COLLECTION
              <Arrow />
            </a>

          </div>

          <div className="hero-meta">

            <div className="hero-count">
              <span>0{slide + 1}</span>
              <i />
              <span>0{heroSlides.length}</span>
            </div>

            <div className="hero-dots">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={index === slide ? "selected" : ""}
                  onClick={() => setSlide(index)}
                />
              ))}
            </div>

          </div>

        </section>

        {/* MANIFESTO */}

        <section className="manifesto">

          <div className="section-index">
            01
          </div>

          <div className="manifesto-content">

            <p className="small-heading">
              OUR APPROACH
            </p>

            <h2>
              Objects should become
              <em> better </em>
              with use.
            </h2>

            <p className="manifesto-text">
              We make stationery for people who still enjoy
              writing things down. Simple objects, honest
              materials and thoughtful details — made to be
              used every day rather than kept away.
            </p>

            <a href="#story" className="editorial-link">
              OUR STORY
              <Arrow />
            </a>

          </div>

          <div className="manifesto-image">

            <img
              src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=90"
              alt="Notebook and writing desk"
            />

            <span>
              FIG. 01 — THE WRITING DESK
            </span>

          </div>

        </section>

        {/* CATEGORY ROW */}

        <section className="category-section" id="collections">

          <div className="section-title-row">

            <div>
              <p className="small-heading">
                EXPLORE
              </p>

              <h2>
                The collection
              </h2>
            </div>

            <a href="#shop" className="editorial-link">
              VIEW EVERYTHING
              <Arrow />
            </a>

          </div>

          <div className="category-grid">

            {categories.map((category, index) => (
              <a
                href="#shop"
                className={`category category-${index + 1}`}
                key={category.title}
              >

                <img
                  src={category.image}
                  alt={category.title}
                />

                <div className="category-overlay" />

                <div className="category-copy">

                  <span>
                    0{index + 1}
                  </span>

                  <h3>
                    {category.title}
                  </h3>

                  <div>
                    EXPLORE
                    <Arrow />
                  </div>

                </div>

              </a>
            ))}

          </div>

        </section>

        {/* FEATURED PRODUCTS */}

        <section className="featured-section" id="shop">

          <div className="section-title-row">

            <div>
              <p className="small-heading">
                THE EDIT
              </p>

              <h2>
                Things we keep close.
              </h2>
            </div>

            <p className="section-description">
              A selection of everyday objects designed
              to live on your desk, in your bag and
              everywhere in between.
            </p>

          </div>

          <div className="products">

            {products.map((product, index) => (
              <article
                className={`product product-${index + 1}`}
                key={product.name}
              >

                <div className="product-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <button>
                    ADD TO BAG
                  </button>

                </div>

                <div className="product-info">

                  <div>
                    <span>{product.type}</span>

                    <h3>
                      {product.name}
                    </h3>
                  </div>

                  <strong>
                    {product.price}
                  </strong>

                </div>

              </article>
            ))}

          </div>

        </section>

        {/* LARGE EDITORIAL */}

        <section className="large-editorial">

          <div className="large-editorial-image">

            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=90"
              alt="Creative workspace"
            />

          </div>

          <div className="large-editorial-content">

            <span className="large-number">
              02
            </span>

            <p className="small-heading">
              THE EVERYDAY DESK
            </p>

            <h2>
              Make room
              <br />
              for ideas.
            </h2>

            <p>
              A good desk is not about having more.
              It is about having the right things within
              reach.
            </p>

            <a href="#shop" className="editorial-link light">
              SHOP DESK OBJECTS
              <Arrow />
            </a>

          </div>

        </section>

        {/* CRAFT SECTION */}

        <section className="craft-section" id="story">

          <div className="craft-image">

            <img
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1500&q=90"
              alt="Handwriting"
            />

          </div>

          <div className="craft-copy">

            <p className="small-heading">
              MADE WITH INTENTION
            </p>

            <h2>
              Good design
              <br />
              doesn't need
              <br />
              to shout.
            </h2>

            <p>
              From the weight of the paper to the way a
              notebook opens flat, every detail has a
              purpose. We believe functionality can be
              beautiful when it is quietly considered.
            </p>

            <div className="craft-details">

              <div>
                <strong>01</strong>
                <span>CONSIDERED MATERIALS</span>
              </div>

              <div>
                <strong>02</strong>
                <span>TIMELESS DESIGN</span>
              </div>

              <div>
                <strong>03</strong>
                <span>MADE TO BE USED</span>
              </div>

            </div>

          </div>

        </section>

        {/* JOURNAL */}

        <section className="journal" id="journal">

          <div className="journal-heading">

            <div>
              <p className="small-heading">
                FROM THE JOURNAL
              </p>

              <h2>
                Notes, ideas & observations.
              </h2>
            </div>

            <a href="#journal" className="editorial-link">
              READ JOURNAL
              <Arrow />
            </a>

          </div>

          <div className="journal-grid">

            <article className="journal-feature">

              <img
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=90"
                alt="Desk journal"
              />

              <span>
                DESK / 08.08.26
              </span>

              <h3>
                The quiet pleasure of a well-used desk.
              </h3>

              <a href="#journal">
                READ STORY →
              </a>

            </article>

            <div className="journal-list">

              <article>
                <span>01</span>

                <div>
                  <small>WRITING</small>

                  <h3>
                    Why we still write by hand.
                  </h3>

                  <a href="#journal">
                    READ →
                  </a>
                </div>
              </article>

              <article>
                <span>02</span>

                <div>
                  <small>DESIGN</small>

                  <h3>
                    The anatomy of a useful notebook.
                  </h3>

                  <a href="#journal">
                    READ →
                  </a>
                </div>
              </article>

              <article>
                <span>03</span>

                <div>
                  <small>STUDIO</small>

                  <h3>
                    Inside our approach to paper.
                  </h3>

                  <a href="#journal">
                    READ →
                  </a>
                </div>
              </article>

            </div>

          </div>

        </section>

        {/* NEWSLETTER */}

        <section className="newsletter">

          <div>

            <p className="small-heading">
              THE LETTER
            </p>

            <h2>
              Occasionally,
              <br />
              something worth reading.
            </h2>

          </div>

          <form>

            <input
              type="email"
              placeholder="EMAIL ADDRESS"
            />

            <button>
              JOIN
              <Arrow />
            </button>

          </form>

        </section>

        {/* FOOTER */}

        <footer className="footer">

          <div className="footer-main">

            <a className="footer-logo" href="/">
              ARTHUR & CO.
            </a>

            <p>
              Objects for everyday life.
              <br />
              Designed in India.
            </p>

          </div>

          <div className="footer-column">

            <h4>SHOP</h4>

            <a href="#shop">Journals</a>
            <a href="#shop">Notebooks</a>
            <a href="#shop">Writing</a>
            <a href="#shop">Desk Objects</a>

          </div>

          <div className="footer-column">

            <h4>ABOUT</h4>

            <a href="#story">Our Story</a>
            <a href="#journal">Journal</a>
            <a href="#story">Materials</a>
            <a href="#story">Contact</a>

          </div>

          <div className="footer-column">

            <h4>FOLLOW</h4>

            <a href="#">Instagram</a>
            <a href="#">Pinterest</a>
            <a href="#">Behance</a>

          </div>

          <div className="footer-bottom">

            <span>
              © 2026 ARTHUR & CO.
            </span>

            <span>
              PRIVACY
            </span>

            <span>
              TERMS
            </span>

            <span>
              INDIA
            </span>

          </div>

        </footer>

      </div>
    </>
  );
}

function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4 12H20"
        stroke="currentColor"
        strokeWidth="1.3"
      />

      <path
        d="M13 5L20 12L13 19"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}