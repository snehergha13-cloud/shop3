import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";

const fmt = (paise) => `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default function MyOrders() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading, authHeaders } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const justPlaced = router.query.placed;

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/login?redirect=/account/orders");
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/orders", { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setOrders(data.data.orders);
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn, authHeaders]);

  async function handleCancel(orderId) {
    setCancellingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? data.data : o)));
      } else {
        alert(data.error || "Could not cancel order");
      }
    } finally {
      setCancellingId(null);
    }
  }

  if (authLoading || !isLoggedIn) return null;

  return (
    <>
      <Head>
        <title>My Orders - Word Of Art</title>
      </Head>

      <Navbar />

      <main className="account-page">
        <div className="account-wrap-page">
          <h1>My Orders</h1>

          {justPlaced && (
            <div className="checkout-section" style={{ borderColor: "#23793a", marginBottom: "28px" }}>
              <p style={{ margin: 0, fontFamily: "Montserrat, sans-serif", fontSize: "14px" }}>
                🎉 Order <strong>{justPlaced}</strong> placed successfully! You&apos;ll find it below.
              </p>
            </div>
          )}

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              You haven&apos;t placed any orders yet. <Link href="/shop">Start shopping</Link>
            </div>
          ) : (
            orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-card-header">
                  <div>
                    <div className="order-number">{order.orderNumber}</div>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <span className={`order-status-badge status-${order.status}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>

                {order.items.map((item, i) => (
                  <div className="order-item-row" key={i}>
                    {item.image && <img src={item.image} alt={item.name} />}
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-qty">× {item.quantity}</span>
                    <span>{fmt(item.price * item.quantity)}</span>
                  </div>
                ))}

                {order.trackingNumber && (
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "12.5px", color: "#888", marginTop: "10px" }}>
                    Tracking number: {order.trackingNumber}
                  </p>
                )}

                <div className="order-card-footer">
                  <span className="order-total">Total: {fmt(order.total)}</span>
                  {order.status === "pending" && (
                    <button
                      className="order-cancel-btn"
                      onClick={() => handleCancel(order._id)}
                      disabled={cancellingId === order._id}
                    >
                      {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
