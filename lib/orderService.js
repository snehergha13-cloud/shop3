import mongoose from "mongoose";
import Cart from "../models/Cart";
import Counter from "../models/Counter";
import Order from "../models/Order";
import Product from "../models/Product";
import { calculateBundlePricing } from "./bundlePricing";

function validateShippingAddress(address = {}) {
  const required = ["name", "street", "city", "state", "postalCode", "phone"];
  const missing = required.filter((field) => !String(address[field] || "").trim());
  if (missing.length > 0) {
    throw new Error(`Missing shipping fields: ${missing.join(", ")}`);
  }

  return {
    name: String(address.name).trim(),
    street: String(address.street).trim(),
    city: String(address.city).trim(),
    state: String(address.state).trim(),
    postalCode: String(address.postalCode).trim(),
    country: String(address.country || "India").trim(),
    phone: String(address.phone).trim(),
  };
}

async function nextOrderNumber(session) {
  const counter = await Counter.findOneAndUpdate(
    { _id: "orderNumber" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, session }
  );

  return `WOA-${String(counter.seq).padStart(6, "0")}`;
}

export async function getCartOrderData(userId, options = {}) {
  const { session } = options;
  const cartQuery = Cart.findOne({ user: userId });
  if (session) cartQuery.session(session);
  const cart = await cartQuery;

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const productIds = cart.items
    .filter((item) => item.product)
    .map((item) => item.product);

  const productQuery = Product.find({
    _id: { $in: productIds },
  })
    .populate("category", "name slug")
    .populate("collection", "name slug");
  if (session) productQuery.session(session);
  const products = await productQuery;

  const productsById = new Map(
    products.map((product) => [product._id.toString(), product])
  );

  const items = [];
  const validCartItems = [];
  const pricingItems = [];
  const deletedProductIds = [];

  for (const cartItem of cart.items) {
    if (!cartItem.product) continue;

    const productId = cartItem.product.toString();
    const product = productsById.get(productId);

    if (!product) {
      deletedProductIds.push(cartItem.product);
      continue;
    }

    if (product.isActive === false) {
      throw new Error(`"${product.name}" is no longer available`);
    }

    const quantity = Number(cartItem.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(`Invalid quantity for "${product.name}"`);
    }

    if (product.stock < quantity) {
      throw new Error(
        `Only ${product.stock} unit${product.stock === 1 ? "" : "s"} of "${product.name}" are available`
      );
    }

    const price = Number(product.price);

    if (!Number.isFinite(price) || price < 0) {
      throw new Error(`Invalid price for "${product.name}"`);
    }

    validCartItems.push({ product: product._id, quantity });
    pricingItems.push({ product, quantity });

    items.push({
      product: product._id,
      name: product.name,
      price,
      quantity,
      image:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images[0]
          : "",
    });
  }

  if (deletedProductIds.length > 0) {
    const staleUpdate = Cart.updateOne(
      { _id: cart._id },
      { $pull: { items: { product: { $in: deletedProductIds } } } }
    );
    if (session) staleUpdate.session(session);
    await staleUpdate;
  }

  if (items.length === 0) {
    throw new Error("The products in your cart are no longer available. Please add them again.");
  }

  const pricing = calculateBundlePricing(pricingItems, { priceScale: 100 });
  const shippingCost = 0;
  const total = pricing.total;

  return {
    cart,
    cartItems: validCartItems,
    items,
    subtotal: pricing.regularSubtotal,
    discount: pricing.discount,
    appliedOffers: pricing.offers,
    shippingCost,
    total,
  };
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
  const session = await mongoose.startSession();

  try {
    let order;

    await session.withTransaction(async () => {
      if (paymentId) {
        const existingOrder = await Order.findOne({ paymentId }).session(session);
        if (existingOrder) {
          order = existingOrder;
          return;
        }
      }

      const {
        cartItems,
        items,
        subtotal,
        discount,
        appliedOffers,
        shippingCost,
        total,
      } = await getCartOrderData(userId, { session });

      for (const item of cartItems) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: item.product,
            isActive: { $ne: false },
            stock: { $gte: item.quantity },
          },
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        );

        if (!updatedProduct) {
          throw new Error("One or more products no longer have enough stock. Please refresh your cart.");
        }
      }

      const orderNumber = await nextOrderNumber(session);
      const docs = await Order.create(
        [
          {
            user: userId,
            orderNumber,
            items,
            shippingAddress: validateShippingAddress(shippingAddress),
            subtotal,
            shippingCost,
            discount,
            appliedOffers,
            total,
            couponCode,
            paymentMethod,
            paymentStatus,
            paymentId,
            razorpayOrderId,
            notes,
          },
        ],
        { session }
      );

      order = docs[0];

      await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } },
        { session }
      );
    });

    return order;
  } finally {
    await session.endSession();
  }
}
