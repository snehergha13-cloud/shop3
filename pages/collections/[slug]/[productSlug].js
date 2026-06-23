import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "components/Navbar";
import { useCart } from "context/CartContext";

const FALLBACK_IMGS = [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=85",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=85",
    "https://images.unsplash.com/photo-1455642305367-68834a1da7ab?w=800&q=85",
    "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=85",
];

const STYLE_OPTIONS = ["Plain", "Grid", "Ruled"];

const fmt = (paise) =>
    `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export default function ProductPage() {
    const router = useRouter();
    const { slug, productSlug } = router.query;
    const { addToCart } = useCart();

    const [collection, setCollection] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [mainImg, setMainImg] = useState(0);
    const [qty, setQty] = useState(1);
    const [selectedStyle, setSelectedStyle] = useState("Plain");
    const [detailsOpen, setDetailsOpen] = useState(true);
    const [stylesOpen, setStylesOpen] = useState(true);
    const [cartMsg, setCartMsg] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        fetch(`/api/collections/${slug}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setCollection(data.data.collection);
                    setProducts(data.data.products);
                    const match = data.data.products.find((p) => p.slug === productSlug);
                    setSelectedProductId(match?._id || data.data.products[0]?._id || "");
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [slug, productSlug]);

    const selectedProduct =
        products.find((p) => p._id === selectedProductId) || products[0];
    const fallbackCollectionImage = collection?.imageUrl || FALLBACK_IMGS[0];
    const imgs = selectedProduct?.images?.length
        ? selectedProduct.images
        : [fallbackCollectionImage];

    async function handleAddToCart() {
        if (!selectedProduct) return;

        try {
            await addToCart(
                {
                    id: selectedProduct._id,
                    name: selectedProduct.name,
                    price: selectedProduct.price / 100,
                    image: imgs[0],
                    style: selectedStyle,
                },
                qty
            );
            setCartMsg("Added to cart!");
        } catch (err) {
            setCartMsg(err.message || "Could not add to cart");
        } finally {
            setTimeout(() => setCartMsg(""), 2500);
        }
    }

    return (
        <>
            <Head>
                <title>
                    {selectedProduct ? `${selectedProduct.name} - Word Of Art` : "Product"}
                </title>
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
                <Link href={`/collections/${slug}`}>{collection?.name || "Collection"}</Link>
                <span>/</span>
                {selectedProduct?.name || "Product"}
            </div>

            {loading ? (
                <div className="collection-empty">Loading product...</div>
            ) : !collection ? (
                <div className="collection-empty">
                    Collection not found. <Link href="/projects">Back to collections</Link>
                </div>
            ) : !selectedProduct ? (
                <div className="collection-empty">
                    Product not found. <Link href={`/collections/${slug}`}>Back to collection</Link>
                </div>
            ) : (
                <section className="collection-page">
                    <div className="collection-thumbs">
                        {imgs.map((src, index) => (
                            <button
                                key={src}
                                type="button"
                                className={`collection-thumb${mainImg === index ? " active" : ""}`}
                                onClick={() => setMainImg(index)}
                            >
                                <img src={src} alt={`${selectedProduct.name} ${index + 1}`} />
                            </button>
                        ))}
                    </div>

                    <div className="collection-main-image">
                        <img src={imgs[mainImg]} alt={selectedProduct.name} />
                    </div>

                    <aside className="collection-info">
                        <p className="collection-label">{collection.name}</p>
                        <h1>{selectedProduct.name}</h1>

                        <div className="personalise-label">Style:</div>
                        <div className="personalise-options">
                            {STYLE_OPTIONS.map((style) => (
                                <label key={style}>
                                    <input
                                        type="radio"
                                        name="style"
                                        value={style}
                                        checked={selectedStyle === style}
                                        onChange={() => setSelectedStyle(style)}
                                    />
                                    {style.toUpperCase()}
                                </label>
                            ))}
                        </div>

                        <div className="collection-price">{fmt(selectedProduct.price)}</div>

                        {cartMsg && <div className="cart-msg">{cartMsg}</div>}

                        <div className="add-row">
                            <div className="qty-ctrl">
                                <button onClick={() => setQty((v) => Math.max(1, v - 1))}>-</button>
                                <span>{qty}</span>
                                <button onClick={() => setQty((v) => v + 1)}>+</button>
                            </div>

                            <button
                                className="btn-cart"
                                onClick={handleAddToCart}
                                disabled={selectedProduct.stock === 0}
                            >
                                {selectedProduct.stock === 0 ? "Out of Stock" : "Add To Cart"}
                            </button>
                        </div>

                        <button className="btn-buynow">Buy It Now</button>

                        <div className="accordion-item">
                            <button
                                type="button"
                                className="accordion-header"
                                onClick={() => setDetailsOpen((o) => !o)}
                            >
                                <h3>Details</h3>
                                <span className={`accordion-toggle${detailsOpen ? " open" : ""}`}>+</span>
                            </button>
                            <div className={`accordion-body${detailsOpen ? " open" : ""}`}>
                                <p style={{ whiteSpace: "pre-line" }}>{selectedProduct.description}</p>
                                <p style={{ whiteSpace: "pre-line" }}>{collection.description}</p>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <button
                                type="button"
                                className="accordion-header"
                                onClick={() => setStylesOpen((o) => !o)}
                            >
                                <h3>Styles</h3>
                                <span className={`accordion-toggle${stylesOpen ? " open" : ""}`}>+</span>
                            </button>
                            <div className={`accordion-body${stylesOpen ? " open" : ""}`}>
                                <ul>
                                    {Object.entries(selectedProduct.attributes || {}).map(([key, value]) => (
                                        <li key={key}>
                                            {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                                        </li>
                                    ))}
                                    {selectedProduct.sku && <li>SKU: {selectedProduct.sku}</li>}
                                    {selectedProduct.stock !== undefined && (
                                        <li>In stock: {selectedProduct.stock}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </aside>
                </section>
            )}
        </>
    );
}