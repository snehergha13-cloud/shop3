import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div style={styles.card}>
      {product.image && (
        <img src={product.image} alt={product.name} style={styles.image} />
      )}
      <div style={styles.category}>{product.category}</div>
      <p style={styles.name}>{product.name}</p>
      <p style={styles.price}>₹{product.price.toFixed(2)}</p>
      <a href={`/products/${product.id}`}>View Product</a>
      <button style={styles.btn} onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #eee",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "6px",
    background: "#f5f5f5",
  },
  category: {
    fontSize: "11px",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  name: { fontWeight: "600", fontSize: "15px", margin: 0 },
  price: { color: "#444", margin: 0 },
  btn: {
    marginTop: "8px",
    padding: "10px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
};
