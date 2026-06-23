import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminLayout from "../../../components/AdminLayout";
import { useAuth } from "../../../context/AuthContext";

const fmt = (paise) => `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

function stockPillClass(stock) {
  if (stock === 0) return "stock-out";
  if (stock <= 10) return "stock-low";
  return "stock-ok";
}

export default function AdminProducts() {
  const { authHeaders, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState({}); // { [productId]: { stock, price } }
  const [savingId, setSavingId] = useState(null);
  const [banner, setBanner] = useState(null);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/products?includeInactive=true&limit=500", { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setProducts(data.data.products);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isAdmin) loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }, [products, search]);

  function startEdit(product) {
    setEditing((e) => ({ ...e, [product._id]: { stock: product.stock, price: product.price / 100 } }));
  }

  function updateEditField(id, field, value) {
    setEditing((e) => ({ ...e, [id]: { ...e[id], [field]: value } }));
  }

  async function saveEdit(id) {
    const draft = editing[id];
    if (!draft) return;
    setSavingId(id);
    setBanner(null);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          stock: Number(draft.stock),
          price: Math.round(Number(draft.price) * 100),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Could not update product");
      setProducts((prev) => prev.map((p) => (p._id === id ? data.data : p)));
      setEditing((e) => {
        const next = { ...e };
        delete next[id];
        return next;
      });
      setBanner({ type: "success", text: `Updated "${data.data.name}".` });
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    } finally {
      setSavingId(null);
    }
  }

  function cancelEdit(id) {
    setEditing((e) => {
      const next = { ...e };
      delete next[id];
      return next;
    });
  }

  async function toggleActive(product) {
    setSavingId(product._id);
    try {
      if (product.isActive) {
        // DELETE just deactivates (soft delete) per the existing API.
        const res = await fetch(`/api/products/${product._id}`, {
          method: "DELETE",
          headers: authHeaders(),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, isActive: false } : p)));
      } else {
        const res = await fetch(`/api/products/${product._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ isActive: true }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        setProducts((prev) => prev.map((p) => (p._id === product._id ? data.data : p)));
      }
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <>
      <Head>
        <title>Products & Inventory - Admin</title>
      </Head>

      <AdminLayout title="Products & Inventory">
        {banner && <div className={`admin-banner ${banner.type}`}>{banner.text}</div>}

        <div className="admin-toolbar">
          <input
            className="admin-search"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link href="/admin/products/new" className="admin-btn">
            <i className="fa-solid fa-plus"></i> Add Product
          </Link>
        </div>

        <div className="admin-section" style={{ padding: 0 }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="admin-empty-row"><td colSpan={6}>Loading products...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr className="admin-empty-row"><td colSpan={6}>No products found.</td></tr>
                ) : (
                  filtered.map((p) => {
                    const isEditing = !!editing[p._id];
                    const draft = editing[p._id];
                    return (
                      <tr key={p._id} style={{ opacity: p.isActive ? 1 : 0.5 }}>
                        <td>
                          <div className="admin-table-product-cell">
                            {p.images?.[0] && <img src={p.images[0]} alt={p.name} />}
                            <div>
                              <div className="admin-table-product-name">{p.name}</div>
                              <div className="admin-table-product-sku">{p.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td>{p.category?.name || "—"}</td>
                        <td>
                          {isEditing ? (
                            <input
                              className="inline-edit-input"
                              type="number"
                              min="0"
                              step="0.01"
                              value={draft.price}
                              onChange={(e) => updateEditField(p._id, "price", e.target.value)}
                            />
                          ) : (
                            fmt(p.price)
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              className="inline-edit-input"
                              type="number"
                              min="0"
                              value={draft.stock}
                              onChange={(e) => updateEditField(p._id, "stock", e.target.value)}
                            />
                          ) : (
                            <span className={`stock-pill ${stockPillClass(p.stock)}`}>
                              {p.stock === 0 ? "Out of stock" : p.stock}
                            </span>
                          )}
                        </td>
                        <td>{p.isActive ? "Active" : "Hidden"}</td>
                        <td>
                          {isEditing ? (
                            <div style={{ display: "flex", gap: "10px" }}>
                              <button
                                className="table-action-link"
                                onClick={() => saveEdit(p._id)}
                                disabled={savingId === p._id}
                              >
                                {savingId === p._id ? "Saving..." : "Save"}
                              </button>
                              <button className="table-action-link" onClick={() => cancelEdit(p._id)}>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: "flex", gap: "10px" }}>
                              <button className="table-action-link" onClick={() => startEdit(p)}>
                                Edit
                              </button>
                              <button
                                className="table-action-link danger"
                                onClick={() => toggleActive(p)}
                                disabled={savingId === p._id}
                              >
                                {p.isActive ? "Hide" : "Restore"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
