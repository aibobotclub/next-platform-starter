import { Button } from "@/components/ui/button";
import styles from "./RegisterButton.module.css";

interface RegisterButtonProps {
  isLoading: boolean;
  onClick?: () => void;
}

export default function RegisterButton({ isLoading, onClick }: RegisterButtonProps) {
  return (
    <Button
      className={styles.registerButton}
      disabled={isLoading}
      type="button"
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Creating Account...</span>
        </div>
      ) : (
        "Create Account"
      )}
    </Button>
  );
}
