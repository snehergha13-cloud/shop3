import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">

            <div className="footer-container">

                <div className="footer-column">
                    <h3>ABOUT WORDART</h3>
                    <p>
                        WordArt is a tribute to timeless stationery,
                        thoughtful craftsmanship and modern minimalism.
                        Built around paper goods, journals and artistic
                        essentials, the brand blends functionality with elegance
                        for creators, writers and thinkers.
                    </p>
                    <div className="social-icons">
                        <a href="#" aria-label="Facebook">F</a>
                        <a href="#" aria-label="X">X</a>
                        <a href="#" aria-label="Instagram">IG</a>
                        <a href="#" aria-label="YouTube">YT</a>
                    </div>
                </div>

                <div className="footer-column">
                    
                </div>

                <div className="footer-column">
                    <h3>MAIN MENU</h3>
                    <ul>
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/projects">Collections</Link></li>
                        <li><Link href="/shop">Shop</Link></li>
                        
                    </ul>
                </div>

                <div className="footer-column">
                </div>

            </div>

            <div className="footer-bottom">
                © WORDART
            </div>

        </footer>
    );
}
