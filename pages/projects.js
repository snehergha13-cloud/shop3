import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const normalizeAssetPath = (value) => {
    if (!value) return "";
    if (value.startsWith("public/")) return `/${value.slice(7)}`;
    return value;
};

export default function Collections() {
    const [collections, setCollections] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const currentCategory = router.query.category || null;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const collectionsRes = await fetch(
                    currentCategory
                        ? `/api/collections?category=${currentCategory}`
                        : "/api/collections"
                );

                const categoriesRes = await fetch("/api/categories");

                const collectionsJson = await collectionsRes.json();
                const categoriesJson = await categoriesRes.json();

                setCollections(
                    collectionsJson.success
                        ? collectionsJson.data.map((item) => ({
                            ...item,
                            imageUrl: normalizeAssetPath(item.imageUrl),
                        }))
                        : []
                );

                setCategories(
                    categoriesJson.success
                        ? categoriesJson.data.map((item) => ({
                            ...item,
                            imageUrl: normalizeAssetPath(item.imageUrl),
                        }))
                        : []
                );
            } catch (err) {
                console.error(err);
                setCollections([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentCategory]);

    return (
        <>
            <Head>
                <title>Collections - Word Of Art</title>
            </Head>

            <Navbar />

            <section className="hero">
                <div className="hero-banner">
                    <img src="/assets/home/slide-11.jpg" alt="Collections" />
                    <div className="hero-overlay">
                        <h1>COLLECTIONS</h1>
                    </div>
                </div>
            </section>

            <section className="description">
                <p>
                    Designed to revive the desire for writing, our handcrafted stationery
                    collection combines aesthetics, utility and timeless design
                    philosophy.
                </p>
            </section>

            <section className="categories">
                {categories.map((category) => (
                    <Link
                        key={category._id}
                        href={`/projects?category=${category.slug}`}
                        className="category-item"
                    >
                        <img src={category.imageUrl} alt={category.name} />
                        <p>{category.name}</p>
                    </Link>
                ))}
            </section>

            <section className="products-section">
                <div className="products-container">
                    <div className="filter-bar">
                        <div className="filter-left">
                            <i className="fa-solid fa-grip"></i>
                            <i className="fa-solid fa-table-cells-large"></i>
                        </div>

                        <div className="filter-center">
                            {currentCategory ? currentCategory.toUpperCase() : "ALL"}
                        </div>

                        <div className="filter-right">
                            <span>SORT</span>
                            <span>FILTER</span>
                        </div>
                    </div>

                    <div className="products-grid">
                        {loading && <p>Loading collections...</p>}

                        {!loading && collections.length === 0 && (
                            <p>No collections found.</p>
                        )}

                        {!loading &&
                            collections.map((collection) => (
                                <Link
                                    key={collection._id}
                                    href={`/collections/${collection.slug}`}
                                    className="product-card"
                                >
                                    <div className="product-image">
                                        <img
                                            src={collection.imageUrl}
                                            alt={collection.name}
                                        />
                                        <span className="wishlist">
                                            <i className="fa-regular fa-heart"></i>
                                        </span>
                                    </div>

                                    <div className="product-info">
                                        <h3>{collection.name}</h3>
                                        <p>{collection.description}</p>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </section>
        </>
    );
}