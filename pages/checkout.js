import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const fmt = (rupees) => `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const FREE_SHIPPING_THRESHOLD = 499; // rupees — mirrors the ₹499 threshold in /api/orders (49900 paise)
const SHIPPING_COST = 49; // rupees — mirrors the ₹49 default in /api/orders (4900 paise)

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, cartLoading, clearCart } = useCart();
  const { user, isLoggedIn, loading: authLoading, authHeaders } = useAuth();

  const [form, setForm] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  // Checkout requires an account so the order can be linked to it.
  // Send people to login, then bounce them right back here.
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/login?redirect=/checkout");
    }
  }, [authLoading, isLoggedIn, router]);

  // Pre-fill the name field once we know who's checking out.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.name) setForm((f) => ({ ...f, name: f.name || user.name }));
  }, [user]);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const shippingCost = cartTotal >= FREE_SHIPPING_THRESHOLD || cartTotal === 0 ? 0 : SHIPPING_COST;
  const total = cartTotal + shippingCost;

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          shippingAddress: form,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Could not place order");

      await clearCart();
      router.push(`/account/orders?placed=${data.data.orderNumber}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  if (authLoading || !isLoggedIn) {
    return null; // redirecting to /login
  }

  return (
    <>
      <Head>
        <title>Checkout - WordArt</title>
      </Head>

      <Navbar />

      <main className="checkout-page">
        <div className="checkout-wrap">
          <h1>Checkout</h1>

          <form onSubmit={handlePlaceOrder}>
            <div className="checkout-section">
              <h2>Shipping Address</h2>

              {error && <div className="auth-error">{error}</div>}

              <div className="checkout-field">
                <label htmlFor="name">Full Name</label>
                <input id="name" required value={form.name} onChange={(e) => updateField("name", e.target.value)} />
              </div>

              <div className="checkout-field">
                <label htmlFor="street">Street Address</label>
                <input id="street" required value={form.street} onChange={(e) => updateField("street", e.target.value)} />
              </div>

              <div className="checkout-grid-2">
                <div className="checkout-field">
                  <label htmlFor="city">City</label>
                  <input id="city" required value={form.city} onChange={(e) => updateField("city", e.target.value)} />
                </div>
                <div className="checkout-field">
                  <label htmlFor="state">State</label>
                  <input id="state" required value={form.state} onChange={(e) => updateField("state", e.target.value)} />
                </div>
              </div>

              <div className="checkout-grid-2">
                <div className="checkout-field">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input id="postalCode" required value={form.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} />
                </div>
                <div className="checkout-field">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" required value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
                </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="country">Country</label>
                <input id="country" required value={form.country} onChange={(e) => updateField("country", e.target.value)} />
              </div>
            </div>

            <div className="checkout-section">
              <h2>Payment Method</h2>

              <div className="payment-options">
                <label className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <span>
                    Cash on Delivery
                    <small>Pay when your order arrives.</small>
                  </span>
                </label>

                <label className="payment-option payment-option-disabled">
                  <input type="radio" name="paymentMethod" value="razorpay" disabled />
                  <span>
                    Pay Online (Razorpay)
                    <small>Coming soon — card, UPI &amp; netbanking.</small>
                  </span>
                </label>
              </div>
            </div>

            {/* Mobile order summary sits inline; desktop uses the sticky sidebar */}
            <button type="submit" className="place-order-btn" disabled={placing || cartLoading || cart.length === 0}>
              {placing ? "Placing Order..." : `Place Order — ${fmt(total)}`}
            </button>
          </form>

          <aside className="order-summary-card">
            <h2>Order Summary</h2>

            {cartLoading ? (
              <p>Loading cart...</p>
            ) : cart.length === 0 ? (
              <p>
                Your cart is empty. <Link href="/shop">Go shop!</Link>
              </p>
            ) : (
              <>
                {cart.map((item) => (
                  <div className="summary-row" key={item.product.id}>
                    <span className="summary-item-name">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>{fmt(item.product.price * item.quantity)}</span>
                  </div>
                ))}

                <div className="summary-row">
                  <span className="summary-item-name">Subtotal</span>
                  <span>{fmt(cartTotal)}</span>
                </div>

                <div className="summary-row">
                  <span className="summary-item-name">Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : fmt(shippingCost)}</span>
                </div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>
              </>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
