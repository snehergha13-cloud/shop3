// components/AdminLayout.js
//
// Shared shell for every /admin/* page: gates access to admins only,
// and renders a left sidebar nav (desktop) or a slide-out drawer +
// bottom tab bar (mobile), consistent with the rest of the site's theme.

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "fa-gauge", exact: true },
  { href: "/admin/products", label: "Products", icon: "fa-box" },
  { href: "/admin/orders", label: "Orders", icon: "fa-receipt" },
];

export default function AdminLayout({ children, title }) {
  const router = useRouter();
  const { user, isAdmin, isLoggedIn, loading, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false);
  }, [router.pathname]);

  if (loading || !isAdmin) {
    return (
      <div className="admin-gate">
        <div className="admin-gate-spinner" />
        <p>{loading ? "Loading..." : "Redirecting..."}</p>
      </div>
    );
  }

  const isActive = (href, exact) => (exact ? router.pathname === href : router.pathname.startsWith(href));

  const navLinks = (onNavigate) => (
    <nav className="admin-nav">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={isActive(item.href, item.exact) ? "active" : ""}
          onClick={onNavigate}
        >
          <i className={`fa-solid ${item.icon}`}></i>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="admin-shell">
      {/* DESKTOP SIDEBAR */}
      <aside className="admin-sidebar">
        <Link href="/" className="admin-logo">
          <img src="/assets/BRAND LOGO - PNG/LOGO - WORDART.png" alt="Word Art" />
        </Link>

        {navLinks()}

        <div className="admin-sidebar-footer">
          <Link href="/">
            <i className="fa-solid fa-arrow-left"></i> Back to store
          </Link>
        </div>
      </aside>

      {/* MOBILE SLIDE-OUT DRAWER */}
      <div className={`admin-drawer-backdrop ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`admin-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="admin-drawer-header">
          <img src="/assets/BRAND LOGO - PNG/LOGO - WORDART.png" alt="Word Art" />
          <button type="button" className="admin-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {navLinks(() => setDrawerOpen(false))}

        <div className="admin-drawer-footer">
          <Link href="/" onClick={() => setDrawerOpen(false)}>
            <i className="fa-solid fa-arrow-left"></i> Back to store
          </Link>
          <button type="button" className="admin-drawer-logout" onClick={logout}>
            <i className="fa-solid fa-right-from-bracket"></i> Log out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        {/* MOBILE TOPBAR */}
        <header className="admin-topbar-mobile">
          <button type="button" className="admin-hamburger" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <i className="fa-solid fa-bars"></i>
          </button>
          <span className="admin-topbar-mobile-title">{title}</span>
          <span className="admin-user-avatar">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
        </header>

        {/* DESKTOP TOPBAR */}
        <header className="admin-topbar">
          <h1>{title}</h1>
          <span className="admin-user-chip">
            <i className="fa-solid fa-user"></i> {user?.name}
          </span>
        </header>

        <main className="admin-content">{children}</main>

        {/* MOBILE BOTTOM TAB BAR */}
        <nav className="admin-bottom-tabs">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href, item.exact) ? "active" : ""}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
          <button type="button" onClick={() => setDrawerOpen(true)}>
            <i className="fa-solid fa-bars"></i>
            <span>More</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
