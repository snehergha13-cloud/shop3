// pages/api/auth-google.js
// Verifies a Google ID token (sent from the frontend after Google Identity
// Services sign-in) and logs the user in, creating an account on first use.
//
// No extra Google SDK is needed server-side — we verify the token by asking
// Google's tokeninfo endpoint, which is the simplest possible integration.
// This requires NEXT_PUBLIC_GOOGLE_CLIENT_ID to be set (see .env.example).

import { connectDB } from "../../lib/db";
import { signToken } from "../../lib/auth";
import { ok, error, serverError } from "../../lib/response";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { credential } = req.body;
  if (!credential) return error(res, "Missing Google credential");

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return error(res, "Google Sign-In is not configured on this server", 501);
  }

  try {
    // Verify the ID token with Google. This both checks the signature/expiry
    // and confirms it was issued for OUR client id (preventing token reuse
    // from a different app).
    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );
    const payload = await verifyRes.json();

    if (!verifyRes.ok || payload.error) {
      return error(res, "Invalid Google credential", 401);
    }
    if (payload.aud !== clientId) {
      return error(res, "Google credential was not issued for this app", 401);
    }
    if (!payload.email || payload.email_verified !== "true") {
      return error(res, "Google account has no verified email", 401);
    }

    await connectDB();

    let user = await User.findOne({
      $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }],
    });

    if (!user) {
      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        email: payload.email.toLowerCase(),
        googleId: payload.sub,
        picture: payload.picture,
        authProvider: "google",
      });
    } else if (!user.googleId) {
      // An account with this email already exists (created via email/password).
      // Link the Google identity to it so either method works going forward.
      user.googleId = payload.sub;
      if (!user.picture) user.picture = payload.picture;
      await user.save();
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return ok(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, picture: user.picture },
    });
  } catch (err) {
    console.error("[auth-google]", err);
    return serverError(res);
  }
}
