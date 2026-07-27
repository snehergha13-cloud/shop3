export const FREE_SHIPPING_THRESHOLD_RUPEES = 699;
export const SHIPPING_FEE_RUPEES = 120;

/**
 * Returns shipping cost in the same unit as the supplied order amount.
 * Use priceScale=1 in the browser (rupees) and priceScale=100 on the server (paise).
 * Orders of ₹699 or more ship free; lower orders are charged ₹120.
 */
export function calculateShippingCost(orderAmount, { priceScale = 1 } = {}) {
  const amount = Number(orderAmount || 0);
  const threshold = FREE_SHIPPING_THRESHOLD_RUPEES * priceScale;
  const shippingFee = SHIPPING_FEE_RUPEES * priceScale;

  if (!Number.isFinite(amount) || amount < 0) return shippingFee;
  return amount >= threshold ? 0 : shippingFee;
}
