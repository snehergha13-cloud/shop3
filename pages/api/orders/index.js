import { connectDB } from "../../../lib/db";
import { getAuthUser } from "../../../lib/auth";
import { ok, created, error, unauthorized, serverError } from "../../../lib/response";
import Order from "../../../models/Order";
import Cart from "../../../models/Cart";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized(res);
  try {
    await connectDB();
    if (req.method === "GET") {
      const { page = 1, limit = 10, status } = req.query;
      const filter = authUser.role === "admin" ? {} : { user: authUser.userId };
      if (status) filter.status = status;
      const total = await Order.countDocuments(filter);
      const orders = await Order.find(filter).populate("user", "name email").sort({ createdAt: -1 }).skip((Number(page) - 1) * Number(limit)).limit(Number(limit)).lean();
      return ok(res, { orders, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) } });
    }
    if (req.method === "POST") {
      const { shippingAddress, paymentMethod, couponCode, notes } = req.body;
      if (!shippingAddress || !paymentMethod) return error(res, "shippingAddress and paymentMethod are required");
      const cart = await Cart.findOne({ user: authUser.userId }).populate("items.product");
      if (!cart || cart.items.length === 0) return error(res, "Cart is empty");
      let subtotal = 0;
      const items = [];
      for (const item of cart.items) {
        const product = item.product;
        if (!product || !product.isActive) return error(res, "A product is no longer available");
        if (product.stock < item.quantity) return error(res, `Insufficient stock for "${product.name}"`);
        items.push({ product: product._id, name: product.name, price: product.price, quantity: item.quantity, image: product.images?.[0] ?? "" });
        subtotal += product.price * item.quantity;
      }
      const shippingCost = subtotal >= 49900 ? 0 : 4900;
      const total = subtotal + shippingCost;
      const order = await Order.create({ user: authUser.userId, items, shippingAddress, subtotal, shippingCost, discount: 0, total, couponCode, paymentMethod, notes });
      for (const item of cart.items) { await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } }); }
      await Cart.findOneAndUpdate({ user: authUser.userId }, { items: [] });
      return created(res, order);
    }
    return res.status(405).end();
  } catch (err) {
    console.error("[orders]", err);
    return serverError(res);
  }
}
