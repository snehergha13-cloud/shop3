import { connectDB } from "../../lib/db";
import { signToken } from "../../lib/auth";
import { ok, error, serverError } from "../../lib/response";
import User from "../../models/User";
import { applyRateLimit } from "../../lib/rateLimit";

export default async function handler(req, res) {
  if (!applyRateLimit(req, res, { scope: "auth-register", limit: 8, windowMs: 15 * 60_000 })) return;
  if (req.method !== "POST") return res.status(405).end();
  try {
    await connectDB();
    const { name, email, password } = req.body;
    if (!name || !email || !password) return error(res, "Name, email and password are required");
    if (password.length < 8) return error(res, "Password must be at least 8 characters");
    const existing = await User.findOne({ email });
    if (existing) return error(res, "Email already registered", 409);
    const user = await User.create({ name, email, password });
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return ok(res, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("[register]", err);
    return serverError(res);
  }
}
