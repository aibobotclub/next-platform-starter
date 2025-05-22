"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, Apple, Lock } from "lucide-react";
import styles from "./Download.module.css";

export default function DownloadSection() {
  return (
    <section id="download" className={styles.section}>
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.title}>Download AIDA Now</h2>
          <p className={styles.description}>
            Experience the power of AI-driven communication. Download AIDA today and 
            start breaking down language barriers with ease.
          </p>
          
          <div className={styles.downloadOptions}>
            <motion.a
              href="#"
              className={styles.downloadButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className={styles.icon} />
              <span>Download for Android</span>
            </motion.a>
            <div className={styles.downloadButtonDisabled}>
              <Apple className={styles.icon} />
              <span>iOS Version Coming Soon</span>
              <Lock className={styles.lockIcon} />
            </div>
          </div>
          
          <motion.a
            href="#"
            className={styles.learnMore}
            whileHover={{ x: 5 }}
          >
            Learn more about AIDA
            <ArrowRight className={styles.arrowIcon} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
} 