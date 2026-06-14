import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";

export default function ProductsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/collections")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setCollections(data.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
  }, []);

  return (
      <>
        <Head>
          <title>Collections - Word Of Art</title>
        </Head>

        <Navbar />

        <main style={styles.page}>
          <h1 style={styles.title}>Collections</h1>

          {loading ? (
              <p>Loading collections...</p>
          ) : (
              <div style={styles.grid}>
                {collections.map((collection, index) => (
                    <Link
                        key={collection._id}
                        href={`/collections/${collection.slug}`}
                        style={styles.card}
                    >
                      <div style={styles.imageWrap}>
                        <img
                            src={
                                collection.imageUrl ||
                                `https://picsum.photos/600?random=${index + 71}`
                            }
                            alt={collection.name}
                            style={styles.image}
                        />
                      </div>
                      <div style={styles.meta}>
                        <h2 style={styles.name}>{collection.name}</h2>
                        <p style={{ ...styles.desc, whiteSpace: "pre-line" }}>
                          {collection.description || collection.category?.name || "View products"}
                        </p>
                      </div>
                    </Link>
                ))}
              </div>
          )}
        </main>
      </>
  );
}

const styles = {
  page: {
    padding: "170px 32px 60px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  title: {
    marginBottom: "24px",
    fontSize: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
  },
  card: {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    border: "1px solid #eee",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#fff",
  },
  imageWrap: {
    aspectRatio: "1 / 1.1",
    overflow: "hidden",
    background: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  meta: {
    padding: "16px",
  },
  name: {
    margin: "0 0 8px",
    fontSize: "1.05rem",
  },
  desc: {
    margin: 0,
    color: "#666",
    fontSize: "0.95rem",
    lineHeight: 1.5,
  },
};