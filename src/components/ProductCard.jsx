import { useState } from "react";
import PropTypes from "prop-types";
import { useCart } from "../context/CartContext";
import QuantityControl from "./QuantityControl";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  function handleAdd() {
    if (quantity < 1) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setQuantity(1);
  }

  const stars = Math.round(product.rating?.rate ?? 0);

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={product.image}
          alt={product.title}
          className={styles.image}
          loading="lazy"
        />
      </div>

      <div className={styles.body}>
        <div className={styles.category}>{product.category}</div>
        <h2 className={styles.title}>{product.title}</h2>

        <div className={styles.meta}>
          <div className={styles.rating} aria-label={`Rating: ${product.rating?.rate} out of 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < stars ? styles.starFilled : styles.starEmpty}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
            <span className={styles.ratingCount}>
              ({product.rating?.count ?? 0})
            </span>
          </div>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
        </div>

        <div className={styles.actions}>
          <QuantityControl
            quantity={quantity}
            onChange={setQuantity}
            min={1}
            max={99}
          />
          <button
            className={`${styles.addBtn} ${added ? styles.added : ""}`}
            onClick={handleAdd}
            aria-label={`Add ${quantity} × ${product.title} to cart`}
          >
            {added ? "✓ Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    rating: PropTypes.shape({
      rate: PropTypes.number,
      count: PropTypes.number,
    }),
  }).isRequired,
};
