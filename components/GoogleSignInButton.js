// components/GoogleSignInButton.js
//
// Renders Google's official "Sign in with Google" button using Google
// Identity Services (GIS). Works as soon as NEXT_PUBLIC_GOOGLE_CLIENT_ID
// is set in the environment — no other setup required on the frontend.
//
// If the client id isn't configured yet, this renders a disabled-looking
// placeholder instead of crashing, so the rest of the auth pages work
// fine before Google credentials are added.

import { useEffect, useRef, useState } from "react";

const GIS_SRC = "https://accounts.google.com/gsi/client";

export default function GoogleSignInButton({ onCredential, text = "continue_with" }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const buttonRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!clientId) return;

    if (window.google?.accounts?.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScriptLoaded(true);
      return;
    }

    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => setScriptLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, [clientId]);

  useEffect(() => {
    if (!clientId || !scriptLoaded || !window.google?.accounts?.id || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => onCredential(response.credential),
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text,
      shape: "rectangular",
      width: 320,
    });
  }, [clientId, scriptLoaded, onCredential, text]);

  if (!clientId) {
    return (
      <div className="google-btn-fallback">
        Google Sign-In not configured yet — add NEXT_PUBLIC_GOOGLE_CLIENT_ID
      </div>
    );
  }

  return <div className="google-btn-slot" ref={buttonRef} />;
}
