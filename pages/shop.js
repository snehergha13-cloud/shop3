import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WishlistButton from "../components/WishlistButton";

const normalizeAssetPath = (value) => {
    if (!value) return "";
    if (value.startsWith("public/")) return `/${value.slice(7)}`;
    return value;
};

const fmt = (paise) =>
    `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;


const normalizeText = (value) => String(value || "").trim().toLowerCase();

const getProductGroup = (product) => {
    const categorySlug = normalizeText(product.category?.slug || product.category);
    const categoryName = normalizeText(product.category?.name);
    const collectionSlug = normalizeText(product.collection?.slug || product.collection);
    const collectionName = normalizeText(product.collection?.name);

    const isNotebook =
        categorySlug === "notebooks" ||
        categoryName === "notebooks" ||
        categorySlug.includes("notebook") ||
        categoryName.includes("notebook");

    const isNoirEtBlanc =
        collectionSlug.includes("noir") ||
        collectionName.includes("noir et blanc");

    const isDeskline =
        collectionSlug.includes("deskline") ||
        collectionName.includes("deskline a5");

    const isDeskObject =
        categorySlug.includes("desk-object") ||
        categoryName.includes("desk object") ||
        collectionSlug.includes("desk-object") ||
        collectionName.includes("desk object");

    if (isNotebook && isNoirEtBlanc) return 0;
    if (isNotebook && isDeskline) return 1;
    if (isDeskObject) return 2;
    return 3;
};

const sortFeaturedProducts = (a, b) => {
    const groupDifference = getProductGroup(a) - getProductGroup(b);
    if (groupDifference !== 0) return groupDifference;

    return String(a.name || "").localeCompare(String(b.name || ""), "en", {
        sensitivity: "base",
    });
};

const SORT_OPTIONS = [
    { label: "Featured", value: "featured" },
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Name: A–Z", value: "name_asc" },
    { label: "Name: Z–A", value: "name_desc" },
];

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOpen, setSortOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState("featured");
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [maxPrice, setMaxPrice] = useState(100000);

    const router = useRouter();
    const currentCategory = router.query.category || null;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const productsRes = await fetch(
                    currentCategory
                        ? `/api/products?category=${currentCategory}`
                        : "/api/products"
                );

                const categoriesRes = await fetch("/api/categories");

                const productsJson = await productsRes.json();
                const categoriesJson = await categoriesRes.json();

                // If a category filter is active, check it actually exists in the DB
                if (currentCategory && categoriesJson.success) {
                    const exists = categoriesJson.data.some(
                        (c) => c.slug === currentCategory
                    );
                    if (!exists) {
                        router.replace(`/categories/coming-soon?slug=${currentCategory}`);
                        return;
                    }
                }

                const loaded = productsJson.success
                    ? productsJson.data.products.map((item) => ({
                        ...item,
                        imageUrl: normalizeAssetPath(item.images?.[0] || item.imageUrl || ""),
                    }))
                    : [];

                setProducts(loaded);

                const max = loaded.reduce((m, p) => Math.max(m, p.price || 0), 0);
                setMaxPrice(max || 100000);
                setPriceRange([0, max || 100000]);

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
                setProducts([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentCategory, router]);

    const filteredProducts = useMemo(() => {
        const result = [...products].filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        switch (selectedSort) {
            case "featured":
                result.sort(sortFeaturedProducts);
                break;
            case "price_asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price_desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name_asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name_desc":
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "newest":
            default:
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        return result;
    }, [products, selectedSort, priceRange]);

    function handleSort(value) {
        setSelectedSort(value);
        setSortOpen(false);
    }

    function handlePriceChange(e, index) {
        const val = Number(e.target.value);
        setPriceRange((prev) => {
            const updated = [...prev];
            updated[index] = val;
            return updated;
        });
    }

    return (
        <>
            <Head>
                <title>Shop - WordArt</title>
            </Head>

            <Navbar />

            <section className="hero">
                <div className="hero-banner">
                    <img src="/assets/banners/shop-collections-banner.png" alt="WordArt stationery collection" />
                    <div className="hero-overlay">
                        <h1>SHOP</h1>
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
                        href={`/shop?category=${category.slug}`}
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

                        <div className="filter-right" style={{ position: "relative" }}>
                            <span
                                onClick={() => { setSortOpen((o) => !o); setFilterOpen(false); }}
                                style={{ cursor: "pointer" }}
                            >
                                SORT
                            </span>

                            {sortOpen && (
                                <div style={dropdownStyle}>
                                    {SORT_OPTIONS.map((opt) => (
                                        <div
                                            key={opt.value}
                                            onClick={() => handleSort(opt.value)}
                                            style={{
                                                ...dropdownItemStyle,
                                                fontWeight: selectedSort === opt.value ? "700" : "400",
                                            }}
                                        >
                                            {opt.label}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <span
                                onClick={() => { setFilterOpen((o) => !o); setSortOpen(false); }}
                                style={{ cursor: "pointer", marginLeft: "16px" }}
                            >
                                FILTER
                            </span>

                            {filterOpen && (
                                <div style={{ ...dropdownStyle, width: "240px", right: 0 }}>
                                    <p style={{ margin: "0 0 8px", fontWeight: "600", fontSize: "13px" }}>
                                        PRICE RANGE
                                    </p>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                                        <span>{fmt(priceRange[0])}</span>
                                        <span>{fmt(priceRange[1])}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={0}
                                        max={maxPrice}
                                        step={100}
                                        value={priceRange[0]}
                                        onChange={(e) => handlePriceChange(e, 0)}
                                        style={{ width: "100%", marginBottom: "6px" }}
                                    />
                                    <input
                                        type="range"
                                        min={0}
                                        max={maxPrice}
                                        step={100}
                                        value={priceRange[1]}
                                        onChange={(e) => handlePriceChange(e, 1)}
                                        style={{ width: "100%" }}
                                    />
                                    <button
                                        onClick={() => setPriceRange([0, maxPrice])}
                                        style={{ marginTop: "12px", fontSize: "12px", cursor: "pointer", background: "none", border: "1px solid #ccc", padding: "4px 10px", borderRadius: "4px" }}
                                    >
                                        Reset
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="products-grid">
                        {loading && <p>Loading products...</p>}

                        {!loading && filteredProducts.length === 0 && (
                            <p>No products found.</p>
                        )}

                        {!loading &&
                            filteredProducts.map((product) => (
                                <article key={product._id} className="product-card">
                                    <div className="product-image">
                                        <Link href={`/collections/${product.collection?.slug}/${product.slug}`}>
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                            />
                                        </Link>
                                        <WishlistButton product={product} />
                                    </div>

                                    <Link
                                        href={`/collections/${product.collection?.slug}/${product.slug}`}
                                        className="product-info"
                                    >
                                        <h3>{product.name}</h3>
                                        <p>{fmt(product.price)}</p>
                                    </Link>
                                </article>
                            ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

const dropdownStyle = {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "12px",
    zIndex: 100,
    minWidth: "180px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

const dropdownItemStyle = {
    padding: "8px 4px",
    cursor: "pointer",
    fontSize: "13px",
    borderBottom: "1px solid #f5f5f5",
};