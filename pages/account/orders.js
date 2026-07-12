import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import OrderCard from "../../components/OrderCard";
import { useAuth } from "../../context/AuthContext";

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
    fetch("/api/orders?limit=100", { headers: authHeaders() })
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
          <div className="account-back-link"><Link href="/account">← My Account</Link></div>
          <h1>My Orders</h1>

          {justPlaced && (
            <div className="checkout-section order-success-message">
              <p>
                Order <strong>{justPlaced}</strong> placed successfully. You can follow its status below.
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
              <OrderCard
                key={order._id}
                order={order}
                onCancel={handleCancel}
                cancelling={cancellingId === order._id}
              />
            ))
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
