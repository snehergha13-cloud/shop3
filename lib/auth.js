import jwt from "jsonwebtoken";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Add it in .env.local for local dev, or in your hosting provider's environment variables for production."
    );
  }
  return secret;
}

export function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token) {
  return jwt.verify(token, getSecret());
}

export function getAuthUser(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1];
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function requireAuth(req) {
  const user = getAuthUser(req);
  if (!user) throw new Error("Unauthorized");
  return user;
}

export function requireAdmin(req) {
  const user = requireAuth(req);
  if (user.role !== "admin") throw new Error("Forbidden");
  return user;
}
