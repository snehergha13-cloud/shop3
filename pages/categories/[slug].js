import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const normalizeAssetPath = (value) => {
    if (!value) return "";
    if (value.startsWith("public/")) return `/${value.slice(7)}`;
    return value;
};
const collectionHref = (collection) => {
    const slug = String(collection?.slug || "").toLowerCase();
    const name = String(collection?.name || "").trim().toLowerCase();

    if (["dsk-obj", "desk-objects", "desk_obj"].includes(slug) || name === "desk objects") {
        return "/collections/dsk-obj";
    }

    return `/collections/${collection.slug}`;
};


export default function CategoryPage() {
    const router = useRouter();
    const { slug } = router.query;
    const [category, setCategory] = useState(null);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;

        Promise.all([
            fetch("/api/categories").then((r) => r.json()),
            fetch(`/api/collections?category=${slug}`).then((r) => r.json()),
        ])
            .then(([categoryData, collectionData]) => {
                const found = categoryData.success
                    ? categoryData.data.find((item) => item.slug === slug)
                    : null;

                if (!found) {
                    setNotFound(true);
                    return;
                }

                setCategory(found);

                if (collectionData.success) {
                    setCollections(
                        collectionData.data.map((c) => ({
                            ...c,
                            imageUrl: normalizeAssetPath(c.imageUrl),
                        }))
                    );
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [slug]);

    // Redirect to coming-soon for categories not in DB
    useEffect(() => {
        if (notFound && slug) {
            router.replace(`/categories/coming-soon?slug=${slug}`);
        }
    }, [notFound, router, slug]);

    return (
        <>
            <Head>
                <title>
                    {category ? `${category.name} Collections` : "Collections"} — Word Of Art
                </title>
            </Head>

            <Navbar />

            <section className={`hero${slug === "desk-objects" ? " desk-objects-hero" : ""}`}>
                <div className="hero-banner">
                    <img
                        src={normalizeAssetPath(category?.imageUrl || "")}
                        alt={category?.name || "Collections"}
                    />
                    <div className="hero-overlay">
                        <h1>{category?.name?.toUpperCase() || "COLLECTIONS"}</h1>
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
                            HOME — {category?.name?.toUpperCase() || "COLLECTIONS"}
                        </div>
                        <div className="filter-right">
                            <span>SORT</span>
                            <span>FILTER</span>
                        </div>
                    </div>

                    <div className="products-grid">
                        {loading && <p>Loading collections...</p>}

                        {!loading && collections.length === 0 && !notFound && (
                            <p>No collections found for this category.</p>
                        )}

                        {collections.map((collection) => (
                            <Link
                                key={collection._id}
                                href={collectionHref(collection)}
                                className="product-card"
                            >
                                <div className="product-image">
                                    <img src={collection.imageUrl} alt={collection.name} />
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

            <Footer />
        </>
    );
}