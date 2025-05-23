import { createPortal } from "react-dom";
import PaymentForm from "./PaymentForm";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  productName: string;
  productDescription: string;
  product?: any;
}


export default function PaymentDialog({
  open,
  onClose,
  onSuccess,
  productName,
  productDescription,
  product,
}: PaymentDialogProps) {
  if (!open) return null;

  return createPortal(
    <div className="overlay">
      <div className="modal">
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
