import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">

            <div className="footer-container">

                <div className="footer-column">
                    <h3>ABOUT WORD OF ART</h3>
                    <p>
                        Word Of Art is a tribute to timeless stationery,
                        thoughtful craftsmanship and modern minimalism.
                        Built around paper goods, journals and artistic
                        essentials, the brand blends functionality with elegance
                        for creators, writers and thinkers.
                    </p>
                    <div className="social-icons">
                        <a href="#" aria-label="Facebook">F</a>
                        <a href="#" aria-label="X">X</a>
                        <a href="#" aria-label="Instagram">IG</a>
                        <a href="#" aria-label="Pinterest">P</a>
                        <a href="#" aria-label="YouTube">YT</a>
                    </div>
                </div>

                <div className="footer-column">
                    <h3>IMPORTANT LINKS</h3>
                    <ul>
                        <li><a href="#">Catalogue</a></li>
                        <li><a href="#">Stores</a></li>
                        <li><a href="#">Gift Cards</a></li>
                        <li><a href="#">Corporate Gifts</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Terms &amp; Conditions</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Track Order</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>MAIN MENU</h3>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Collaborations</a></li>
                        <li><a href="#">Journal</a></li>
                        <li><Link href="/projects">Collections</Link></li>
                        <li><Link href="/shop">Shop</Link></li>
                        <li><a href="#">Cafe Dori</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>NEWSLETTER</h3>
                    <p>
                        Subscribe to stay updated about new products,
                        launches and promotional offers.
                    </p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email address" />
                        <button type="submit">SUBSCRIBE</button>
                    </form>
                </div>

            </div>

            <div className="footer-bottom">
                © WORD OF ART
            </div>

        </footer>
    );
}
