// pages/checkout.js -> URL: /checkout
// Calls our API to create a Stripe session.

import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();

  async function handleCheckout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Something went wrong. Check the console.");
      console.error(data);
    }
  }

  return (
    <>
      <Navbar />
      <main style={styles.page}>
        <h1 style={{ marginBottom: "24px" }}>Checkout</h1>

        <div style={styles.summary}>
          <h2 style={{ marginBottom: "12px" }}>Order Summary</h2>
          {cart.map(({ product, quantity }) => (
            <div key={product.id} style={styles.row}>
              <span>
                {product.name} x {quantity}
              </span>
              <span>₹{(product.price * quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={styles.total}>
            <strong>Total</strong>
            <strong>₹{cartTotal.toFixed(2)}</strong>
          </div>
        </div>

        <button style={styles.btn} onClick={handleCheckout}>
          Pay with Stripe
        </button>

        <p style={styles.note}>
          You'll be redirected to Stripe's secure payment page.
        </p>
      </main>
    </>
  );
}

const styles = {
  page: {
    maxWidth: "480px",
    margin: "0 auto",
    padding: "170px 24px 60px",
  },
  summary: {
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: "15px",
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #eee",
    paddingTop: "12px",
    marginTop: "8px",
    fontSize: "18px",
  },
  btn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  note: {
    textAlign: "center",
    color: "#999",
    fontSize: "13px",
    marginTop: "12px",
  },
};
