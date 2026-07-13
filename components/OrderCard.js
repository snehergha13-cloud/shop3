import OrderProgress from "./OrderProgress";

const fmt = (paise) =>
  `₹${(Number(paise || 0) / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default function OrderCard({ order, onCancel, cancelling = false }) {
  return (
    <div className="order-card">
      <div className="order-card-header">
        <div>
          <div className="order-number">{order.orderNumber}</div>
          <div className="order-date">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <span className={`order-status-badge status-${order.status}`}>
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>

      <OrderProgress status={order.status} />

      {order.items.map((item, index) => (
        <div className="order-item-row" key={`${item.product || item.name}-${index}`}>
          {item.image && <img src={item.image} alt={item.name} />}
          <span className="order-item-name">{item.name}</span>
          <span className="order-item-qty">× {item.quantity}</span>
          <span>{fmt(item.price * item.quantity)}</span>
        </div>
      ))}

      {Number(order.discount || 0) > 0 && (
        <div className="order-discount-summary">
          <div className="order-subtotal-line">
            <span>Subtotal</span>
            <span>{fmt(order.subtotal)}</span>
          </div>
          {Array.isArray(order.appliedOffers) && order.appliedOffers.length > 0 ? (
            order.appliedOffers.map((offer) => (
              <div className="order-discount-line" key={offer.code || offer.label}>
                <span>
                  {offer.label || "Notebook bundle offer"}
                  {offer.pairs > 1 ? ` × ${offer.pairs}` : ""}
                </span>
                <span>−{fmt(offer.discount)}</span>
              </div>
            ))
          ) : (
            <div className="order-discount-line">
              <span>Bundle discount</span>
              <span>−{fmt(order.discount)}</span>
            </div>
          )}
        </div>
      )}

      {(order.trackingNumber || order.trackingUrl) && (
        <div className="order-tracking-box">
          <div>
            <strong>Tracking</strong>
            {order.trackingNumber && <span>{order.trackingNumber}</span>}
          </div>
          {order.trackingUrl && (
            <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
              Track shipment <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          )}
        </div>
      )}

      <div className="order-card-footer">
        <span className="order-total">Total: {fmt(order.total)}</span>
        {order.status === "pending" && onCancel && (
          <button
            type="button"
            className="order-cancel-btn"
            onClick={() => onCancel(order._id)}
            disabled={cancelling}
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>
    </div>
  );
}
