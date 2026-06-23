import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminLayout from "../../../components/AdminLayout";
import { useAuth } from "../../../context/AuthContext";

export default function NewProduct() {
  const router = useRouter();
  const { authHeaders, isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    category: "",
    collection: "",
    sku: "",
    stock: "0",
    images: "",
    tags: "",
  });

  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/categories").then((r) => r.json()).then((d) => { if (d.success) setCategories(d.data); });
    fetch("/api/collections").then((r) => r.json()).then((d) => { if (d.success) setCollections(d.data); });
  }, [isAdmin]);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.description || !form.price || !form.category || !form.collection || !form.sku) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Math.round(Number(form.price) * 100),
          comparePrice: form.comparePrice ? Math.round(Number(form.comparePrice) * 100) : undefined,
          category: form.category,
          collection: form.collection,
          sku: form.sku,
          stock: Number(form.stock) || 0,
          images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
          tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Could not create product");
      router.push("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Add Product - Admin</title>
      </Head>

      <AdminLayout title="Add Product">
        <div className="admin-section">
          {error && <div className="admin-banner error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="admin-form-field full">
                <label htmlFor="name">Product Name *</label>
                <input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
              </div>

              <div className="admin-form-field full">
                <label htmlFor="description">Description *</label>
                <textarea id="description" value={form.description} onChange={(e) => updateField("description", e.target.value)} required />
              </div>

              <div className="admin-form-field">
                <label htmlFor="price">Price (₹) *</label>
                <input id="price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => updateField("price", e.target.value)} required />
              </div>

              <div className="admin-form-field">
                <label htmlFor="comparePrice">Compare-at Price (₹)</label>
                <input id="comparePrice" type="number" min="0" step="0.01" value={form.comparePrice} onChange={(e) => updateField("comparePrice", e.target.value)} />
              </div>

              <div className="admin-form-field">
                <label htmlFor="category">Category *</label>
                <select id="category" value={form.category} onChange={(e) => updateField("category", e.target.value)} required>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-field">
                <label htmlFor="collection">Collection *</label>
                <select id="collection" value={form.collection} onChange={(e) => updateField("collection", e.target.value)} required>
                  <option value="">Select collection</option>
                  {collections.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-field">
                <label htmlFor="sku">SKU *</label>
                <input id="sku" value={form.sku} onChange={(e) => updateField("sku", e.target.value)} required />
              </div>

              <div className="admin-form-field">
                <label htmlFor="stock">Initial Stock</label>
                <input id="stock" type="number" min="0" value={form.stock} onChange={(e) => updateField("stock", e.target.value)} />
              </div>

              <div className="admin-form-field full">
                <label htmlFor="images">Image URLs (comma-separated)</label>
                <input id="images" value={form.images} onChange={(e) => updateField("images", e.target.value)} placeholder="/assets/.../image1.jpg, /assets/.../image2.jpg" />
                <p className="admin-form-hint">Paths under /public, or full URLs. First image is used as the thumbnail.</p>
              </div>

              <div className="admin-form-field full">
                <label htmlFor="tags">Tags (comma-separated)</label>
                <input id="tags" value={form.tags} onChange={(e) => updateField("tags", e.target.value)} placeholder="notebook, illustrated" />
              </div>
            </div>

            <button type="submit" className="admin-btn" disabled={submitting}>
              {submitting ? "Creating..." : "Create Product"}
            </button>
          </form>
        </div>
      </AdminLayout>
    </>
  );
}
