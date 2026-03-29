import PropTypes from "prop-types";
import { useCart } from "../context/CartContext";
import QuantityControl from "./QuantityControl";
import styles from "./CartItem.module.css";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className={styles.item} data-testid="cart-item">
      <div className={styles.imageWrap}>
        <img src={item.image} alt={item.title} className={styles.image} />
      </div>

      <div className={styles.details}>
        <div className={styles.category}>{item.category}</div>
        <h3 className={styles.title}>{item.title}</h3>
        <span className={styles.unitPrice}>${item.price.toFixed(2)} each</span>
      </div>

      <div className={styles.right}>
        <QuantityControl
          quantity={item.quantity}
          onChange={(q) => updateQuantity(item.id, q)}
          min={0}
          max={99}
        />
        <span className={styles.subtotal}>
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        <button
          className={styles.remove}
          onClick={() => removeItem(item.id)}
          aria-label={`Remove ${item.title} from cart`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};
