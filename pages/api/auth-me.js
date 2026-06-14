import { connectDB } from "../../lib/db";
import { getAuthUser } from "../../lib/auth";
import { ok, unauthorized, serverError } from "../../lib/response";
import User from "../../models/User";

export default async function handler(req, res) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized(res);
  try {
    await connectDB();
    if (req.method === "GET") {
      const user = await User.findById(authUser.userId);
      if (!user) return unauthorized(res);
      return ok(res, { id: user.id, name: user.name, email: user.email, role: user.role, addresses: user.addresses });
    }
    if (req.method === "PATCH") {
      const { name, addresses } = req.body;
      const user = await User.findByIdAndUpdate(authUser.userId, { ...(name && { name }), ...(addresses && { addresses }) }, { new: true, runValidators: true });
      return ok(res, { id: user.id, name: user.name, email: user.email, addresses: user.addresses });
    }
    return res.status(405).end();
  } catch (err) {
    console.error("[me]", err);
    return serverError(res);
  }
}
