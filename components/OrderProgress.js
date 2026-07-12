const STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

const LABELS = {
  pending: "Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};

export default function OrderProgress({ status }) {
  if (status === "cancelled" || status === "refunded") return null;

  const activeIndex = Math.max(0, STEPS.indexOf(status));

  return (
    <div className="order-progress" aria-label={`Order status: ${status}`}>
      {STEPS.map((step, index) => (
        <div
          key={step}
          className={`order-progress-step${index <= activeIndex ? " complete" : ""}${index === activeIndex ? " current" : ""}`}
        >
          <span className="order-progress-dot"></span>
          <span className="order-progress-label">{LABELS[step]}</span>
        </div>
      ))}
    </div>
  );
}
