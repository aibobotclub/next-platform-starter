"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import styles from "./Pricing.module.css";

const plans = [
  {
    name: "Pro",
    price: "$50",
    period: "/year",
    features: [
      "All basic features",
      "5000 text translations/month",
      "2000 voice translations/month",
      "3 referral rewards/month"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$500",
    period: "/year",
    features: [
      "Unlimited usage",
      "Advanced referral tasks",
      "Professional support service"
    ],
    comingSoon: true
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.container}>
        <motion.h2 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Choose Your Plan
        </motion.h2>
        
        <div className={styles.grid}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`${styles.card} ${plan.popular ? styles.popular : ""}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>Most Popular</div>
              )}
              <h3 className={styles.planName}>{plan.name}</h3>
              <div className={styles.priceWrapper}>
                <span className={styles.price}>{plan.price}</span>
                {plan.period && <span className={styles.period}>{plan.period}</span>}
              </div>
              <ul className={styles.features}>
                {plan.features.map((feature) => (
                  <li key={feature} className={styles.feature}>
                    <Check className={styles.checkIcon} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.comingSoon ? (
                <button className={styles.button} disabled style={{ opacity: 0.7, cursor: "not-allowed" }}>
                  Coming Soon
                </button>
              ) : (
                <button className={styles.button}>
                  Get Started
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 