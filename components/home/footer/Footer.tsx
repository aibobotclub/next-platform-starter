import React from "react";
import styles from "./Footer.module.css";
import { Github, Twitter, Mail, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* 品牌区 */}
        <div className={styles.footerBrand}>
          <div className={styles.footerBrandLogo}>AIDA</div>
          <div className={styles.footerBrandDesc}>
            Empowering Global Communication with AI Technology
          </div>
          <div className={styles.footerSocial}>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className={styles.footerSocialIcon} />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Twitter className={styles.footerSocialIcon} />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className={styles.footerSocialIcon} />
            </a>
            <a
              href="mailto:contact@aida.com"
              aria-label="Email"
            >
              <Mail className={styles.footerSocialIcon} />
            </a>
          </div>
        </div>
        {/* 菜单区（只保留一组） */}
        <div className={styles.footerLinks}>
          <div className={styles.footerLinkGroupSingle}>
            <a href="#docs" className={styles.footerLink}>Docs</a>
            <a href="#blog" className={styles.footerLink}>Blog</a>
            <a href="#support" className={styles.footerLink}>Support</a>
          </div>
        </div>
      </div>
      <div className={styles.footerCopyright}>
        © {new Date().getFullYear()} AIDA. All rights reserved.
      </div>
    </footer>
  );
}
