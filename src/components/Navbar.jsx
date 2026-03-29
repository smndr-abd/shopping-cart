import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <NavLink to="/" className={styles.brand}>
        VAULT
      </NavLink>

      <ul className={styles.links} role="list">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            Shop
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `${styles.cartLink} ${isActive ? styles.active : ""}`
            }
            aria-label={`Cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          >
            <CartIcon />
            {totalItems > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

function CartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
