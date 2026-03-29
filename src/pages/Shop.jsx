import { useState } from "react";
import { useFakeStore, useCategories } from "../hooks/useFakeStore";
import ProductCard from "../components/ProductCard";
import styles from "./Shop.module.css";

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState(null);
  const { products, loading, error } = useFakeStore(activeCategory);
  const { categories } = useCategories();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.eyebrow}>The Collection</p>
          <h1 className={styles.title}>Shop</h1>
        </div>

        <div className={styles.filters} role="group" aria-label="Filter by category">
          {categories.map((cat) => {
            const isActive = cat === "all" ? activeCategory === null : activeCategory === cat;
            return (
              <button
                key={cat}
                className={`${styles.filterBtn} ${isActive ? styles.filterActive : ""}`}
                onClick={() => setActiveCategory(cat === "all" ? null : cat)}
                aria-pressed={isActive}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className={styles.error} role="alert">
          <p>Failed to load products: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {loading && (
        <div className={styles.skeletonGrid} aria-label="Loading products" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      )}

      {!loading && !error && (
        <>
          <p className={styles.count} aria-live="polite">
            {products.length} item{products.length !== 1 ? "s" : ""}
          </p>
          <div className={styles.grid}>
            {products.map((product, i) => (
              <div
                key={product.id}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
