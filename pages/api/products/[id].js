import { connectDB } from "../../../lib/db";
import { getAuthUser } from "../../../lib/auth";
import { ok, error, forbidden, notFound, unauthorized, serverError } from "../../../lib/response";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    await connectDB();
    if (req.method === "GET") {
      const product = await Product.findById(id)
        .populate("category", "name slug")
        .populate("collection", "name slug");
      if (!product || !product.isActive) return notFound(res, "Product not found");
      return ok(res, product);
    }
    if (req.method === "PATCH") {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== "admin") return forbidden(res);
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        .populate("category", "name slug")
        .populate("collection", "name slug");
      if (!product) return notFound(res);
      return ok(res, product);
    }
    if (req.method === "DELETE") {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== "admin") return forbidden(res);
      const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!product) return notFound(res);
      return ok(res, { message: "Product deactivated" });
    }
    if (req.method === "POST" && req.query.action === "review") {
      const authUser = getAuthUser(req);
      if (!authUser) return unauthorized(res);
      const { rating, comment } = req.body;
      if (!rating || rating < 1 || rating > 5) return error(res, "Rating must be between 1 and 5");
      const product = await Product.findById(id);
      if (!product) return notFound(res);
      const already = product.reviews.find(r => r.user.toString() === authUser.userId);
      if (already) return error(res, "You have already reviewed this product", 409);
      product.reviews.push({ user: authUser.userId, rating, comment });
      const total = product.reviews.reduce((s, r) => s + r.rating, 0);
      product.averageRating = Math.round((total / product.reviews.length) * 10) / 10;
      product.numReviews = product.reviews.length;
      await product.save();
      return ok(res, product);
    }
    return res.status(405).end();
  } catch (err) {
    console.error("[product id]", err);
    return serverError(res);
  }
}
