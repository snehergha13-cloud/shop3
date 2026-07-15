import { error } from "../../lib/response";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  return error(
    res,
    "This legacy Stripe checkout endpoint is disabled. Use /api/payments/razorpay/create-order and /api/payments/razorpay/verify.",
    410
  );
}
