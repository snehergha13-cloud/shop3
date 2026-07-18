import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
    return (
        <>
            <Head>
                <title>About Us - WordArt</title>
                <meta
                    name="description"
                    content="Wa.Wordart — where ideas find form, stories find meaning, and imagination becomes reality. Premium stationery for creators."
                />
            </Head>

            <Navbar />

            <main className="about-page">

                {/* HERO */}
                <section className="about-hero">
                    <img src="/assets/home/SLIDE - 0.jpg" alt="Wa.Wordart desk essentials" />
                    <div className="about-hero-content">
                       
                      
                        <p className="about-hero-quote">
                            &ldquo;Where ideas find form, stories find meaning, and
                            imagination becomes reality.&rdquo;
                        </p>
                    </div>
                </section>

                {/* INTRO — Ideas deserve a place to begin */}
                <section className="about-intro">
                    <div className="about-intro-inner">
                        <span className="about-kicker">IDEAS DESERVE A PLACE TO BEGIN</span>
                        <h2>
                            Every masterpiece <em>starts with a blank page.</em>
                        </h2>
                        <p>
                            At Wa.Wordart, we believe creativity isn&apos;t limited to one —
                            it belongs to the architect sketching tomorrow&apos;s skyline, the
                            filmmaker building unforgettable stories, the photographer
                            framing emotion, the designer chasing perfection, the artist
                            exploring imagination, and the dreamer turning ideas into
                            reality.
                        </p>
                    </div>
                </section>

                {/* WHAT WE DO */}
                <section className="about-split">

                    <div className="about-split-media">
                        <img
                            src="/assets/A5_softbound/C_1/A5 Notebooks - 1B.png"
                            alt="Wa.Wordart notebooks laid out on a desk"
                        />
                    </div>

                    <div className="about-split-text">
                        <span className="about-kicker">WHAT WE DO</span>
                        <h2>
                            We create premium stationery designed to become a part
                            of your special journey.
                        </h2>
                        <p>
                            Our collection of notebooks and stationery is crafted for
                            people who think deeply, write endlessly, and create
                            fearlessly. Whether it&apos;s your next architectural concept,
                            screenplay, brand identity, travel journal, photography
                            notes, or everyday thoughts — Wa.Wordart is built to hold
                            what matters most: your ideas.
                        </p>
                    </div>

                </section>

                {/* QUALITY PROMISE — reversed */}
                <section className="about-split reverse">

                    <div className="about-split-media">
                        <img
                            src="/assets/Journals/LANDING PAGE/Jounal - 1A.png"
                            alt="Wa.Wordart journal with gold foil detailing"
                        />
                    </div>

                    <div className="about-split-text">
                        <span className="about-kicker">QUALITY PROMISE</span>
                        <h2>A notebook isn&apos;t just paper.</h2>
                        <p>
                            It&apos;s where ideas are born. Where mistakes become
                            masterpieces. Where plans become projects. Where
                            imagination becomes reality.
                        </p>
                        <p>
                            Every cover, every page, and every detail is thoughtfully
                            designed to inspire creativity while maintaining timeless
                            aesthetics. Designed for creators — if your work begins
                            with an idea, Wa.Wordart is made for you.
                        </p>
                    </div>

                </section>

                {/* OUR PROMISE TO YOU — manifesto band */}
                <section className="about-manifesto">
                    <div className="about-manifesto-inner">
                        <span className="about-kicker">OUR PROMISE TO YOU</span>
                        <blockquote>
                            We are committed to creating premium stationery that
                            combines thoughtful design, quality craftsmanship, and
                            lasting functionality.
                        </blockquote>
                        <cite>Because the tools you create with should inspire you every single day.</cite>
                    </div>
                </section>

                {/* CLOSING BRAND MARK */}
                <section className="about-cta">
                    <img
                        src="/assets/about/about-cta-soft-background.png"
                        alt="Soft neutral WordArt stationery desk arrangement"
                    />
                    <div className="about-cta-content">
                        <span className="about-cta-brand">WORDART</span>
                        <h2>Ideas. Ink. Impact.</h2>
                        <Link href="/shop" className="about-cta-button">
                            SHOP THE COLLECTION
                        </Link>
                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}
