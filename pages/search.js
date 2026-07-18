import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WishlistButton from "../components/WishlistButton";

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

export default function SearchPage() {
  const router = useRouter();
  const queryFromUrl = typeof router.query.q === "string" ? router.query.q : "";

  const [searchState, setSearchState] = useState({
    query: "",
    products: [],
    error: "",
  });

  const term = queryFromUrl.trim();
  const hasSearched = router.isReady && Boolean(term);
  const stateMatchesQuery = searchState.query === term;
  const products = stateMatchesQuery ? searchState.products : [];
  const error = stateMatchesQuery ? searchState.error : "";
  const loading = hasSearched && !stateMatchesQuery;

  useEffect(() => {
    if (!router.isReady || !term) return undefined;

    const controller = new AbortController();

    async function searchProducts() {
      try {
        const response = await fetch(
          `/api/products?search=${encodeURIComponent(term)}&limit=60`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Could not search products");
        }

        setSearchState({
          query: term,
          products: data.data.products || [],
          error: "",
        });
      } catch (searchError) {
        if (searchError.name !== "AbortError") {
          setSearchState({
            query: term,
            products: [],
            error: searchError.message || "Could not search products",
          });
        }
      }
    }

    searchProducts();
    return () => controller.abort();
  }, [router.isReady, term]);

  const resultLabel = useMemo(() => {
    if (!hasSearched || loading) return "";
    if (products.length === 1) return "1 result";
    return `${products.length} results`;
  }, [hasSearched, loading, products.length]);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const term = String(formData.get("q") || "").trim();

    if (!term) {
      router.push("/search");
      return;
    }

    router.push({ pathname: "/search", query: { q: term } });
  }

  return (
    <>
      <Head>
        <title>{queryFromUrl ? `Search: ${queryFromUrl} - WordArt` : "Search - WordArt"}</title>
        <meta
          name="description"
          content="Search WordArt notebooks, journals, desk objects and stationery."
        />
      </Head>

      <Navbar />

      <main className="search-page">
        <section className="search-hero">
          <p className="search-eyebrow">WORDART COLLECTION</p>
          <h1>Find what you&apos;re looking for.</h1>
          <p className="search-intro">
            Search notebooks, journals, desk objects and everything made for
            ideas worth keeping.
          </p>

          <form className="search-form" onSubmit={handleSubmit} role="search">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <input
              key={queryFromUrl}
              type="search"
              name="q"
              defaultValue={queryFromUrl}
              placeholder="Search products, collections or categories"
              aria-label="Search products"
              autoFocus
            />
            <button type="submit">SEARCH</button>
          </form>

          <div className="quick-searches" aria-label="Suggested searches">
            <span>TRY</span>
            <Link href="/search?q=notebooks">Notebooks</Link>
            <Link href="/search?q=journals">Journals</Link>
            <Link href="/search?q=desk%20objects">Desk Objects</Link>
          </div>
        </section>

        <section className="search-results" aria-live="polite">
          {hasSearched && (
            <div className="results-heading">
              <div>
                <p className="results-kicker">SEARCH RESULTS</p>
                <h2>
                  {queryFromUrl ? `“${queryFromUrl}”` : "Products"}
                </h2>
              </div>
              {!loading && !error && <span>{resultLabel}</span>}
            </div>
          )}

          {loading && (
            <div className="search-state">
              <span className="search-loader" aria-hidden="true" />
              <p>Searching the collection…</p>
            </div>
          )}

          {!loading && error && (
            <div className="search-state search-error">
              <h2>Search unavailable</h2>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && hasSearched && products.length === 0 && (
            <div className="search-state empty-state">
              <p className="empty-mark">NO MATCH</p>
              <h2>Nothing found for “{queryFromUrl}”.</h2>
              <p>Try a shorter phrase, a collection name, or browse the full shop.</p>
              <Link href="/shop">BROWSE ALL PRODUCTS</Link>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="search-grid">
              {products.map((product) => {
                const href = productHref(product);
                const image = normalizeAssetPath(product.images?.[0]);

                return (
                  <article className="search-card" key={product._id}>
                    <div className="search-card-image">
                      <Link href={href} aria-label={`View ${product.name}`}>
                        {image ? (
                          <img src={image} alt={product.name} />
                        ) : (
                          <div className="image-placeholder">WORDART</div>
                        )}
                      </Link>
                      <WishlistButton product={product} />
                    </div>

                    <Link href={href} className="search-card-info">
                      <p className="search-card-category">
                        {product.collection?.name || product.category?.name || "WordArt"}
                      </p>
                      <h3>{product.name}</h3>
                      <p className="search-card-price">{formatPrice(product.price)}</p>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}

          {!hasSearched && (
            <div className="search-prompt">
              <div className="prompt-line" />
              <p>Begin with a product, collection or category name.</p>
              <div className="prompt-line" />
            </div>
          )}
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .search-page {
          min-height: 70vh;
          padding-top: 132px;
          color: #201f1b;
          background: #f4f0ea;
        }

        .search-hero {
          position: relative;
          overflow: hidden;
          padding: 92px 6vw 76px;
          text-align: center;
          background:
            radial-gradient(circle at 15% 0%, rgba(148, 111, 80, 0.12), transparent 34%),
            radial-gradient(circle at 85% 100%, rgba(89, 75, 61, 0.08), transparent 35%),
            #eee8df;
          border-bottom: 1px solid rgba(32, 31, 27, 0.1);
        }

        .search-hero::before,
        .search-hero::after {
          content: "";
          position: absolute;
          width: 260px;
          height: 260px;
          border: 1px solid rgba(32, 31, 27, 0.07);
          border-radius: 50%;
          pointer-events: none;
        }

        .search-hero::before {
          top: -175px;
          left: -70px;
        }

        .search-hero::after {
          right: -90px;
          bottom: -190px;
        }

        .search-eyebrow,
        .results-kicker {
          margin: 0 0 17px;
          color: #8b6751;
          font-family: "Montserrat", sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.24em;
        }

        .search-hero h1 {
          max-width: 850px;
          margin: 0 auto;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.55rem, 5vw, 5.25rem);
          font-weight: 400;
          letter-spacing: -0.045em;
          line-height: 1.02;
        }

        .search-intro {
          max-width: 610px;
          margin: 24px auto 0;
          color: #6d685f;
          font-size: 1rem;
          line-height: 1.75;
        }

        .search-form {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 17px;
          width: min(820px, 100%);
          margin: 42px auto 0;
          padding: 8px 9px 8px 22px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(32, 31, 27, 0.15);
          border-radius: 2px;
          box-shadow: 0 18px 45px rgba(59, 49, 39, 0.08);
        }

        .search-form i {
          color: #8b6751;
          font-size: 1rem;
        }

        .search-form input {
          min-width: 0;
          height: 50px;
          color: #201f1b;
          background: transparent;
          border: 0;
          outline: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 1.02rem;
        }

        .search-form input::placeholder {
          color: #9b958c;
        }

        .search-form button {
          height: 48px;
          padding: 0 31px;
          color: #f7f2ea;
          background: #24231f;
          border: 0;
          cursor: pointer;
          font-family: "Montserrat", sans-serif;
          font-size: 0.67rem;
          font-weight: 600;
          letter-spacing: 0.17em;
          transition: background 180ms ease, transform 180ms ease;
        }

        .search-form button:hover {
          background: #8b6751;
          transform: translateY(-1px);
        }

        .quick-searches {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 10px 18px;
          margin-top: 22px;
          color: #716b62;
          font-family: "Montserrat", sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
        }

        .quick-searches > span {
          color: #a19a90;
          font-size: 0.58rem;
          letter-spacing: 0.2em;
        }

        .quick-searches :global(a) {
          padding-bottom: 3px;
          border-bottom: 1px solid rgba(32, 31, 27, 0.25);
          transition: color 180ms ease, border-color 180ms ease;
        }

        .quick-searches :global(a:hover) {
          color: #8b6751;
          border-color: #8b6751;
        }

        .search-results {
          width: min(1460px, calc(100% - 80px));
          margin: 0 auto;
          padding: 68px 0 100px;
        }

        .results-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 38px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(32, 31, 27, 0.14);
        }

        .results-heading h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(1.8rem, 3vw, 3rem);
          font-weight: 400;
          line-height: 1.1;
        }

        .results-heading > span {
          color: #827b70;
          font-family: "Montserrat", sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .search-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 42px 22px;
        }

        .search-card {
          min-width: 0;
        }

        .search-card-image {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #e7e1d8;
        }

        .search-card-image :global(a) {
          display: block;
          width: 100%;
          height: 100%;
        }

        .search-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 500ms ease;
        }

        .search-card:hover .search-card-image img {
          transform: scale(1.035);
        }

        .image-placeholder {
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          color: #8c8378;
          font-family: "Montserrat", sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.24em;
        }

        .search-card-info {
          display: block;
          padding: 17px 2px 0;
        }

        .search-card-category {
          margin: 0 0 8px;
          overflow: hidden;
          color: #8b6751;
          font-family: "Montserrat", sans-serif;
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .search-card h3 {
          margin: 0;
          font-family: "Montserrat", sans-serif;
          font-size: 0.86rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          line-height: 1.55;
          text-transform: uppercase;
        }

        .search-card-price {
          margin: 9px 0 0;
          color: #676158;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 0.96rem;
        }

        .search-state,
        .search-prompt {
          display: flex;
          min-height: 280px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .search-loader {
          width: 34px;
          height: 34px;
          margin-bottom: 18px;
          border: 1px solid rgba(32, 31, 27, 0.18);
          border-top-color: #8b6751;
          border-radius: 50%;
          animation: search-spin 700ms linear infinite;
        }

        .search-state h2 {
          margin: 0 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 2rem;
          font-weight: 400;
        }

        .search-state p {
          max-width: 520px;
          margin: 0;
          color: #777066;
          line-height: 1.7;
        }

        .empty-mark {
          margin-bottom: 18px !important;
          color: #8b6751 !important;
          font-family: "Montserrat", sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.24em;
        }

        .empty-state :global(a) {
          margin-top: 26px;
          padding-bottom: 7px;
          color: #24231f;
          border-bottom: 1px solid #24231f;
          font-family: "Montserrat", sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.17em;
        }

        .search-prompt {
          flex-direction: row;
          gap: 24px;
          min-height: 190px;
          color: #898278;
          font-style: italic;
        }

        .prompt-line {
          width: min(120px, 16vw);
          height: 1px;
          background: rgba(32, 31, 27, 0.16);
        }

        @keyframes search-spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1100px) {
          .search-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .search-page {
            padding-top: 132px;
          }

          .search-hero {
            padding: 65px 20px 55px;
          }

          .search-intro {
            font-size: 0.9rem;
          }

          .search-form {
            grid-template-columns: auto 1fr;
            gap: 12px;
            padding: 8px 14px 8px 18px;
          }

          .search-form button {
            grid-column: 1 / -1;
            width: 100%;
          }

          .search-results {
            width: calc(100% - 32px);
            padding: 48px 0 75px;
          }

          .results-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 13px;
          }

          .search-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 32px 12px;
          }

          .search-card h3 {
            font-size: 0.72rem;
            letter-spacing: 0.08em;
          }

          .search-card-category {
            font-size: 0.52rem;
          }

          .search-prompt {
            gap: 14px;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 420px) {
          .search-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .search-card-image img,
          .search-form button,
          .quick-searches :global(a) {
            transition: none;
          }

          .search-loader {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
