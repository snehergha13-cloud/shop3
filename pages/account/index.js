import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import OrderCard from "../../components/OrderCard";
import WishlistButton from "../../components/WishlistButton";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

const fmt = (paise) =>
  `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

function productHref(product) {
  if (product.collection?.slug && product.slug) {
    return `/collections/${product.collection.slug}/${product.slug}`;
  }
  return `/products/${product._id || product.id}`;
}

export default function AccountPage() {
  const router = useRouter();
  const {
    user,
    isLoggedIn,
    isAdmin,
    loading: authLoading,
    authHeaders,
    logout,
  } = useAuth();
  const { products: wishlist, loading: wishlistLoading } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/login?redirect=/account");
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch("/api/orders?limit=100", { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrders(data.data.orders || []);
      })
      .finally(() => setOrdersLoading(false));
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
      if (!data.success) throw new Error(data.error || "Could not cancel order");
      setOrders((current) =>
        current.map((order) => (order._id === orderId ? data.data : order))
      );
    } catch (err) {
      alert(err.message || "Could not cancel order");
    } finally {
      setCancellingId(null);
    }
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (authLoading || !isLoggedIn) return null;

  return (
    <>
      <Head>
        <title>My Account - Word Of Art</title>
      </Head>

      <Navbar />

      <main className="account-page">
        <div className="account-wrap-page account-dashboard-wrap">
          <div className="account-heading-row">
            <div>
              <p className="account-eyebrow">MY ACCOUNT</p>
              <h1>{user?.name}</h1>
              <p className="account-user-email">{user?.email}</p>
            </div>
            <div className="account-actions">
              {isAdmin && <Link href="/admin">Admin Panel</Link>}
              <button type="button" onClick={handleLogout}>Log Out</button>
            </div>
          </div>

          <nav className="account-section-nav" aria-label="Account sections">
            <a href="#wishlist">Wishlist ({wishlist.length})</a>
            <a href="#orders">My Orders ({orders.length})</a>
          </nav>

          <section id="wishlist" className="account-section-block">
            <div className="account-section-title">
              <div>
                <p className="account-eyebrow">SAVED ITEMS</p>
                <h2>My Wishlist</h2>
              </div>
              <Link href="/shop">Continue Shopping</Link>
            </div>

            {wishlistLoading ? (
              <p className="account-loading">Loading wishlist...</p>
            ) : wishlist.length === 0 ? (
              <div className="empty-state">
                Your wishlist is empty. <Link href="/shop">Browse products</Link>
              </div>
            ) : (
              <div className="account-wishlist-grid">
                {wishlist.map((product) => (
                  <article className="account-wishlist-card" key={product._id}>
                    <Link href={productHref(product)} className="account-wishlist-image">
                      <img
                        src={product.images?.[0] || product.imageUrl || ""}
                        alt={product.name}
                      />
                    </Link>
                    <div className="account-wishlist-info">
                      <Link href={productHref(product)}>{product.name}</Link>
                      <span>{fmt(product.price)}</span>
                    </div>
                    <WishlistButton
                      product={product}
                      className="account-wishlist-remove"
                      label="Remove"
                      activeLabel="Remove"
                    />
                  </article>
                ))}
              </div>
            )}
          </section>

          <section id="orders" className="account-section-block">
            <div className="account-section-title">
              <div>
                <p className="account-eyebrow">ORDER HISTORY</p>
                <h2>My Orders</h2>
              </div>
            </div>

            {ordersLoading ? (
              <p className="account-loading">Loading orders...</p>
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
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
