'use client';
import { useState } from 'react';
import styles from './ProductGrid.module.css';
import ProductDetailModal from './ProductDetailModal';

interface Product {
  name: string;
  price: string;
  desc: string;
  type: string;
  comingSoon: boolean;
}

const products: Product[] = [
  {
    name: "AIDA PRO",
    price: "50 USDT",
    desc: "5000 text translations/month, 2000 voice translations/month, 3 referral rewards/order",
    type: "pro",
    comingSoon: false
  },
  {
    name: "AIDA Enterprise",
    price: "500 USDT",
    desc: "Unlimited usage, advanced referral tasks, professional support service",
    type: "enterprise",
    comingSoon: true
  }
];

export default function ProductGrid() {
  const [selected, setSelected] = useState<Product | null>(null);
  return (
    <>
      <div className={styles.productGrid}>
        {products.map((p) => (
          <div
            className={styles.productCard}
            key={p.type}
            onClick={() => !p.comingSoon && setSelected(p)}
          >
            <div className={styles.productName}>{p.name}</div>
            <div className={styles.productPrice}>{p.price}</div>
            <div className={styles.productDesc}>{p.desc}</div>
            {p.comingSoon ? (
              <button className={styles.comingSoonBtn} disabled>Coming Soon</button>
            ) : (
              <button className={styles.buyBtn}>Buy Now</button>
            )}
          </div>
        ))}
      </div>
      {selected && <ProductDetailModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
