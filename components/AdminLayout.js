// components/AdminLayout.js
//
// Shared shell for every /admin/* page: gates access to admins only,
// and renders a left sidebar nav + top bar consistent with the rest
// of the site's theme.

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ children, title }) {
  const router = useRouter();
  const { user, isAdmin, isLoggedIn, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) {
      router.replace("/login?redirect=/admin");
      return;
    }
    if (!isAdmin) {
      router.replace("/");
    }
  }, [loading, isLoggedIn, isAdmin, router]);

  if (loading || !isAdmin) {
    return (
      <div className="admin-gate">
        <p>{loading ? "Loading..." : "Redirecting..."}</p>
      </div>
    );
  }

  const isActive = (href) => router.pathname === href || router.pathname.startsWith(href + "/");

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-logo">
          <img src="/assets/BRAND LOGO - PNG/LOGO - WORDART.png" alt="Word Art" />
        </Link>

        <nav className="admin-nav">
          <Link href="/admin" className={isActive("/admin") && router.pathname === "/admin" ? "active" : ""}>
            <i className="fa-solid fa-gauge"></i> Dashboard
          </Link>
          <Link href="/admin/products" className={isActive("/admin/products") ? "active" : ""}>
            <i className="fa-solid fa-box"></i> Products & Inventory
          </Link>
          <Link href="/admin/orders" className={isActive("/admin/orders") ? "active" : ""}>
            <i className="fa-solid fa-receipt"></i> Orders
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/">← Back to store</Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <h1>{title}</h1>
          <span className="admin-user-chip">{user?.name}</span>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
