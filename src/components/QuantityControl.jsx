import PropTypes from "prop-types";
import styles from "./QuantityControl.module.css";

export default function QuantityControl({ quantity, onChange, min = 0, max = 99 }) {
  function handleInput(e) {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) onChange(Math.min(Math.max(val, min), max));
  }

  function handleBlur(e) {
    if (e.target.value === "") onChange(min);
  }

  return (
    <div className={styles.control} role="group" aria-label="Quantity">
      <button
        className={styles.btn}
        onClick={() => onChange(Math.max(quantity - 1, min))}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        className={styles.input}
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={handleInput}
        onBlur={handleBlur}
        aria-label="Quantity"
      />
      <button
        className={styles.btn}
        onClick={() => onChange(Math.min(quantity + 1, max))}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

QuantityControl.propTypes = {
  quantity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};
