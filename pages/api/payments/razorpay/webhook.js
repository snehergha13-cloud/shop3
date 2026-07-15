import crypto from "crypto";
import { connectDB } from "../../../../lib/db";
import { ok, error, serverError } from "../../../../lib/response";
import Order from "../../../../models/Order";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function safeEqual(a, b) {
  const first = Buffer.from(String(a));
  const second = Buffer.from(String(b));
  return first.length === second.length && crypto.timingSafeEqual(first, second);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return error(res, "Razorpay webhook is not configured", 501);
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers["x-razorpay-signature"];
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (!signature || !safeEqual(expectedSignature, signature)) {
      return error(res, "Invalid Razorpay webhook signature", 401);
    }

    const event = JSON.parse(rawBody.toString("utf8"));
    const payment = event.payload?.payment?.entity;

    if (!payment?.order_id) {
      return ok(res, { message: "Webhook received; no payment order to reconcile." });
    }

    await connectDB();

    if (["payment.authorized", "payment.captured"].includes(event.event)) {
      const updated = await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        {
          $set: {
            paymentStatus: "paid",
            paymentId: payment.id,
          },
        },
        { new: true }
      );

      return ok(res, {
        message: updated ? "Order payment reconciled." : "Payment verified, but no matching local order exists yet.",
      });
    }

    if (event.event === "payment.failed") {
      await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id, paymentStatus: { $ne: "paid" } },
        { $set: { paymentStatus: "unpaid", notes: payment.error_description || "Razorpay payment failed." } }
      );
    }

    return ok(res, { message: "Webhook received." });
  } catch (err) {
    console.error("[razorpay webhook]", err);
    return serverError(res, "Could not process Razorpay webhook");
  }
}
