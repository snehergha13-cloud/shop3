import Link from "next/link";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.4" cy="6.7" r="1" className="fill-icon" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        className="fill-icon"
        d="M13.75 21v-8.05h2.72l.41-3.14h-3.13V7.8c0-.91.25-1.53 1.57-1.53H17V3.45c-.29-.04-1.28-.12-2.46-.12-2.44 0-4.12 1.5-4.12 4.25v2.23H7.65v3.14h2.77V21h3.33Z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        className="fill-icon"
        d="M18.4 3H22l-7.85 8.95L23.38 21h-7.23l-5.66-7.4L4 21H.4l8.4-9.6L0 3h7.42l5.12 6.77L18.4 3Zm-1.27 16.42h2L6.33 4.5H4.18l12.95 14.92Z"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        className="fill-icon"
        d="M21.58 7.19a2.76 2.76 0 0 0-1.94-1.95C17.93 4.78 12 4.78 12 4.78s-5.93 0-7.64.46a2.76 2.76 0 0 0-1.94 1.95A28.63 28.63 0 0 0 2 12a28.63 28.63 0 0 0 .42 4.81 2.76 2.76 0 0 0 1.94 1.95c1.71.46 7.64.46 7.64.46s5.93 0 7.64-.46a2.76 2.76 0 0 0 1.94-1.95A28.63 28.63 0 0 0 22 12a28.63 28.63 0 0 0-.42-4.81ZM10 15.13V8.87L15.45 12 10 15.13Z"
      />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-glow footer-glow-left" />
        <div className="footer-glow footer-glow-right" />

        <div className="footer-main">
          <section className="brand-section">
            <Link href="/" className="brand-logo">
              WORDART
            </Link>

            <p className="brand-statement">
              Thoughtful stationery for ideas worth keeping.
            </p>

            <p className="brand-description">
              WordArt is a tribute to timeless stationery, thoughtful
              craftsmanship and modern minimalism. Built around paper goods,
              journals and artistic essentials, the brand blends functionality
              with elegance for creators, writers and thinkers.
            </p>

            <div className="social-icons">
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
                aria-label="YouTube"
                title="YouTube"
                target="_blank"
                rel="noreferrer"
              >
                <YouTubeIcon />
              </a>
            </div>
          </section>

          <section className="links-grid">
            <div className="footer-column">
              <p className="column-label">Explore</p>

              <div className="footer-links">
                <Link href="/">Home</Link>
                <Link href="/shop">Shop</Link>
                <Link href="/projects">Collections</Link>
                <Link href="/about">About Us</Link>
              </div>
            </div>

            <div className="footer-column">
              <p className="column-label">Customer</p>

              <div className="footer-links">
                <Link href="/account">My Account</Link>
                <Link href="/account#orders">Track Order</Link>
                <Link href="/cart">Shopping Bag</Link>
                <Link href="/contact">Contact Us</Link>
              </div>
            </div>

            <div className="footer-column editorial-column">
              <p className="column-label">Our Philosophy</p>

              <p className="editorial-text">
                Made for morning thoughts, unfinished sketches, careful plans
                and pages that quietly become part of your life.
              </p>

              <Link href="/shop" className="shop-link">
                Explore the collection
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        </div>

        <div className="footer-signature">
          <span>Designed for expression</span>
          <span className="signature-mark">✦</span>
          <span>Made with purpose</span>
          <span className="signature-mark">✦</span>
          <span>WordArt stationery</span>
        </div>

        <div className="footer-bottom">
          <p>© {year} WORDART</p>

          <p className="made-in">Designed with purpose. Made in India.</p>

          <button type="button" onClick={scrollToTop}>
            Back to top
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </footer>

      <style jsx>{`
        .footer {
          --background: #1d1c19;
          --surface: #24231f;
          --text: #f3efe7;
          --muted: #aaa59a;
          --line: rgba(243, 239, 231, 0.14);
          --accent: #b78364;
          --cream: #dcd4c6;

          position: relative;
          width: 100%;
          overflow: hidden;
          color: var(--text);
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.015),
              transparent 40%
            ),
            var(--background);
          border-top: 1px solid rgba(0, 0, 0, 0.16);
          isolation: isolate;
          font-family: Arial, Helvetica, sans-serif;
        }

        .footer-glow {
          position: absolute;
          z-index: -1;
          border-radius: 50%;
          filter: blur(1px);
          pointer-events: none;
        }

        .footer-glow-left {
          top: -250px;
          left: -230px;
          width: 520px;
          height: 520px;
          background: radial-gradient(
            circle,
            rgba(183, 131, 100, 0.12),
            transparent 68%
          );
        }

        .footer-glow-right {
          right: -220px;
          bottom: -270px;
          width: 570px;
          height: 570px;
          background: radial-gradient(
            circle,
            rgba(220, 212, 198, 0.07),
            transparent 68%
          );
        }

        .footer-main {
          display: grid;
          grid-template-columns: minmax(320px, 0.95fr) minmax(520px, 1.25fr);
          gap: clamp(70px, 9vw, 150px);
          width: min(1440px, calc(100% - 120px));
          margin: 0 auto;
          padding: 98px 0 86px;
        }

        .brand-section {
          max-width: 520px;
        }

        .brand-logo {
          display: inline-block;
          margin-bottom: 32px;
          color: var(--text);
          font-family: Arial, Helvetica, sans-serif;
          font-size: clamp(3.2rem, 5vw, 5.6rem);
          font-style: italic;
          font-weight: 800;
          letter-spacing: -0.085em;
          line-height: 0.82;
          text-decoration: none;
          transition:
            color 180ms ease,
            transform 180ms ease;
        }

        .brand-logo:hover {
          color: var(--cream);
          transform: translateX(3px);
        }

        .brand-statement {
          max-width: 460px;
          margin: 0 0 20px;
          color: var(--text);
          font-family: Arial, Helvetica, sans-serif;
          font-size: clamp(1.35rem, 1.8vw, 1.9rem);
          font-weight: 500;
          letter-spacing: -0.025em;
          line-height: 1.4;
        }

        .brand-description {
          max-width: 500px;
          margin: 0;
          color: var(--muted);
          font-size: 0.92rem;
          line-height: 1.85;
        }

        .social-icons {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-top: 38px;
        }

        .social-icons a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          color: var(--text);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--line);
          border-radius: 50%;
          transition:
            color 180ms ease,
            background 180ms ease,
            border-color 180ms ease,
            transform 180ms ease;
        }

        .social-icons a:hover {
          color: #1d1c19;
          background: var(--cream);
          border-color: var(--cream);
          transform: translateY(-4px);
        }

        .social-icons :global(svg) {
          width: 17px;
          height: 17px;
          overflow: visible;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .social-icons :global(.fill-icon) {
          fill: currentColor;
          stroke: none;
        }

        .links-grid {
          display: grid;
          grid-template-columns: 0.72fr 0.9fr 1.45fr;
          gap: clamp(38px, 5vw, 75px);
        }

        .footer-column {
          min-width: 0;
        }

        .column-label {
          margin: 0 0 28px;
          color: var(--text);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          line-height: 1.4;
          text-transform: uppercase;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 17px;
        }

        .footer-links :global(a) {
          position: relative;
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.4;
          text-decoration: none;
          transition:
            color 180ms ease,
            transform 180ms ease;
        }

        .footer-links :global(a::after) {
          content: "";
          position: absolute;
          right: 0;
          bottom: -4px;
          left: 0;
          height: 1px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 220ms ease;
        }

        .footer-links :global(a:hover) {
          color: var(--text);
          transform: translateX(4px);
        }

        .footer-links :global(a:hover::after) {
          transform: scaleX(1);
          transform-origin: left;
        }

        .editorial-column {
          padding-left: clamp(28px, 3.5vw, 55px);
          border-left: 1px solid var(--line);
        }

        .editorial-text {
          max-width: 330px;
          margin: 0;
          color: var(--cream);
          font-family: Arial, Helvetica, sans-serif;
          font-size: clamp(1.12rem, 1.45vw, 1.48rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.65;
        }

        .shop-link {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin-top: 34px;
          padding-bottom: 8px;
          color: var(--text);
          border-bottom: 1px solid rgba(243, 239, 231, 0.55);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-decoration: none;
          text-transform: uppercase;
          transition:
            color 180ms ease,
            border-color 180ms ease,
            gap 180ms ease;
        }

        .shop-link:hover {
          gap: 21px;
          color: var(--accent);
          border-color: var(--accent);
        }

        .footer-signature {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
          min-height: 58px;
          padding: 12px 30px;
          overflow: hidden;
          color: #27241f;
          background: var(--cream);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.19em;
          text-align: center;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .signature-mark {
          color: var(--accent);
          font-size: 0.83rem;
        }

        .footer-bottom {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 30px;
          width: min(1440px, calc(100% - 120px));
          min-height: 90px;
          margin: 0 auto;
        }

        .footer-bottom p {
          margin: 0;
          color: var(--muted);
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .made-in {
          text-align: center;
        }

        .footer-bottom button {
          display: inline-flex;
          align-items: center;
          justify-self: end;
          gap: 10px;
          padding: 10px 0;
          color: var(--muted);
          background: transparent;
          border: 0;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition:
            color 180ms ease,
            gap 180ms ease;
        }

        .footer-bottom button:hover {
          gap: 15px;
          color: var(--text);
        }

        @media (max-width: 1100px) {
          .footer-main {
            grid-template-columns: 1fr;
            gap: 72px;
            width: calc(100% - 64px);
          }

          .brand-section {
            max-width: 700px;
          }

          .links-grid {
            grid-template-columns: 0.8fr 0.9fr 1.35fr;
          }

          .footer-bottom {
            width: calc(100% - 64px);
          }
        }

        @media (max-width: 720px) {
          .footer-main {
            gap: 58px;
            width: calc(100% - 40px);
            padding: 70px 0 58px;
          }

          .brand-logo {
            margin-bottom: 27px;
            font-size: 3.7rem;
          }

          .brand-statement {
            font-size: 1.32rem;
          }

          .brand-description {
            font-size: 0.87rem;
          }

          .links-grid {
            grid-template-columns: 1fr 1fr;
            gap: 48px 30px;
          }

          .editorial-column {
            grid-column: 1 / -1;
            padding: 38px 0 0;
            border-top: 1px solid var(--line);
            border-left: 0;
          }

          .editorial-text {
            max-width: 100%;
          }

          .footer-signature {
            justify-content: flex-start;
            gap: 20px;
            overflow-x: auto;
            padding: 18px 20px;
            scrollbar-width: none;
          }

          .footer-signature::-webkit-scrollbar {
            display: none;
          }

          .footer-bottom {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 13px;
            width: calc(100% - 40px);
            padding: 28px 0 32px;
          }

          .made-in {
            text-align: left;
          }

          .footer-bottom button {
            justify-self: auto;
            margin-top: 5px;
          }
        }

        @media (max-width: 430px) {
          .links-grid {
            grid-template-columns: 1fr;
          }

          .editorial-column {
            grid-column: auto;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .brand-logo,
          .social-icons a,
          .footer-links :global(a),
          .footer-links :global(a::after),
          .shop-link,
          .footer-bottom button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}