import { createPortal } from "react-dom";
import PaymentForm from "./PaymentForm";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // ✅ 添加这一行
  productName: string;
  productDescription: string;
}


export default function PaymentDialog({
  open,
  onClose,
  productName,
  productDescription,
}: PaymentDialogProps) {
  if (!open) return null;

  return createPortal(
    <div className="overlay">
      <div className="modal">
        <PaymentForm
          onClose={onClose}
          onSuccess={onClose}
          productName={productName}
          productDescription={productDescription}
        />
      </div>
    </div>,
    document.body
  );
}
