import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ComingSoon() {
    const router = useRouter();
    const { slug } = router.query;

    const label = slug
        ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "This Category";

    return (
        <>
            <Head>
                <title>{label} — Coming Soon · Word Of Art</title>
            </Head>

            <Navbar />

            <main className="coming-soon-page">
                <div className="coming-soon-inner">
                    <p className="coming-soon-eyebrow">WORD OF ART</p>
                    <h1 className="coming-soon-heading">{label}</h1>
                    <p className="coming-soon-body">
                        We&apos;re working on adding this category.<br />
                        Check back soon — something beautiful is on its way.
                    </p>
                    <Link href="/shop" className="coming-soon-btn">
                        BROWSE ALL PRODUCTS
                    </Link>
                </div>
            </main>

            <Footer />

            <style>{`
                .coming-soon-page {
                    min-height: calc(100vh - 132px);
                    margin-top: 132px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #F4F0EA;
                    padding: 60px 24px;
                }
                .coming-soon-inner {
                    text-align: center;
                    max-width: 520px;
                }
                .coming-soon-eyebrow {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 11px;
                    letter-spacing: 4px;
                    color: #999;
                    margin-bottom: 20px;
                }
                .coming-soon-heading {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 2.4rem;
                    font-weight: 300;
                    letter-spacing: 6px;
                    color: #1a1a1a;
                    text-transform: uppercase;
                    margin-bottom: 24px;
                }
                .coming-soon-body {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 0.95rem;
                    line-height: 1.9;
                    color: #666;
                    margin-bottom: 40px;
                }
                .coming-soon-btn {
                    display: inline-block;
                    padding: 14px 36px;
                    background: #1a1a1a;
                    color: #fff;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 12px;
                    letter-spacing: 3px;
                    text-decoration: none;
                    transition: background 0.3s ease;
                }
                .coming-soon-btn:hover {
                    background: #444;
                }
                @media (max-width: 768px) {
                    .coming-soon-page {
                        min-height: calc(100vh - 104px);
                        margin-top: 104px;
                    }
                    .coming-soon-heading {
                        font-size: 1.6rem;
                        letter-spacing: 4px;
                    }
                }
            `}</style>
        </>
    );
}