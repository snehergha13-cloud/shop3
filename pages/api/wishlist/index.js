import mongoose from "mongoose";
import { connectDB } from "../../../lib/db";
import { getAuthUser } from "../../../lib/auth";
import { ok, error, unauthorized, notFound, serverError } from "../../../lib/response";
import User from "../../../models/User";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized(res);

  try {
    await connectDB();

    if (req.method === "GET") {
      const user = await User.findById(authUser.userId)
        .populate({
          path: "wishlist",
          match: { isActive: true },
          populate: [
            { path: "category", select: "name slug" },
            { path: "collection", select: "name slug" },
          ],
        })
        .lean();

      if (!user) return unauthorized(res);
      return ok(res, { products: (user.wishlist || []).filter(Boolean) });
    }

    if (req.method === "POST") {
      const { productId } = req.body;
      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return error(res, "A valid productId is required");
      }

      const product = await Product.findOne({ _id: productId, isActive: true })
        .populate("category", "name slug")
        .populate("collection", "name slug")
        .lean();
      if (!product) return notFound(res, "Product not found");

      const user = await User.findById(authUser.userId);
      if (!user) return unauthorized(res);

      const existingIndex = (user.wishlist || []).findIndex(
        (id) => id.toString() === productId
      );

      let wishlisted;
      if (existingIndex >= 0) {
        user.wishlist.splice(existingIndex, 1);
        wishlisted = false;
      } else {
        user.wishlist.push(productId);
        wishlisted = true;
      }

      await user.save();
      return ok(res, { wishlisted, product: wishlisted ? product : null });
    }

    return res.status(405).end();
  } catch (err) {
    console.error("[wishlist]", err);
    return serverError(res);
  }
}
