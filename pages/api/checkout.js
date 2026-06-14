// pages/api/checkout.js -> URL: /api/checkout
// Backend route that creates a Stripe checkout session using Stripe's HTTP API.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "STRIPE_SECRET_KEY is not configured" });
  }

  const { cart } = req.body;

  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  try {
    const body = new URLSearchParams();
    body.set("mode", "payment");
    body.set("success_url", `${process.env.NEXT_PUBLIC_SITE_URL}/success`);
    body.set("cancel_url", `${process.env.NEXT_PUBLIC_SITE_URL}/cart`);

    cart.forEach(({ product, quantity }, index) => {
      body.set(`line_items[${index}][quantity]`, String(quantity));
      body.set(`line_items[${index}][price_data][currency]`, "usd");
      body.set(
        `line_items[${index}][price_data][unit_amount]`,
        String(Math.round(product.price * 100))
      );
      body.set(
        `line_items[${index}][price_data][product_data][name]`,
        product.name
      );
      if (product.image) {
        body.set(
          `line_items[${index}][price_data][product_data][images][0]`,
          product.image
        );
      }
    });

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      return res.status(stripeRes.status).json({
        error: session.error?.message || "Unable to create checkout session",
      });
    }

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return res.status(500).json({ error: error.message });
  }
}
