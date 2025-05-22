"use client";

import { motion } from "framer-motion";
import { Bot, Globe, Shield, Zap } from "lucide-react";
import styles from "./Features.module.css";

const features = [
  {
    icon: <Bot className={styles.icon} />,
    title: "AI Assistant",
    description: "Advanced AI technology to help you break through language barriers and communicate freely."
  },
  {
    icon: <Globe className={styles.icon} />,
    title: "Global Communication",
    description: "Support for multiple languages, enabling seamless communication worldwide."
  },
  {
    icon: <Shield className={styles.icon} />,
    title: "Secure & Private",
    description: "Your conversations are protected with end-to-end encryption and strict privacy policies."
  },
  {
    icon: <Zap className={styles.icon} />,
    title: "Fast & Efficient",
    description: "Lightning-fast response times and efficient processing for a smooth user experience."
  }
];

export default function Features() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.container}>
        <motion.h2 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why Choose AIDA?
        </motion.h2>
        
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.description}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 