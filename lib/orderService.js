import Cart from "../models/Cart";
import Order from "../models/Order";
import Product from "../models/Product";

export async function getCartOrderData(userId) {
  // Read the cart without populate first.
  // Deleted products can otherwise remain as stale cart references.
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const productIds = cart.items.map((item) => item.product);

  const products = await Product.find({
    _id: { $in: productIds },
  });

  const productsById = new Map(
    products.map((product) => [product._id.toString(), product])
  );

  let subtotal = 0;

  const items = [];
  const validCartItems = [];
  const deletedProductIds = [];

  for (const cartItem of cart.items) {
    const productId = cartItem.product.toString();
    const product = productsById.get(productId);

    // Remove stale references to deleted products instead of rejecting
    // the whole checkout.
    if (!product) {
      deletedProductIds.push(cartItem.product);
      continue;
    }

    // Older products may not have isActive yet.
    // Only an explicit false means the product is hidden.
    if (product.isActive === false) {
      throw new Error(`"${product.name}" is no longer available`);
    }

    if (product.stock < cartItem.quantity) {
      throw new Error(`Insufficient stock for "${product.name}"`);
    }

    validCartItems.push({
      product: product._id,
      quantity: cartItem.quantity,
    });

    items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: cartItem.quantity,
      image: product.images?.[0] ?? "",
    });

    subtotal += product.price * cartItem.quantity;
  }

  // Clean deleted product references from the user's cart.
  if (deletedProductIds.length > 0) {
    await Cart.updateOne(
      { _id: cart._id },
      {
        $pull: {
          items: {
            product: { $in: deletedProductIds },
          },
        },
      }
    );
  }

  if (items.length === 0) {
    throw new Error(
      "The products in your cart are no longer available. Please add them again."
    );
  }

  const shippingCost = subtotal >= 49900 ? 0 : 4900;

  return {
    cart,
    cartItems: validCartItems,
    items,
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
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
  const {
    cartItems,
    items,
    subtotal,
    shippingCost,
    total,
  } = await getCartOrderData(userId);

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

  for (const item of cartItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: -item.quantity,
      },
    });
  }

  await Cart.findOneAndUpdate(
    { user: userId },
    { items: [] }
  );

  return order;
}