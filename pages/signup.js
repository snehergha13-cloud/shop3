import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const router = useRouter();
  const { signup, loginWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = router.query.redirect || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);
    try {
      await signup(name, email, password);
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
        <title>Create Account - Word Of Art</title>
      </Head>

      <Navbar />

      <main className="auth-page">
        <div className="auth-wrap">
          <div className="auth-card">
            <span className="auth-kicker">JOIN US</span>
            <h1>Create Account</h1>
            <p className="auth-sub">Save your details and track every order in one place.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

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
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="auth-submit" disabled={submitting}>
                {submitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="auth-divider">or</div>

            <GoogleSignInButton onCredential={handleGoogle} text="signup_with" />

            <p className="auth-switch">
              Already have an account?{" "}
              <Link href={`/login${router.query.redirect ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
