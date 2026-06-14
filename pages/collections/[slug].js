import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";

const normalizeAssetPath = (value) => {
  if (!value) return "";
  if (value.startsWith("public/")) return `/${value.slice(7)}`;
  return value;
};

const fmt = (paise) =>
    `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export default function CollectionPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/collections/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setCollection(data.data.collection);
            setProducts(
                data.data.products.map((p) => ({
                  ...p,
                  imageUrl: normalizeAssetPath(p.images?.[0] || ""),
                }))
            );
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
  }, [slug]);

  return (
      <>
        <Head>
          <title>{collection ? `${collection.name} - Word Of Art` : "Collection"}</title>
        </Head>

        <Navbar />

        <div className="collection-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/projects">Collections</Link>
          {collection?.category && (
              <>
                <span>/</span>
                <Link href={`/projects?category=${collection.category.slug}`}>
                  {collection.category.name}
                </Link>
              </>
          )}
          <span>/</span>
          {collection?.name || "Collection"}
        </div>

        <section className="hero">
          <div className="hero-banner">
            <img
                src={normalizeAssetPath(collection?.imageUrl || "")}
                alt={collection?.name || "Collection"}
            />
            <div className="hero-overlay">
              <h1>{collection?.name?.toUpperCase()}</h1>
            </div>
          </div>
        </section>

        {collection?.description && (
            <section className="description">
              <p>{collection.description}</p>
            </section>
        )}

        <section className="products-section">
          <div className="products-container">
            <div className="filter-bar">
              <div className="filter-left">
                <i className="fa-solid fa-grip"></i>
                <i className="fa-solid fa-table-cells-large"></i>
              </div>
              <div className="filter-center">{collection?.name || "ALL"}</div>
              <div className="filter-right">
                <span>SORT</span>
                <span>FILTER</span>
              </div>
            </div>

            <div className="products-grid">
              {loading && <p>Loading products...</p>}

              {!loading && products.length === 0 && (
                  <p>No products found in this collection.</p>
              )}

              {!loading &&
                  products.map((product) => (
                      <Link
                          key={product._id}
                          href={`/collections/${slug}/${product.slug}`}
                          className="product-card"
                      >
                        <div className="product-image">
                          <img src={product.imageUrl} alt={product.name} />
                          <span className="wishlist">
                                            <i className="fa-regular fa-heart"></i>
                                        </span>
                        </div>
                        <div className="product-info">
                          <h3>{product.name}</h3>
                          <p>{fmt(product.price)}</p>
                        </div>
                      </Link>
                  ))}
            </div>
          </div>
        </section>
      </>
  );
}