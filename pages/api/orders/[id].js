import { connectDB } from "../../../lib/db";
import { getAuthUser } from "../../../lib/auth";
import { ok, error, unauthorized, forbidden, notFound, serverError } from "../../../lib/response";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized(res);
  const { id } = req.query;
  try {
    await connectDB();
    if (req.method === "GET") {
      const order = await Order.findById(id).populate("user", "name email");
      if (!order) return notFound(res);
      if (authUser.role !== "admin" && order.user._id.toString() !== authUser.userId) return forbidden(res);
      return ok(res, order);
    }
    if (req.method === "PATCH") {
      const order = await Order.findById(id);
      if (!order) return notFound(res);
      if (authUser.role === "admin") {
        const { status, trackingNumber, paymentStatus, paymentId } = req.body;
        if (status) order.status = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (paymentId) order.paymentId = paymentId;
      } else {
        if (order.user.toString() !== authUser.userId) return forbidden(res);
        if (req.body.status === "cancelled" && order.status === "pending") order.status = "cancelled";
        else return error(res, "You can only cancel pending orders");
      }
      await order.save();
      return ok(res, order);
    }
    return res.status(405).end();
  } catch (err) {
    console.error("[order id]", err);
    return serverError(res);
  }
}
