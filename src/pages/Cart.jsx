import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import styles from "./Cart.module.css";

export default function Cart() {
  const { cart, totalItems, totalPrice, clearCart } = useCart();
  const isEmpty = cart.length === 0;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Your Selection</p>
            <h1 className={styles.title}>Cart</h1>
          </div>
          {!isEmpty && (
            <button
              className={styles.clearBtn}
              onClick={clearCart}
              aria-label="Clear all items from cart"
            >
              Clear all
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden="true">◎</div>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptySub}>
              Nothing here yet. Head to the shop and find something you love.
            </p>
            <Link to="/shop" className={styles.shopLink}>
              Browse the Shop →
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.items}>
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <aside className={styles.summary}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>Order Summary</h2>

                <dl className={styles.summaryRows}>
                  <div className={styles.summaryRow}>
                    <dt>Items ({totalItems})</dt>
                    <dd>${totalPrice.toFixed(2)}</dd>
                  </div>
                  <div className={styles.summaryRow}>
                    <dt>Shipping</dt>
                    <dd className={styles.free}>
                      {totalPrice >= 50 ? "Free" : "$4.99"}
                    </dd>
                  </div>
                  {totalPrice < 50 && (
                    <div className={styles.freeShippingNote}>
                      Add ${(50 - totalPrice).toFixed(2)} more for free shipping
                    </div>
                  )}
                </dl>

                <div className={styles.divider} />

                <div className={styles.total}>
                  <span>Total</span>
                  <span>
                    ${(totalPrice + (totalPrice >= 50 ? 0 : 4.99)).toFixed(2)}
                  </span>
                </div>

                <button className={styles.checkoutBtn} aria-label="Proceed to checkout">
                  Checkout
                </button>

                <Link to="/shop" className={styles.continueLink}>
                  ← Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
