import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const fmt = (paise) => `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const LOW_STOCK_THRESHOLD = 10;

export default function AdminDashboard() {
  const { authHeaders, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    async function load() {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch("/api/products?includeInactive=true&limit=500", { headers: authHeaders() }),
          fetch("/api/orders?limit=500", { headers: authHeaders() }),
        ]);
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        const products = productsData.success ? productsData.data.products : [];
        const orders = ordersData.success ? ordersData.data.orders : [];

        const lowStock = products.filter((p) => p.isActive && p.stock <= LOW_STOCK_THRESHOLD && p.stock > 0);
        const outOfStock = products.filter((p) => p.isActive && p.stock === 0);
        const pendingOrders = orders.filter((o) => o.status === "pending");
        const revenue = orders
          .filter((o) => o.paymentStatus === "paid" || o.paymentMethod === "cod")
          .reduce((sum, o) => sum + o.total, 0);

        setStats({
          totalProducts: products.filter((p) => p.isActive).length,
          lowStockCount: lowStock.length,
          outOfStockCount: outOfStock.length,
          totalOrders: orders.length,
          pendingOrders: pendingOrders.length,
          revenue,
          lowStock: [...lowStock, ...outOfStock].slice(0, 6),
        });
        setRecentOrders(orders.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isAdmin, authHeaders]);

  return (
    <>
      <Head>
        <title>Admin Dashboard - Word Of Art</title>
      </Head>

      <AdminLayout title="Dashboard">
        {loading || !stats ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="stat-label">Active Products</div>
                <div className="stat-value">{stats.totalProducts}</div>
              </div>
              <div className={`admin-stat-card ${stats.lowStockCount + stats.outOfStockCount > 0 ? "warn" : ""}`}>
                <div className="stat-label">Low / Out of Stock</div>
                <div className="stat-value">{stats.lowStockCount + stats.outOfStockCount}</div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-label">Total Orders</div>
                <div className="stat-value">{stats.totalOrders}</div>
              </div>
              <div className={`admin-stat-card ${stats.pendingOrders > 0 ? "warn" : ""}`}>
                <div className="stat-label">Pending Orders</div>
                <div className="stat-value">{stats.pendingOrders}</div>
              </div>
            </div>

            <div className="admin-section">
              <h2>Recent Orders</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr className="admin-empty-row"><td colSpan={4}>No orders yet.</td></tr>
                    ) : (
                      recentOrders.map((o) => (
                        <tr key={o._id}>
                          <td>{o.orderNumber}</td>
                          <td className="customer-cell">
                            <div className="customer-name">{o.user?.name || "—"}</div>
                            <div className="customer-email">{o.user?.email || ""}</div>
                          </td>
                          <td>
                            <span className={`order-status-badge status-${o.status}`}>{o.status}</span>
                          </td>
                          <td>{fmt(o.total)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: "16px" }}>
                <Link href="/admin/orders" className="admin-btn secondary">View all orders</Link>
              </div>
            </div>

            <div className="admin-section">
              <h2>Needs Attention — Low / Out of Stock</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStock.length === 0 ? (
                      <tr className="admin-empty-row"><td colSpan={3}>All products are well stocked.</td></tr>
                    ) : (
                      stats.lowStock.map((p) => (
                        <tr key={p._id}>
                          <td className="admin-table-product-name">{p.name}</td>
                          <td>{p.sku}</td>
                          <td>
                            <span className={`stock-pill ${p.stock === 0 ? "stock-out" : "stock-low"}`}>
                              {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: "16px" }}>
                <Link href="/admin/products" className="admin-btn secondary">Manage products</Link>
              </div>
            </div>
          </>
        )}
      </AdminLayout>
    </>
  );
}
