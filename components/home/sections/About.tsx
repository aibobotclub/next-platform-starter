"use client";

import { motion } from "framer-motion";
import { Users, Code, Globe } from "lucide-react";
import styles from "./About.module.css";

const stats = [
  {
    icon: <Users className={styles.icon} />,
    value: "1M+",
    label: "Active Users"
  },
  {
    icon: <Code className={styles.icon} />,
    value: "50+",
    label: "Languages"
  },
  {
    icon: <Globe className={styles.icon} />,
    value: "100+",
    label: "Countries"
  }
];

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.title}>About AIDA</h2>
          <p className={styles.description}>
            AIDA is a revolutionary AI-powered platform that breaks down language barriers 
            and enables seamless global communication. Our advanced technology combines 
            natural language processing with machine learning to provide real-time 
            translation and cultural context understanding.
          </p>
          
          <div className={styles.stats}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={styles.statCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.iconWrapper}>
                  {stat.icon}
                </div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 