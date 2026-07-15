import { connectDB } from "../../../lib/db";
import { getAuthUser } from "../../../lib/auth";
import { ok, created, error, unauthorized, serverError } from "../../../lib/response";
import { createOrderFromCart } from "../../../lib/orderService";
import Order from "../../../models/Order";
import { applyRateLimit } from "../../../lib/rateLimit";

export default async function handler(req, res) {
  if (!applyRateLimit(req, res, { scope: "orders", limit: 20, windowMs: 15 * 60_000 })) return;
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized(res);

  try {
    await connectDB();

    if (req.method === "GET") {
      const { page = 1, limit = 10, status } = req.query;
      const filter = authUser.role === "admin" ? {} : { user: authUser.userId };
      if (status) filter.status = status;

      const total = await Order.countDocuments(filter);
      const orders = await Order.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean();

      return ok(res, {
        orders,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      });
    }

    if (req.method === "POST") {
      const { shippingAddress, paymentMethod, couponCode, notes } = req.body;
      if (!shippingAddress || !paymentMethod) {
        return error(res, "shippingAddress and paymentMethod are required");
      }
      if (paymentMethod !== "cod") {
        return error(res, "Online payments must be completed through Razorpay");
      }

      const order = await createOrderFromCart({
        userId: authUser.userId,
        shippingAddress,
        paymentMethod: "cod",
        couponCode,
        notes,
      });
      return created(res, order);
    }

    return res.status(405).end();
  } catch (err) {
    console.error("[orders]", err);
    return error(res, err.message || "Could not create order", 400);
  }
}
