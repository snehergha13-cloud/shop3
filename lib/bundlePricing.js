const normaliseKey = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function referenceKeys(reference) {
  if (!reference) return [];

  if (typeof reference === "string") {
    return [normaliseKey(reference)];
  }

  return [reference.slug, reference.name]
    .filter(Boolean)
    .map(normaliseKey);
}

export const NOTEBOOK_BUNDLE_RULES = [
  {
    code: "deskline-a5-pair",
    label: "Deskline A5: 2 notebooks for ₹699",
    categoryKeys: ["notebooks"],
    collectionKeys: ["c1-notebooks", "deskline-a5-notebooks", "deskline-a5"],
    bundleSize: 2,
    bundlePriceRupees: 699,
  },
  {
    code: "noir-et-blanc-a5-pair",
    label: "Noir Et Blanc A5: 2 notebooks for ₹999",
    categoryKeys: ["notebooks"],
    collectionKeys: [
      "c2-notebooks",
      "noir-et-blanc-a5-notebooks",
      "noir-et-blanc-a5",
    ],
    bundleSize: 2,
    bundlePriceRupees: 999,
  },
];

export function getNotebookBundleRule(product) {
  if (!product) return null;

  const categoryKeys = referenceKeys(product.category);
  const collectionKeys = referenceKeys(product.collection);

  return (
    NOTEBOOK_BUNDLE_RULES.find(
      (rule) =>
        rule.categoryKeys.some((key) => categoryKeys.includes(key)) &&
        rule.collectionKeys.some((key) => collectionKeys.includes(key))
    ) || null
  );
}

/**
 * Calculates the regular subtotal, bundle discount and final total.
 *
 * `priceScale` is 1 when prices are in rupees in the browser and 100 when
 * prices are stored in paise on the server.
 */
export function calculateBundlePricing(items, { priceScale = 1 } = {}) {
  const safeItems = Array.isArray(items) ? items : [];
  const groupedUnitPrices = new Map();
  let regularSubtotal = 0;

  for (const item of safeItems) {
    const product = item?.product || item;
    const quantity = Number(item?.quantity ?? 1);
    const price = Number(product?.price);

    if (!product || !Number.isFinite(price) || !Number.isInteger(quantity) || quantity < 1) {
      continue;
    }

    regularSubtotal += price * quantity;

    const rule = getNotebookBundleRule(product);
    if (!rule) continue;

    if (!groupedUnitPrices.has(rule.code)) {
      groupedUnitPrices.set(rule.code, { rule, unitPrices: [] });
    }

    const group = groupedUnitPrices.get(rule.code);
    for (let index = 0; index < quantity; index += 1) {
      group.unitPrices.push(price);
    }
  }

  const offers = [];
  let discount = 0;

  for (const { rule, unitPrices } of groupedUnitPrices.values()) {
    const pairCount = Math.floor(unitPrices.length / rule.bundleSize);
    if (pairCount < 1) continue;

    // Pair the highest-priced eligible units first. The current collections
    // use a single price per notebook, but this keeps the offer customer-safe
    // if product prices are changed later.
    unitPrices.sort((a, b) => b - a);
    const bundledUnitCount = pairCount * rule.bundleSize;
    const regularBundleTotal = unitPrices
      .slice(0, bundledUnitCount)
      .reduce((sum, price) => sum + price, 0);
    const bundleTotal = pairCount * rule.bundlePriceRupees * priceScale;
    const offerDiscount = Math.max(0, regularBundleTotal - bundleTotal);

    if (offerDiscount <= 0) continue;

    discount += offerDiscount;
    offers.push({
      code: rule.code,
      label: rule.label,
      pairs: pairCount,
      bundledUnits: bundledUnitCount,
      bundleTotal,
      discount: offerDiscount,
    });
  }

  return {
    regularSubtotal,
    discount,
    total: Math.max(0, regularSubtotal - discount),
    offers,
  };
}
