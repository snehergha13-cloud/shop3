import Cart from "../models/Cart";
import Order from "../models/Order";
import Product from "../models/Product";

export async function getCartOrderData(userId) {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  let subtotal = 0;
  const items = [];

  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.isActive) {
      throw new Error("A product is no longer available");
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for "${product.name}"`);
    }

    items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.images?.[0] ?? "",
    });
    subtotal += product.price * item.quantity;
  }

  const shippingCost = subtotal >= 49900 ? 0 : 4900;
  return { cart, items, subtotal, shippingCost, total: subtotal + shippingCost };
}

export async function createOrderFromCart({
  userId,
  shippingAddress,
  paymentMethod,
  paymentStatus = "unpaid",
  paymentId,
  razorpayOrderId,
  couponCode,
  notes,
}) {
  const { cart, items, subtotal, shippingCost, total } = await getCartOrderData(userId);

  const order = await Order.create({
    user: userId,
    items,
    shippingAddress,
    subtotal,
    shippingCost,
    discount: 0,
    total,
    couponCode,
    paymentMethod,
    paymentStatus,
    paymentId,
    razorpayOrderId,
    notes,
  });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }
  await Cart.findOneAndUpdate({ user: userId }, { items: [] });

  return order;
}
