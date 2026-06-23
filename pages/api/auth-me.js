import { connectDB } from "../../lib/db";
import { getAuthUser } from "../../lib/auth";
import { ok, error, unauthorized, serverError } from "../../lib/response";
import User from "../../models/User";

export default async function handler(req, res) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized(res);
  try {
    await connectDB();
    if (req.method === "GET") {
      const user = await User.findById(authUser.userId);
      if (!user) return unauthorized(res);
      return ok(res, { id: user.id, name: user.name, email: user.email, role: user.role, picture: user.picture, addresses: user.addresses });
    }
    if (req.method === "PATCH") {
      const { name, addresses, currentPassword, newPassword } = req.body;

      if (newPassword) {
        if (newPassword.length < 8) return error(res, "New password must be at least 8 characters");
        const user = await User.findById(authUser.userId).select("+password");
        if (!user) return unauthorized(res);
        // Google-only accounts have no password yet — let them set one
        // without requiring a "current password" they never had.
        if (user.password) {
          if (!currentPassword) return error(res, "Current password is required to set a new password");
          const match = await user.comparePassword(currentPassword);
          if (!match) return error(res, "Current password is incorrect", 401);
        }
        user.password = newPassword;
        if (name) user.name = name;
        if (addresses) user.addresses = addresses;
        await user.save();
        return ok(res, { id: user.id, name: user.name, email: user.email, addresses: user.addresses });
      }

      const user = await User.findByIdAndUpdate(authUser.userId, { ...(name && { name }), ...(addresses && { addresses }) }, { new: true, runValidators: true });
      return ok(res, { id: user.id, name: user.name, email: user.email, addresses: user.addresses });
    }
    return res.status(405).end();
  } catch (err) {
    console.error("[me]", err);
    return serverError(res);
  }
}
