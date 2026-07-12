// pages/_app.js

import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";

import "../styles/home.css";
import "../styles/projects.css";
import "../styles/about.css";
import "../styles/auth.css";
import "../styles/admin.css";

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    <Component {...pageProps} />
                </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    );
}
