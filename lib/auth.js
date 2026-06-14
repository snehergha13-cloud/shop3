import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
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
