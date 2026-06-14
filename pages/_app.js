// pages/_app.js

import { CartProvider } from "../context/CartContext";

import "../styles/home.css";
import "../styles/projects.css";

export default function App({ Component, pageProps }) {
    return (
        <CartProvider>
            <Component {...pageProps} />
        </CartProvider>
    );
}