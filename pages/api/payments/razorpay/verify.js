import crypto from "crypto";
import { connectDB } from "../../../../lib/db";
import { getAuthUser } from "../../../../lib/auth";
import { createOrderFromCart, getCartOrderData } from "../../../../lib/orderService";
import { getRazorpayClient } from "../../../../lib/razorpay";
import { created, error, unauthorized } from "../../../../lib/response";
import Order from "../../../../models/Order";

function safeEqual(a, b) {
  const first = Buffer.from(String(a));
  const second = Buffer.from(String(b));
  return first.length === second.length && crypto.timingSafeEqual(first, second);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized(res);

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    shippingAddress,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !shippingAddress) {
    return error(res, "Missing Razorpay payment details");
  }

  try {
    await connectDB();

    const existing = await Order.findOne({ paymentId: razorpay_payment_id });
    if (existing) return created(res, existing);

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (!safeEqual(expected, razorpay_signature)) {
      return error(res, "Razorpay signature verification failed", 400);
    }

    const [{ total }, razorpayOrder, payment] = await Promise.all([
      getCartOrderData(authUser.userId),
      getRazorpayClient().orders.fetch(razorpay_order_id),
      getRazorpayClient().payments.fetch(razorpay_payment_id),
    ]);

    if (Number(razorpayOrder.amount) !== total || razorpayOrder.currency !== "INR") {
      return error(res, "Payment amount does not match the cart total", 400);
    }
    if (payment.order_id !== razorpay_order_id || Number(payment.amount) !== total) {
      return error(res, "Payment details do not match this order", 400);
    }
    if (!['authorized', 'captured'].includes(payment.status)) {
      return error(res, "Payment has not been authorized", 400);
    }

    const order = await createOrderFromCart({
      userId: authUser.userId,
      shippingAddress,
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
    });

    return created(res, order);
  } catch (err) {
    console.error("[razorpay verify]", err);
    return error(res, err.message || "Could not verify Razorpay payment", 400);
  }
}
