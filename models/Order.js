import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: "" },
});

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [OrderItemSchema],
    shippingAddress: {
      name: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" },
      phone: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
    paymentMethod: { type: String, required: true },
    paymentId: { type: String },
    trackingNumber: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

OrderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `SS-${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
