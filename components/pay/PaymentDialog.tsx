import { createPortal } from "react-dom";
import PaymentForm from "./PaymentForm";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  productName: string;
  productDescription: string;
  product?: any;
  zIndex?: number;
}


export default function PaymentDialog({
  open,
  onClose,
  onSuccess,
  productName,
  productDescription,
  product,
  zIndex = 1102,
}: PaymentDialogProps) {
  if (!open) return null;

  return createPortal(
    <div className="overlay" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex,
      paddingBottom: 72, // 预留tabbar高度
    }}>
      <div className="modal" style={{marginBottom: 72}}>
        <PaymentForm
          onClose={onClose}
          onSuccess={onSuccess}
          productName={productName}
          productDescription={productDescription}
          product={product}
        />
      </div>
    </div>,
    document.body
  );
}
