import styles from "./DetailDrawer.module.css";
import { ReactNode, useState, useEffect } from "react";

interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  title?: string;
}

export default function DetailDrawer({ open, onClose, children, title = "Details" }: DetailDrawerProps) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) setClosing(false);
  }, [open]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!open && !closing) return null;
  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.drawer + (closing ? ' ' + styles.drawerClosing : '')} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <span>{title}</span>
          <button className={styles.closeBtn} style={{fontSize:'2.2rem',width:48,height:48}} onClick={handleClose} aria-label="Close">×</button>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
} 