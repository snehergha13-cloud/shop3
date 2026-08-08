import Head from "next/head";
import { useEffect, useState } from "react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=2200&q=90",
    eyebrow: "THE NOTEBOOK STUDY / 01",
    title: "Things worth\nwriting down.",
    description:
      "Paper goods for ideas, lists, letters and everything that happens between them.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=2200&q=90",
    eyebrow: "THE WRITING STUDY / 02",
    title: "Make a little\nroom for thought.",
    description:
      "Quiet, considered stationery made for slow mornings and busy desks.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=2200&q=90",
    eyebrow: "THE DESK STUDY / 03",
    title: "A desk,\nproperly kept.",
    description:
      "Objects designed to make everyday work feel a little more intentional.",
  },
];

const products = [
  {
    name: "The Everyday Journal",
    category: "JOURNAL / 160 PAGES",
    price: "₹695",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1100&q=90",
  },
  {
    name: "No. 04 Field Notes",
    category: "POCKET NOTEBOOK / PLAIN",
    price: "₹395",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1100&q=90",
  },
  {
    name: "Correspondence",
    category: "WRITING SET / 12 SHEETS",
    price: "₹545",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1100&q=90",
  },
];

const collections = [
  {
    number: "01",
    title: "Paper",
    subtitle: "Journals, notes & correspondence",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1500&q=90",
  },
  {
    number: "02",
    title: "Writing",
    subtitle: "Pens, pencils & little tools",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1500&q=90",
  },
  {
    number: "03",
    title: "Desk",
    subtitle: "Objects for the working table",
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1500&q=90",
  },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>FORM & FOLD — Stationery for Everyday Ideas</title>
        <meta
          name="description"
          content="Elegant stationery and paper objects designed for everyday use."
        />
      </Head>

      <main className="home">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="site-header">

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
          </button>

          <nav className={`navigation ${menuOpen ? "open" : ""}`}>
            <a href="#shop">SHOP</a>
            <a href="#collections">COLLECTIONS</a>
            <a href="#about">ABOUT</a>
            <a href="#journal">JOURNAL</a>
          </nav>

          <a href="/" className="brand-mark">
            <span>FORM</span>
            <b>&</b>
            <span>FOLD</span>
          </a>

          <div className="header-actions">
            <a href="#search">SEARCH</a>
            <a href="#account">ACCOUNT</a>
            <a href="#bag">
              BAG <sup>0</sup>
            </a>
          </div>

        </header>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="hero">

          <div className="hero-image-wrap">

            {slides.map((slide, index) => (
              <div
                key={slide.title}
                className={`hero-image ${
                  active === index ? "active" : ""
                }`}
                style={{
                  backgroundImage: `url("${slide.image}")`,
                }}
              />
            ))}

          </div>

          <div className="hero-tint" />

          <div className="hero-yellow-mark">
            <span>FF</span>
          </div>

          <div className="hero-content">

            <div className="hero-eyebrow">
              {slides[active].eyebrow}
            </div>

            <h1>
              {slides[active].title}
            </h1>

            <p>
              {slides[active].description}
            </p>

            <a href="#shop" className="yellow-button">
              SHOP THE COLLECTION
              <Arrow />
            </a>

          </div>

          <div className="hero-bottom">

            <div className="slide-counter">
              <strong>
                0{active + 1}
              </strong>

              <span />

              <small>
                0{slides.length}
              </small>
            </div>

            <div className="slide-lines">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={index === active ? "active" : ""}
                />
              ))}
            </div>

            <div className="scroll-note">
              SCROLL TO EXPLORE ↓
            </div>

          </div>

        </section>

        {/* =====================================================
            INTRO
        ===================================================== */}

        <section className="intro" id="about">

          <div className="intro-number">
            001
          </div>

          <div className="intro-main">

            <div className="label">
              A SMALL NOTE
            </div>

            <h2>
              Stationery should
              <br />
              <i>invite</i> you to use it.
            </h2>

            <p>
              We make things for the moments that rarely make
              it into photographs — the morning list, the
              half-finished thought, the letter you actually
              decided to send.
            </p>

            <a href="#story" className="text-link">
              MORE ABOUT FORM & FOLD
              <Arrow />
            </a>

          </div>

          <div className="intro-side">

            <div className="vertical-text">
              EST. 2026 / INDIA
            </div>

            <div className="intro-image">
              <img
                src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=90"
                alt="Stationery on a desk"
              />

              <span>
                IMAGE / 001
              </span>
            </div>

          </div>

        </section>

        {/* =====================================================
            COLLECTIONS
        ===================================================== */}

        <section className="collections" id="collections">

          <div className="section-heading">

            <div>
              <span className="section-number">
                002
              </span>

              <div className="label">
                THE COLLECTION
              </div>

              <h2>
                Made in
                <i> three parts.</i>
              </h2>
            </div>

            <p>
              Paper, writing and the objects that
              make a desk feel like your own.
            </p>

          </div>

          <div className="collection-list">

            {collections.map((collection, index) => (
              <a
                href="#shop"
                className={`collection-item item-${index + 1}`}
                key={collection.title}
              >

                <div className="collection-image">
                  <img
                    src={collection.image}
                    alt={collection.title}
                  />
                </div>

                <div className="collection-details">

                  <span>
                    {collection.number}
                  </span>

                  <div>
                    <h3>
                      {collection.title}
                    </h3>

                    <p>
                      {collection.subtitle}
                    </p>
                  </div>

                  <Arrow />

                </div>

              </a>
            ))}

          </div>

        </section>

        {/* =====================================================
            PRODUCT EDIT
        ===================================================== */}

        <section className="product-edit" id="shop">

          <div className="product-edit-heading">

            <div>
              <span className="section-number">
                003
              </span>

              <div className="label">
                CURRENT EDIT
              </div>

              <h2>
                Objects we
                <br />
                <i>keep close.</i>
              </h2>
            </div>

            <a href="#shop" className="text-link">
              VIEW ALL OBJECTS
              <Arrow />
            </a>

          </div>

          <div className="product-grid">

            {products.map((product, index) => (
              <article
                className={`product-card card-${index + 1}`}
                key={product.name}
              >

                <div className="product-photo">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <span className="product-number">
                    0{index + 1}
                  </span>

                  <button className="quick-add">
                    ADD TO BAG
                  </button>

                </div>

                <div className="product-meta">

                  <div>
                    <span>
                      {product.category}
                    </span>

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

        {/* =====================================================
            STATEMENT
        ===================================================== */}

        <section className="statement">

          <div className="statement-image">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=90"
              alt="Creative workspace"
            />
          </div>

          <div className="statement-copy">

            <span className="section-number">
              004
            </span>

            <div className="label">
              THE DESK
            </div>

            <h2>
              Keep only
              <br />
              <i>good things</i>
              <br />
              nearby.
            </h2>

            <p>
              There is something satisfying about a desk
              where everything has its place. A notebook.
              A good pen. A small object you don't really
              need but enjoy having around.
            </p>

            <a href="#shop" className="yellow-button">
              EXPLORE THE DESK
              <Arrow />
            </a>

          </div>

        </section>

        {/* =====================================================
            CRAFT / MATERIAL
        ===================================================== */}

        <section className="material">

          <div className="material-left">

            <span className="section-number">
              005
            </span>

            <div className="label">
              MATERIAL & FORM
            </div>

            <h2>
              Less noise.
              <br />
              <i>More object.</i>
            </h2>

          </div>

          <div className="material-right">

            <div className="material-text">
              <p>
                We care about the weight of paper, the
                sound of a pencil against it, the way a
                cover feels when you pick it up.
              </p>

              <p>
                Small details are where an object gets
                its personality.
              </p>
            </div>

            <div className="material-list">

              <div>
                <span>01</span>
                <strong>GOOD PAPER</strong>
                <p>Selected for feel, weight and longevity.</p>
              </div>

              <div>
                <span>02</span>
                <strong>QUIET COLOUR</strong>
                <p>A palette inspired by paper, earth and ink.</p>
              </div>

              <div>
                <span>03</span>
                <strong>USEFUL FORM</strong>
                <p>Nothing decorative without a reason.</p>
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            JOURNAL
        ===================================================== */}

        <section className="journal" id="journal">

          <div className="journal-top">

            <div>
              <span className="section-number">
                006
              </span>

              <div className="label">
                FIELD NOTES
              </div>

              <h2>
                From the
                <br />
                <i>journal.</i>
              </h2>
            </div>

            <a href="#journal" className="text-link">
              ALL STORIES
              <Arrow />
            </a>

          </div>

          <div className="journal-grid">

            <article className="journal-main">

              <div className="journal-photo">
                <img
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1800&q=90"
                  alt="Desk journal"
                />

                <span>
                  08 / 08 / 26
                </span>
              </div>

              <div className="journal-content">

                <span>
                  DESK CULTURE
                </span>

                <h3>
                  On making a desk
                  <br />
                  worth sitting at.
                </h3>

                <a href="#journal">
                  READ STORY
                  <Arrow />
                </a>

              </div>

            </article>

            <div className="journal-side">

              <article>
                <span>01</span>

                <div>
                  <small>WRITING</small>

                  <h3>
                    Why handwriting
                    still matters.
                  </h3>

                  <a href="#journal">
                    READ →
                  </a>
                </div>
              </article>

              <article>
                <span>02</span>

                <div>
                  <small>OBJECTS</small>

                  <h3>
                    The anatomy of
                    a useful notebook.
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
                    Why we like
                    imperfect things.
                  </h3>

                  <a href="#journal">
                    READ →
                  </a>
                </div>
              </article>

            </div>

          </div>

        </section>

        {/* =====================================================
            NEWSLETTER
        ===================================================== */}

        <section className="newsletter">

          <div className="newsletter-mark">
            FF
          </div>

          <div>

            <div className="label">
              THE LETTER
            </div>

            <h2>
              A few good
              <br />
              things,
              <i> occasionally.</i>
            </h2>

          </div>

          <form>

            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
            />

            <button>
              JOIN
              <Arrow />
            </button>

          </form>

        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="footer">

          <div className="footer-brand">

            <div className="footer-logo">
              FORM
              <span>&</span>
              FOLD
            </div>

            <p>
              Elegant stationery for
              <br />
              everyday ideas.
            </p>

            <small>
              DESIGNED IN INDIA
            </small>

          </div>

          <div className="footer-links">

            <div>
              <h4>SHOP</h4>
              <a href="#shop">Journals</a>
              <a href="#shop">Notebooks</a>
              <a href="#shop">Writing</a>
              <a href="#shop">Desk</a>
            </div>

            <div>
              <h4>ABOUT</h4>
              <a href="#about">Our Story</a>
              <a href="#about">Materials</a>
              <a href="#journal">Journal</a>
              <a href="#about">Contact</a>
            </div>

            <div>
              <h4>FOLLOW</h4>
              <a href="#">Instagram</a>
              <a href="#">Pinterest</a>
              <a href="#">Behance</a>
            </div>

          </div>

          <div className="footer-bottom">
            <span>© 2026 FORM & FOLD</span>
            <span>PRIVACY</span>
            <span>TERMS</span>
            <span>INDIA</span>
          </div>

        </footer>

      </main>
    </>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
    >
      <path
        d="M3 12H20"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M13 5L20 12L13 19"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}