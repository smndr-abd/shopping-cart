import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const FEATURES = [
  { icon: "◈", label: "Curated Selection", desc: "Only the finest products, hand-picked for quality and style." },
  { icon: "◎", label: "Secure Checkout", desc: "Your data stays private. Always." },
  { icon: "◇", label: "Free Returns", desc: "Changed your mind? Returns are effortless, no questions asked." },
];

const MARQUEE_ITEMS = [
  "New Arrivals", "Free Shipping Over $50", "Curated Essentials",
  "Premium Quality", "Artisan Goods", "Limited Drops",
];

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>SS — 2025 Collection</p>
          <h1 className={styles.heroTitle}>
            Objects of<br />
            <em>Considered</em><br />
            Desire
          </h1>
          <p className={styles.heroSub}>
            A vault of carefully chosen things. Nothing superfluous. Everything intentional.
          </p>
          <Link to="/shop" className={styles.heroBtn}>
            Enter the Shop
          </Link>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <div className={styles.circle1} />
          <div className={styles.circle2} />
          <div className={styles.circle3} />
          <div className={styles.grid} />
        </div>
      </section>

      {/* Marquee */}
      <div className={styles.marqueeTrack} aria-hidden="true">
        <div className={styles.marqueeInner}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>
              {item} <span className={styles.dot}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <div key={f.label} className={styles.featureCard}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <h3 className={styles.featureLabel}>{f.label}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <p className={styles.ctaEyebrow}>Browse the collection</p>
          <h2 className={styles.ctaTitle}>Everything you need.<br />Nothing you don't.</h2>
          <Link to="/shop" className={styles.ctaBtn}>
            Shop Now →
          </Link>
        </div>
      </section>
    </div>
  );
}
