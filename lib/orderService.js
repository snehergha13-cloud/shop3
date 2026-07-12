import Cart from "../models/Cart";
import Order from "../models/Order";
import Product from "../models/Product";

export async function getCartOrderData(userId) {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const productIds = cart.items
    .filter((item) => item.product)
    .map((item) => item.product);

  const products = await Product.find({
    _id: { $in: productIds },
  });

  const productsById = new Map(
    products.map((product) => [
      product._id.toString(),
      product,
    ])
  );

  let subtotal = 0;

  const items = [];
  const validCartItems = [];
  const deletedProductIds = [];

  for (const cartItem of cart.items) {
    if (!cartItem.product) {
      continue;
    }

    const productId = cartItem.product.toString();
    const product = productsById.get(productId);

    /*
     * A product may have been deleted while its ID still remains
     * inside an older user's cart. Remove that stale reference
     * instead of rejecting the entire checkout.
     */
    if (!product) {
      deletedProductIds.push(cartItem.product);
      continue;
    }

    /*
     * Older products may not contain the isActive field.
     * Only an explicit false means the product is unavailable.
     */
    if (product.isActive === false) {
      throw new Error(`"${product.name}" is no longer available`);
    }

    const quantity = Number(cartItem.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(`Invalid quantity for "${product.name}"`);
    }

    if (product.stock < quantity) {
      throw new Error(
        `Only ${product.stock} unit${
          product.stock === 1 ? "" : "s"
        } of "${product.name}" are available`
      );
    }

    const price = Number(product.price);

    if (!Number.isFinite(price) || price < 0) {
      throw new Error(`Invalid price for "${product.name}"`);
    }

    validCartItems.push({
      product: product._id,
      quantity,
    });

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

    subtotal += price * quantity;
  }

  /*
   * Permanently remove references to products that no longer exist.
   */
  if (deletedProductIds.length > 0) {
    await Cart.updateOne(
      { _id: cart._id },
      {
        $pull: {
          items: {
            product: {
              $in: deletedProductIds,
            },
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

  /*
   * Shipping has been disabled for now.
   */
  const shippingCost = 0;
  const total = subtotal;

  return {
    cart,
    cartItems: validCartItems,
    items,
    subtotal,
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

  /*
   * Reduce the stock only after the order has been created.
   */
  for (const item of cartItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: -item.quantity,
      },
    });
  }

  /*
   * Clear the user's cart after successful order creation.
   */
  await Cart.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        items: [],
      },
    }
  );

  return order;
}