import { connectDB } from "../../../lib/db";
import { getAuthUser } from "../../../lib/auth";
import { ok, unauthorized, notFound, serverError } from "../../../lib/response";
import Cart from "../../../models/Cart";

const cartProductPopulate = {
  path: "items.product",
  select: "name price images stock isActive category collection",
  populate: [
    { path: "category", select: "name slug" },
    { path: "collection", select: "name slug" },
  ],
};

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();

  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized(res);
  const { productId } = req.query;

  try {
    await connectDB();
    const cart = await Cart.findOne({ user: authUser.userId });
    if (!cart) return notFound(res, "Cart not found");

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    await cart.populate(cartProductPopulate);
    return ok(res, cart);
  } catch (err) {
    console.error("[cart remove]", err);
    return serverError(res);
  }
}
