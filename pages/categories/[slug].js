import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [category, setCategory] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    Promise.all([
      fetch("/api/categories").then((res) => res.json()),
      fetch(`/api/collections?category=${slug}`).then((res) => res.json()),
    ])
      .then(([categoryData, collectionData]) => {
        if (categoryData.success) {
          setCategory(categoryData.data.find((item) => item.slug === slug));
        }
        if (collectionData.success) setCollections(collectionData.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <>
      <Head>
        <title>
          {category ? `${category.name} Collections` : "Collections"} - Word Of
          Art
        </title>
      </Head>

      <Navbar />

      <section className="hero">
        <div className="hero-banner">
          <img
            src={category?.imageUrl || "https://picsum.photos/1600/700?random=2"}
            alt={category?.name || "Collections"}
          />

          <div className="hero-overlay">
            <h1>{category?.name || "COLLECTIONS"}</h1>
          </div>
        </div>
      </section>

      <section className="description">
        <p>
          {category?.description ||
            "Choose a collection to browse the products and styles inside it."}
        </p>
      </section>

      <section className="products-section">
        <div className="products-container">
          <div className="filter-bar">
            <div className="filter-left">
              <i className="fa-solid fa-grip"></i>
              <i className="fa-solid fa-table-cells-large"></i>
            </div>

            <div className="filter-center">
              HOME - {category?.name?.toUpperCase() || "COLLECTIONS"}
            </div>

            <div className="filter-right">
              <span>SORT</span>
              <span>FILTER</span>
            </div>
          </div>

          <div className="products-grid">
            {loading && <p>Loading collections...</p>}

            {!loading && collections.length === 0 && (
              <p>No collections found for this category.</p>
            )}

            {collections.map((collection, index) => (
              <Link
                key={collection._id}
                href={`/collections/${collection.slug}`}
                className="product-card"
              >
                <div className="product-image">
                  <img
                    src={
                      collection.imageUrl ||
                      `https://picsum.photos/600?random=${index + 51}`
                    }
                    alt={collection.name}
                  />
                </div>

                <div className="product-info">
                  <h3>{collection.name}</h3>
                  <p>{collection.description || "View products"}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
