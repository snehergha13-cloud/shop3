import { connectDB } from "../../../lib/db";
import { getAuthUser } from "../../../lib/auth";
import { ok, error, unauthorized, notFound, serverError } from "../../../lib/response";
import Cart from "../../../models/Cart";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized(res);
  try {
    await connectDB();
    if (req.method === "GET") {
      const cart = await Cart.findOne({ user: authUser.userId }).populate("items.product", "name price images stock isActive");
      return ok(res, cart ?? { items: [] });
    }
    if (req.method === "POST") {
      const { productId, quantity = 1 } = req.body;
      if (!productId) return error(res, "productId is required");
      const product = await Product.findById(productId);
      if (!product || !product.isActive) return notFound(res, "Product not found");
      if (product.stock < quantity) return error(res, "Insufficient stock");
      let cart = await Cart.findOne({ user: authUser.userId });
      if (!cart) cart = await Cart.create({ user: authUser.userId, items: [] });
      const existing = cart.items.find(i => i.product.toString() === productId);
      if (existing) existing.quantity = quantity;
      else cart.items.push({ product: productId, quantity });
      await cart.save();
      await cart.populate("items.product", "name price images stock isActive");
      return ok(res, cart);
    }
    if (req.method === "DELETE") {
      await Cart.findOneAndUpdate({ user: authUser.userId }, { items: [] });
      return ok(res, { message: "Cart cleared" });
    }
    return res.status(405).end();
  } catch (err) {
    console.error("[cart]", err);
    return serverError(res);
  }
}
