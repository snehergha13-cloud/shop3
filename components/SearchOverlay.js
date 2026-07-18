import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const normalizeAssetPath = (value) => {
  if (!value) return "";
  if (value.startsWith("public/")) return `/${value.slice(7)}`;
  return value;
};

const formatPrice = (paise) =>
  `₹${(Number(paise || 0) / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const productHref = (product) => {
  if (product.collection?.slug && product.slug) {
    return `/collections/${product.collection.slug}/${product.slug}`;
  }

  return `/products/${product._id}`;
};

const suggestions = ["Notebooks", "Journals", "Desk Objects", "Writing Tools"];

export default function SearchOverlay({ open, onClose }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const requestRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchedTerm, setSearchedTerm] = useState("");

  const closeOverlay = useCallback(() => {
    requestRef.current?.abort();
    setQuery("");
    setResults([]);
    setLoading(false);
    setError("");
    setSearchedTerm("");
    onClose();
  }, [onClose]);

  const term = query.trim();
  const canSearch = term.length >= 2;

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeOverlay();
    };

    const handleRouteChange = () => closeOverlay();

    document.addEventListener("keydown", handleKeyDown);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [closeOverlay, open, router.events]);

  useEffect(() => {
    if (!open || !canSearch) return undefined;

    const controller = new AbortController();
    requestRef.current?.abort();
    requestRef.current = controller;

    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/products?search=${encodeURIComponent(term)}&limit=12`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Could not search products");
        }

        setResults(data.data?.products || []);
        setSearchedTerm(term);
      } catch (searchError) {
        if (searchError.name !== "AbortError") {
          setResults([]);
          setSearchedTerm(term);
          setError(searchError.message || "Could not search products");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 240);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [canSearch, open, term]);

  const statusText = useMemo(() => {
    if (loading) return "Searching the collection…";
    if (!searchedTerm || searchedTerm !== term) return "";
    if (results.length === 1) return "1 product found";
    return `${results.length} products found`;
  }, [loading, results.length, searchedTerm, term]);

  function applySuggestion(value) {
    setQuery(value);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function updateQuery(value) {
    setQuery(value);

    if (value.trim().length < 2) {
      requestRef.current?.abort();
      setResults([]);
      setLoading(false);
      setError("");
      setSearchedTerm("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSearch) inputRef.current?.focus();
  }

  if (!open) return null;

  return (
    <div
      className="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-dialog-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeOverlay();
      }}
    >
      <section className="search-panel">
        <div className="panel-accent" aria-hidden="true" />

        <header className="search-header">
          <div>
            <p className="eyebrow">WORDART SEARCH</p>
            <h2 id="search-dialog-title">Find something worth keeping.</h2>
          </div>

          <button className="close-button" type="button" onClick={closeOverlay} aria-label="Close search">
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <form className="search-box" role="search" onSubmit={handleSubmit}>
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Search notebooks, journals, collections…"
            aria-label="Search products"
            autoComplete="off"
          />

          {query && (
            <button
              className="clear-button"
              type="button"
              onClick={() => {
                updateQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </form>

        <div className="search-content" aria-live="polite">
          {!term && (
            <div className="search-intro">
              <div className="intro-copy">
                <span className="intro-number">01</span>
                <p>
                  Search by product name, collection or category. Results appear
                  here as you type.
                </p>
              </div>

              <div className="suggestions">
                <p>Popular searches</p>
                <div className="suggestion-list">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      {suggestion}
                      <span aria-hidden="true">↗</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {term && !canSearch && (
            <div className="message-state compact-state">
              <span className="state-mark">A–Z</span>
              <p>Type at least two characters to begin searching.</p>
            </div>
          )}

          {loading && (
            <div className="message-state loading-state">
              <span className="loader" aria-hidden="true" />
              <p>Searching the WordArt collection…</p>
            </div>
          )}

          {!loading && error && (
            <div className="message-state">
              <span className="state-mark">!</span>
              <h3>Search is temporarily unavailable.</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && canSearch && searchedTerm === term && results.length === 0 && (
            <div className="message-state">
              <span className="state-mark">0</span>
              <h3>No products found.</h3>
              <p>Try a product type, category, or collection name.</p>
              <Link href="/shop" onClick={closeOverlay}>Browse the full shop</Link>
            </div>
          )}

          {!loading && !error && results.length > 0 && searchedTerm === term && (
            <div className="results-area">
              <div className="results-heading">
                <div>
                  <p>Search results</p>
                  <h3>{statusText}</h3>
                </div>
                <span>“{searchedTerm}”</span>
              </div>

              <div className="results-grid">
                {results.map((product) => {
                  const href = productHref(product);
                  const image = normalizeAssetPath(product.images?.[0]);

                  return (
                    <Link
                      href={href}
                      className="result-card"
                      key={product._id}
                      onClick={closeOverlay}
                    >
                      <div className="result-image">
                        {image ? (
                          <img src={image} alt={product.name} />
                        ) : (
                          <span>WORDART</span>
                        )}
                      </div>

                      <div className="result-copy">
                        <p>{product.collection?.name || product.category?.name || "WordArt"}</p>
                        <h4>{product.name}</h4>
                        <strong>{formatPrice(product.price)}</strong>
                      </div>

                      <span className="result-arrow" aria-hidden="true">↗</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <footer className="search-footer">
          <span>Press Esc to close</span>
          <Link href="/shop" onClick={closeOverlay}>
            Browse all products <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </section>

      <style jsx>{`
        .search-overlay {
          position: fixed;
          inset: 0;
          z-index: 5000;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(18, 17, 15, 0.72);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          animation: overlay-in 180ms ease-out both;
        }

        .search-panel {
          position: relative;
          display: flex;
          flex-direction: column;
          width: min(1080px, 100%);
          max-height: calc(100vh - 40px);
          overflow: hidden;
          color: #211f1b;
          background:
            radial-gradient(circle at 100% 0%, rgba(155, 112, 80, 0.13), transparent 31%),
            #f3efe8;
          border: 1px solid rgba(255, 255, 255, 0.32);
          border-radius: 24px;
          box-shadow: 0 34px 100px rgba(0, 0, 0, 0.38);
          animation: panel-in 230ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .panel-accent {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 5px;
          background: linear-gradient(90deg, #25221e 0 54%, #9c6b4c 54% 100%);
        }

        .search-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 28px;
          padding: 46px 52px 26px;
        }

        .eyebrow {
          margin: 0 0 12px;
          color: #93664b;
          font-family: "Montserrat", Arial, sans-serif;
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.24em;
        }

        .search-header h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2rem, 4vw, 3.65rem);
          font-weight: 400;
          letter-spacing: -0.045em;
          line-height: 1.02;
        }

        .close-button {
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          width: 46px;
          height: 46px;
          color: #211f1b;
          background: rgba(255, 255, 255, 0.58);
          border: 1px solid rgba(33, 31, 27, 0.16);
          border-radius: 50%;
          cursor: pointer;
          transition: transform 180ms ease, background 180ms ease, color 180ms ease;
        }

        .close-button span {
          margin-top: -3px;
          font-family: Arial, sans-serif;
          font-size: 1.85rem;
          font-weight: 300;
          line-height: 1;
        }

        .close-button:hover {
          color: #f3efe8;
          background: #211f1b;
          transform: rotate(7deg);
        }

        .search-box {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 18px;
          margin: 0 52px;
          padding: 0 22px;
          min-height: 72px;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid rgba(33, 31, 27, 0.18);
          border-radius: 12px;
          box-shadow: 0 16px 40px rgba(56, 44, 33, 0.08);
          transition: border-color 180ms ease, box-shadow 180ms ease;
        }

        .search-box:focus-within {
          border-color: rgba(147, 102, 75, 0.68);
          box-shadow: 0 18px 45px rgba(56, 44, 33, 0.12), 0 0 0 3px rgba(147, 102, 75, 0.1);
        }

        .search-box > i {
          color: #93664b;
          font-size: 1.05rem;
        }

        .search-box input {
          min-width: 0;
          width: 100%;
          height: 70px;
          color: #211f1b;
          background: transparent;
          border: 0;
          outline: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(1.05rem, 2vw, 1.42rem);
        }

        .search-box input::placeholder {
          color: #8c867e;
        }

        .search-box input::-webkit-search-cancel-button {
          display: none;
        }

        .clear-button {
          padding: 9px 0 9px 14px;
          color: #777168;
          background: transparent;
          border: 0;
          border-left: 1px solid rgba(33, 31, 27, 0.12);
          cursor: pointer;
          font-family: "Montserrat", Arial, sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .search-content {
          flex: 1;
          min-height: 260px;
          overflow-y: auto;
          padding: 32px 52px 38px;
          scrollbar-color: rgba(33, 31, 27, 0.25) transparent;
          scrollbar-width: thin;
        }

        .search-intro {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 70px;
          align-items: start;
          padding: 10px 0 18px;
        }

        .intro-copy {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 18px;
          padding-right: 45px;
          border-right: 1px solid rgba(33, 31, 27, 0.13);
        }

        .intro-number {
          color: #9a6b4e;
          font-family: "Montserrat", Arial, sans-serif;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .intro-copy p {
          max-width: 360px;
          margin: 0;
          color: #6d675f;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 1.08rem;
          line-height: 1.7;
        }

        .suggestions > p,
        .results-heading > div > p {
          margin: 0 0 14px;
          color: #8a8379;
          font-family: "Montserrat", Arial, sans-serif;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .suggestion-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .suggestion-list button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 52px;
          padding: 0 17px;
          color: #3c3934;
          background: rgba(255, 255, 255, 0.48);
          border: 1px solid rgba(33, 31, 27, 0.12);
          border-radius: 8px;
          cursor: pointer;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 0.94rem;
          text-align: left;
          transition: color 180ms ease, background 180ms ease, transform 180ms ease;
        }

        .suggestion-list button span {
          color: #9a6b4e;
          font-family: Arial, sans-serif;
        }

        .suggestion-list button:hover {
          color: #f5f1e9;
          background: #25221e;
          transform: translateY(-2px);
        }

        .message-state {
          display: grid;
          place-items: center;
          min-height: 240px;
          padding: 24px;
          text-align: center;
        }

        .compact-state {
          min-height: 180px;
        }

        .state-mark {
          display: grid;
          place-items: center;
          width: 56px;
          height: 56px;
          margin-bottom: 18px;
          color: #93664b;
          border: 1px solid rgba(147, 102, 75, 0.35);
          border-radius: 50%;
          font-family: "Montserrat", Arial, sans-serif;
          font-size: 0.67rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .message-state h3 {
          margin: 0 0 8px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 1.55rem;
          font-weight: 400;
        }

        .message-state p {
          max-width: 430px;
          margin: 0;
          color: #777168;
          line-height: 1.65;
        }

        .message-state :global(a) {
          margin-top: 22px;
          padding-bottom: 5px;
          color: #2b2824;
          border-bottom: 1px solid #2b2824;
          font-family: "Montserrat", Arial, sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .loader {
          width: 38px;
          height: 38px;
          margin-bottom: 20px;
          border: 2px solid rgba(33, 31, 27, 0.14);
          border-top-color: #93664b;
          border-radius: 50%;
          animation: spin 680ms linear infinite;
        }

        .results-area {
          padding-bottom: 4px;
        }

        .results-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 22px;
          margin-bottom: 18px;
        }

        .results-heading h3 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 1.45rem;
          font-weight: 400;
        }

        .results-heading > span {
          max-width: 45%;
          overflow: hidden;
          color: #8a8379;
          font-family: Georgia, "Times New Roman", serif;
          font-style: italic;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .result-card {
          position: relative;
          display: grid;
          grid-template-columns: 100px minmax(0, 1fr) auto;
          align-items: center;
          gap: 18px;
          min-height: 122px;
          padding: 10px 18px 10px 10px;
          color: #211f1b;
          background: rgba(255, 255, 255, 0.62);
          border: 1px solid rgba(33, 31, 27, 0.1);
          border-radius: 10px;
          transition: transform 190ms ease, background 190ms ease, box-shadow 190ms ease;
        }

        .result-card:hover {
          background: #fffdf9;
          box-shadow: 0 13px 30px rgba(51, 42, 34, 0.1);
          transform: translateY(-3px);
        }

        .result-image {
          display: grid;
          place-items: center;
          width: 100px;
          height: 100px;
          overflow: hidden;
          color: #8d867d;
          background: #e7e1d8;
          border-radius: 7px;
          font-family: "Montserrat", Arial, sans-serif;
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.13em;
        }

        .result-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 260ms ease;
        }

        .result-card:hover .result-image img {
          transform: scale(1.045);
        }

        .result-copy {
          min-width: 0;
        }

        .result-copy p {
          margin: 0 0 7px;
          overflow: hidden;
          color: #93664b;
          font-family: "Montserrat", Arial, sans-serif;
          font-size: 0.57rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .result-copy h4 {
          margin: 0 0 11px;
          overflow: hidden;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 1.03rem;
          font-weight: 400;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .result-copy strong {
          font-family: "Montserrat", Arial, sans-serif;
          font-size: 0.76rem;
          font-weight: 600;
        }

        .result-arrow {
          color: #9a6b4e;
          font-family: Arial, sans-serif;
          font-size: 0.82rem;
          transition: transform 180ms ease;
        }

        .result-card:hover .result-arrow {
          transform: translate(2px, -2px);
        }

        .search-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          min-height: 66px;
          padding: 0 52px;
          color: #817a71;
          background: rgba(225, 218, 207, 0.58);
          border-top: 1px solid rgba(33, 31, 27, 0.1);
          font-family: "Montserrat", Arial, sans-serif;
          font-size: 0.61rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .search-footer :global(a) {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          color: #2d2a25;
          transition: gap 180ms ease, color 180ms ease;
        }

        .search-footer :global(a:hover) {
          gap: 16px;
          color: #93664b;
        }

        @keyframes overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes panel-in {
          from { opacity: 0; transform: translateY(18px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 760px) {
          .search-overlay {
            align-items: end;
            padding: 0;
          }

          .search-panel {
            width: 100%;
            max-height: 94dvh;
            border-right: 0;
            border-bottom: 0;
            border-left: 0;
            border-radius: 22px 22px 0 0;
          }

          .search-header {
            padding: 34px 22px 20px;
          }

          .search-header h2 {
            max-width: 270px;
            font-size: 2.15rem;
          }

          .close-button {
            width: 42px;
            height: 42px;
          }

          .search-box {
            margin: 0 20px;
            min-height: 62px;
            padding: 0 17px;
          }

          .search-box input {
            height: 60px;
            font-size: 1rem;
          }

          .search-content {
            min-height: 250px;
            padding: 26px 20px 30px;
          }

          .search-intro {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .intro-copy {
            padding: 0 0 28px;
            border-right: 0;
            border-bottom: 1px solid rgba(33, 31, 27, 0.13);
          }

          .suggestion-list {
            grid-template-columns: 1fr 1fr;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }

          .result-card {
            grid-template-columns: 82px minmax(0, 1fr) auto;
            min-height: 102px;
          }

          .result-image {
            width: 82px;
            height: 82px;
          }

          .search-footer {
            min-height: 60px;
            padding: 0 20px;
          }

          .search-footer > span {
            display: none;
          }

          .search-footer :global(a) {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 430px) {
          .suggestion-list {
            grid-template-columns: 1fr;
          }

          .search-header h2 {
            font-size: 1.95rem;
          }

          .result-copy h4 {
            font-size: 0.95rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .search-overlay,
          .search-panel,
          .loader,
          .close-button,
          .suggestion-list button,
          .result-card,
          .result-image img,
          .result-arrow,
          .search-footer :global(a) {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
