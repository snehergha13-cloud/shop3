import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import AdminLayout from "../../../components/AdminLayout";
import { useAuth } from "../../../context/AuthContext";

const fmt = (paise) => `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

export default function AdminOrders() {
  const { authHeaders, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [trackingDrafts, setTrackingDrafts] = useState({});
  const [trackingUrlDrafts, setTrackingUrlDrafts] = useState({});
  const [banner, setBanner] = useState(null);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders?limit=500", { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setOrders(data.data.orders);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isAdmin) loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const filtered = useMemo(() => {
    let result = orders;
    if (statusFilter) result = result.filter((o) => o.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, search, statusFilter]);

  async function updateOrder(id, patch) {
    setSavingId(id);
    setBanner(null);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Could not update order");
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...data.data, user: o.user } : o)));
      setBanner({ type: "success", text: "Order updated." });
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    } finally {
      setSavingId(null);
    }
  }

  function handleTrackingChange(id, value) {
    setTrackingDrafts((d) => ({ ...d, [id]: value }));
  }

  function handleTrackingUrlChange(id, value) {
    setTrackingUrlDrafts((d) => ({ ...d, [id]: value }));
  }

  return (
    <>
      <Head>
        <title>Orders - Admin</title>
      </Head>

      <AdminLayout title="Orders">
        {banner && <div className={`admin-banner ${banner.type}`}>{banner.text}</div>}

        <div className="admin-toolbar">
          <input
            className="admin-search"
            placeholder="Search by order #, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="status-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="admin-section" style={{ padding: 0 }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Tracking</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="admin-empty-row"><td colSpan={7}>Loading orders...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr className="admin-empty-row"><td colSpan={7}>No orders found.</td></tr>
                ) : (
                  filtered.map((o) => (
                    <tr key={o._id}>
                      <td data-label="Order" className="cell-label-hidden">
                        <div className="admin-table-product-name">{o.orderNumber}</div>
                        <div className="admin-table-product-sku">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </td>
                      <td className="customer-cell" data-label="Customer">
                        <div className="customer-name">{o.user?.name || "—"}</div>
                        <div className="customer-email">{o.user?.email || ""}</div>
                      </td>
                      <td data-label="Items">
                        {o.items.length} item{o.items.length !== 1 ? "s" : ""}
                      </td>
                      <td data-label="Total">{fmt(o.total)}</td>
                      <td data-label="Payment">
                        {o.paymentMethod === "cod" ? "COD" : o.paymentMethod}
                        <div className="admin-table-product-sku">{o.paymentStatus}</div>
                      </td>
                      <td data-label="Status">
                        <select
                          className="status-select"
                          value={o.status}
                          disabled={savingId === o._id}
                          onChange={(e) => updateOrder(o._id, { status: e.target.value })}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td data-label="Tracking">
                        <div className="admin-tracking-fields">
                          <input
                            className="tracking-input"
                            placeholder="Tracking number"
                            value={trackingDrafts[o._id] ?? o.trackingNumber ?? ""}
                            onChange={(e) => handleTrackingChange(o._id, e.target.value)}
                          />
                          <input
                            className="tracking-input tracking-url-input"
                            type="url"
                            placeholder="https://tracking-link.com/..."
                            value={trackingUrlDrafts[o._id] ?? o.trackingUrl ?? ""}
                            onChange={(e) => handleTrackingUrlChange(o._id, e.target.value)}
                          />
                          <button
                            className="table-action-link"
                            disabled={savingId === o._id}
                            onClick={() => updateOrder(o._id, {
                              trackingNumber: trackingDrafts[o._id] ?? o.trackingNumber ?? "",
                              trackingUrl: trackingUrlDrafts[o._id] ?? o.trackingUrl ?? "",
                            })}
                          >
                            {savingId === o._id ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
