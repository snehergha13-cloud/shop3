import { connectDB } from "../../lib/db";
import { signToken } from "../../lib/auth";
import { ok, error, serverError } from "../../lib/response";
import User from "../../models/User";
import { applyRateLimit } from "../../lib/rateLimit";

export default async function handler(req, res) {
  if (!applyRateLimit(req, res, { scope: "auth-login", limit: 10, windowMs: 15 * 60_000 })) return;
  if (req.method !== "POST") return res.status(405).end();
  try {
    await connectDB();
    const { email, password } = req.body;
    if (!email || !password) return error(res, "Email and password are required");
    const user = await User.findOne({ email }).select("+password");
    if (!user) return error(res, "Invalid email or password", 401);
    const match = await user.comparePassword(password);
    if (!match) return error(res, "Invalid email or password", 401);
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return ok(res, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("[login]", err);
    return serverError(res);
  }
}
