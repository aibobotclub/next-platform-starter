'use client';
import { useRouter } from 'next/navigation';
import styles from './ProductGrid.module.css';

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
    price: "50",
    desc: "5000 text translations/month, 2000 voice translations/month, 3 referral rewards/order",
    type: "pro",
    comingSoon: false
  },
  {
    name: "AIDA Enterprise",
    price: "500",
    desc: "Unlimited usage, advanced referral tasks, professional support service",
    type: "enterprise",
    comingSoon: true
  }
];

export default function ProductGrid() {
  const router = useRouter();

  const handleBuyClick = (product: Product) => {
    if (product.comingSoon) return;
    
    const params = new URLSearchParams({
      name: product.name,
      price: product.price,
      desc: product.desc,
      type: product.type
    });
    
    router.push(`/payment?${params.toString()}`);
  };

  return (
    <div className={styles.productGrid}>
      {products.map((p) => (
        <div
          className={styles.productCard}
          key={p.type}
        >
          <div className={styles.productName}>{p.name}</div>
          <div className={styles.productPrice}>{p.price} USDT</div>
          <div className={styles.productDesc}>{p.desc}</div>
          {p.comingSoon ? (
            <button className={styles.comingSoonBtn} disabled>Coming Soon</button>
          ) : (
            <button 
              className={styles.buyBtn}
              onClick={() => handleBuyClick(p)}
            >
              Buy Now
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
