import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, cartLoading, removeFromCart, cartTotal } = useCart();
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
                    Qty: {quantity} x ₹{product.price.toFixed(2)}
                  </p>
                  {product.style && (
                      <p style={styles.meta}>Style: {product.style}</p>
                  )}
                </div>
                <div style={styles.right}>
                  <p style={styles.subtotal}>
                    ₹{(product.price * quantity).toFixed(2)}
                  </p>
                  <button
                      style={styles.removeBtn}
                      onClick={() => removeFromCart(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
          ))}

          <div style={styles.total}>
            <strong>Total: ₹{cartTotal.toFixed(2)}</strong>
          </div>

          <button
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
  image: { width: "80px", borderRadius: "8px" },
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
  total: { textAlign: "right", fontSize: "20px", padding: "16px 0" },
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
