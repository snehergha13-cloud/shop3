import { connectDB } from "../../../../lib/db";
import { getAuthUser } from "../../../../lib/auth";
import { getCartOrderData } from "../../../../lib/orderService";
import { getRazorpayClient } from "../../../../lib/razorpay";
import { ok, error, unauthorized } from "../../../../lib/response";
import { applyRateLimit } from "../../../../lib/rateLimit";

export default async function handler(req, res) {
  if (!applyRateLimit(req, res, { scope: "razorpay-create", limit: 15, windowMs: 15 * 60_000 })) return;
  if (req.method !== "POST") return res.status(405).end();

  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized(res);

  try {
    await connectDB();
    const { total } = await getCartOrderData(authUser.userId);
    const razorpay = getRazorpayClient();
    const receipt = `woa_${authUser.userId.slice(-8)}_${Date.now()}`.slice(0, 40);

    const razorpayOrder = await razorpay.orders.create({
      amount: total,
      currency: "INR",
      receipt,
      notes: { userId: authUser.userId },
    });

    return ok(res, {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[razorpay create order]", err);
    return error(res, err.message || "Could not start Razorpay payment", 400);
  }
}
