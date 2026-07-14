import Link from "next/link";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.5 8H17V4.2c-.43-.06-1.9-.2-3.65-.2-3.6 0-6.07 2.2-6.07 6.25V13H3.2v4.25h4.08V24h5V17.25h4.12L17.05 13h-4.77v-2.33C12.28 9.44 12.61 8 14.5 8Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.26-8.3L2.98 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.84h1.72L8.44 4.05H6.59L17.8 19.84Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.55 3.58 12 3.58 12 3.58s-7.55 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.85.5 9.4.5 9.4.5s7.55 0 9.4-.5a3 3 0 0 0 2.1-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.25 3.6L9.6 15.6Z" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top-line" />

      <div className="footer-container">
        <div className="footer-column footer-about">
          <p className="footer-eyebrow">THE WORDART STORY</p>

          <h2 className="footer-brand">WORDART</h2>

          <p className="footer-description">
            WordArt is a tribute to timeless stationery, thoughtful
            craftsmanship and modern minimalism. Built around paper goods,
            journals and artistic essentials, the brand blends functionality
            with elegance for creators, writers and thinkers.
          </p>

          <div className="social-icons">
            <a
              href="#"
              aria-label="Facebook"
              title="Facebook"
              target="_blank"
              rel="noreferrer"
            >
              <FacebookIcon />
            </a>

            <a
              href="#"
              aria-label="X"
              title="X"
              target="_blank"
              rel="noreferrer"
            >
              <XIcon />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              title="Instagram"
              target="_blank"
              rel="noreferrer"
            >
              <InstagramIcon />
            </a>

            <a
              href="#"
              aria-label="YouTube"
              title="YouTube"
              target="_blank"
              rel="noreferrer"
            >
              <YouTubeIcon />
            </a>
          </div>
        </div>

        <div className="footer-column footer-statement">
          <span className="footer-number">01</span>

          <div className="footer-statement-content">
            <p>Made for</p>
            <strong>IDEAS WORTH KEEPING.</strong>
          </div>
        </div>

        <div className="footer-column footer-menu">
          <p className="footer-eyebrow">EXPLORE</p>

          <h3>MAIN MENU</h3>

          <ul>
            <li>
              <Link href="/">
                <span>Home</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </li>

            <li>
              <Link href="/about">
                <span>About Us</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </li>

            <li>
              <Link href="/projects">
                <span>Collections</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </li>

            <li>
              <Link href="/shop">
                <span>Shop</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-column footer-note">
          <span className="footer-number">02</span>

          <div className="footer-note-content">
            <p className="footer-eyebrow">OUR PHILOSOPHY</p>

            <p className="footer-quote">
              “The objects around us should be useful, considered and quietly
              beautiful.”
            </p>

            <Link href="/shop" className="footer-shop-link">
              Discover the collection
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-marquee" aria-hidden="true">
        <div className="footer-marquee-track">
          <span>THOUGHTFUL STATIONERY</span>
          <span className="footer-marquee-dot">✦</span>
          <span>TIMELESS DESIGN</span>
          <span className="footer-marquee-dot">✦</span>
          <span>MADE FOR CREATORS</span>
          <span className="footer-marquee-dot">✦</span>
          <span>THOUGHTFUL STATIONERY</span>
          <span className="footer-marquee-dot">✦</span>
          <span>TIMELESS DESIGN</span>
          <span className="footer-marquee-dot">✦</span>
          <span>MADE FOR CREATORS</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} WORDART</p>

        <p>Designed with purpose. Made for expression.</p>

        <button
          type="button"
          className="footer-back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll back to the top"
        >
          BACK TO TOP
          <span aria-hidden="true">↑</span>
        </button>
      </div>
    </footer>
  );
}