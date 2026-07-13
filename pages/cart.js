import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const fmt = (rupees) =>
  `₹${Number(rupees || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CartPage() {
  const {
    cart,
    cartLoading,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    bundleOffers,
  } = useCart();
  const router = useRouter();

  if (cartLoading) {
    return (
      <>
        <Navbar />
        <main style={styles.page}>
          <p>Loading your cart...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main style={styles.page}>
          <p>
            Your cart is empty. <Link href="/shop">Go shop!</Link>
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={styles.page}>
        <h1 style={{ marginBottom: "24px" }}>Your Cart</h1>

        {cart.map(({ product, quantity }) => (
          <div key={product.id} style={styles.row}>
            <img src={product.image} alt={product.name} style={styles.image} />
            <div style={{ flex: 1 }}>
              <p style={styles.name}>{product.name}</p>
              <p style={styles.meta}>
                Qty: {quantity} × {fmt(product.price)}
              </p>
              {product.style && <p style={styles.meta}>Style: {product.style}</p>}
            </div>
            <div style={styles.right}>
              <p style={styles.subtotal}>{fmt(product.price * quantity)}</p>
              <button
                type="button"
                style={styles.removeBtn}
                onClick={() => removeFromCart(product.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div style={styles.totalsBox}>
          {cartDiscount > 0 && (
            <>
              <div style={styles.totalLine}>
                <span>Subtotal</span>
                <span>{fmt(cartSubtotal)}</span>
              </div>

              {bundleOffers.map((offer) => (
                <div key={offer.code} style={styles.offerLine}>
                  <span>
                    {offer.label}
                    {offer.pairs > 1 ? ` × ${offer.pairs}` : ""}
                  </span>
                  <span>−{fmt(offer.discount)}</span>
                </div>
              ))}
            </>
          )}

          <div style={styles.total}>
            <strong>Total</strong>
            <strong>{fmt(cartTotal)}</strong>
          </div>
        </div>

        <button
          type="button"
          style={styles.checkoutBtn}
          onClick={() => router.push("/checkout")}
        >
          Proceed to Checkout
        </button>
      </main>
      <Footer />
    </>
  );
}

const styles = {
  page: {
    maxWidth: "980px",
    margin: "0 auto",
    padding: "170px 32px 60px",
    minHeight: "50vh",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px 0",
    borderBottom: "1px solid #eee",
  },
  image: { width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" },
  name: { fontWeight: "600", margin: 0 },
  meta: { color: "#666", margin: "4px 0 0", fontSize: "14px" },
  right: { textAlign: "right" },
  subtotal: { fontWeight: "bold", margin: 0 },
  removeBtn: {
    marginTop: "6px",
    background: "none",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: "13px",
  },
  totalsBox: {
    marginLeft: "auto",
    maxWidth: "520px",
    padding: "18px 0",
  },
  totalLine: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "5px 0",
    color: "#555",
  },
  offerLine: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "5px 0",
    color: "#774f3e",
    fontSize: "14px",
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    fontSize: "20px",
    paddingTop: "12px",
    marginTop: "8px",
    borderTop: "1px solid #ddd",
  },
  checkoutBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
};
