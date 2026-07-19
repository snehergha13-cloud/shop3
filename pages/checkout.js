import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const fmt = (rupees) =>
  `₹${Number(rupees || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CheckoutPage() {
  const router = useRouter();

  const { cart, cartDiscount, cartTotal, cartLoading, clearCart } = useCart();

  const {
    user,
    isLoggedIn,
    loading: authLoading,
    authHeaders,
  } = useAuth();

  const [form, setForm] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  function loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existing = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existing) {
        existing.addEventListener("load", () => resolve(true), { once: true });
        existing.addEventListener("error", () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/login?redirect=/checkout");
    }
  }, [authLoading, isLoggedIn, router]);

  function updateField(key, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  const total = cartTotal;

  async function handlePlaceOrder(event) {
    event.preventDefault();
    setError("");

    const shippingAddress = {
      ...form,
      name: form.name || user?.name || "",
    };

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPlacing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Could not load Razorpay Checkout. Check your connection and try again."
        );
      }

      const createResponse = await fetch(
        "/api/payments/razorpay/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
        }
      );

      const createData = await createResponse.json();

      if (!createData.success) {
        throw new Error(createData.error || "Could not start payment");
      }

      await new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
          key: createData.data.keyId,
          amount: createData.data.amount,
          currency: createData.data.currency,
          name: "Word Of Art",
          description: "Order payment",
          order_id: createData.data.id,

          prefill: {
            name: shippingAddress.name,
            email: user?.email || "",
            contact: form.phone,
          },

          notes: {
            city: form.city,
            postalCode: form.postalCode,
          },

          theme: {
            color: "#111111",
          },

          modal: {
            ondismiss: () => {
              reject(new Error("Payment was cancelled."));
            },
          },

          handler: async (response) => {
            try {
              const verifyResponse = await fetch(
                "/api/payments/razorpay/verify",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(),
                  },
                  body: JSON.stringify({
                    ...response,
                    shippingAddress,
                  }),
                }
              );

              const verifyData = await verifyResponse.json();

              if (!verifyData.success) {
                throw new Error(
                  verifyData.error || "Payment verification failed"
                );
              }

              await clearCart();

              router.push(
                `/account/orders?placed=${verifyData.data.orderNumber}`
              );

              resolve();
            } catch (verificationError) {
              reject(verificationError);
            }
          },
        });

        razorpay.on("payment.failed", (response) => {
          reject(
            new Error(
              response.error?.description ||
                "Payment failed. Please try again."
            )
          );
        });

        razorpay.open();
      });
    } catch (orderError) {
      setError(orderError.message);
    } finally {
      setPlacing(false);
    }
  }

  if (authLoading || !isLoggedIn) {
    return null;
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
                <input
                  id="name"
                  required
                  value={form.name || user?.name || ""}
                  onChange={(event) => updateField("name", event.target.value)}
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="street">Street Address</label>
                <input
                  id="street"
                  required
                  value={form.street}
                  onChange={(event) =>
                    updateField("street", event.target.value)
                  }
                />
              </div>

              <div className="checkout-grid-2">
                <div className="checkout-field">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    required
                    value={form.city}
                    onChange={(event) =>
                      updateField("city", event.target.value)
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="state">State</label>
                  <input
                    id="state"
                    required
                    value={form.state}
                    onChange={(event) =>
                      updateField("state", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="checkout-grid-2">
                <div className="checkout-field">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    id="postalCode"
                    required
                    value={form.postalCode}
                    onChange={(event) =>
                      updateField("postalCode", event.target.value)
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    required
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  required
                  value={form.country}
                  onChange={(event) =>
                    updateField("country", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="checkout-section">
              <h2>Payment Method</h2>

              <div className="payment-options">
                <label className="payment-option selected">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked
                    readOnly
                  />

                  <span>
                    Pay Online (Razorpay)
                    <small>
                      Pay securely using UPI, cards, netbanking or supported
                      wallets.
                    </small>
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={placing || cartLoading || cart.length === 0}
            >
              {placing ? "Processing Payment..." : `Pay Now — ${fmt(total)}`}
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

                    <span>
                      {fmt(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}

                {cartDiscount > 0 && (
                  <div className="summary-row bundle-discount-row">
                    <span className="summary-item-name">You Save</span>
                    <span>−{fmt(cartDiscount)}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span className="summary-item-name">Shipping</span>
                  <span>Free</span>
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