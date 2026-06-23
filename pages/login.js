import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // After logging in, send the person back where they came from
  // (e.g. checkout), or to their account page by default.
  const redirectTo = router.query.redirect || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push(redirectTo);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle(credential) {
    setError("");
    try {
      await loginWithGoogle(credential);
      router.push(redirectTo);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <Head>
        <title>Sign In - Word Of Art</title>
      </Head>

      <Navbar />

      <main className="auth-page">
        <div className="auth-wrap">
          <div className="auth-card">
            <span className="auth-kicker">WELCOME BACK</span>
            <h1>Sign In</h1>
            <p className="auth-sub">Sign in to view your orders and continue shopping.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="auth-submit" disabled={submitting}>
                {submitting ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="auth-divider">or</div>

            <GoogleSignInButton onCredential={handleGoogle} />

            <p className="auth-switch">
              Don&apos;t have an account?{" "}
              <Link href={`/signup${router.query.redirect ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
