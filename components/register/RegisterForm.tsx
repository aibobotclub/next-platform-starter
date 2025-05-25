"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import styles from "./RegisterForm.module.css";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppKit } from '@/hooks/useAppKit';
import { useSearchParams, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useRegisterForm, RegisterFormValues } from '@/hooks/useRegisterForm';
import { useUserStatus } from '@/hooks/useUserStatus';
import { useReferral } from '@/hooks/useReferral';
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { supabase } from '@/lib/supabase';

interface RegisterFormProps {
  onClose?: () => void;
  referrerAddress?: string | null;
}

export default function RegisterForm({ onClose, referrerAddress }: RegisterFormProps) {
  const [mounted, setMounted] = useState(false);
  const { address } = useAppKit();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { form, isLoading: isFormLoading, setIsLoading, error, setError, resetForm } = useRegisterForm();
  const { isRegistered, refresh } = useUserStatus();
  const { register: registerOnChain, isLoading: isChainLoading } = useReferral();

  const COMPANY_ADDRESS = "0xfAaac7bcd4f371A4f13f61E63e7e2B7d669427b1";
  const [refInfo, setRefInfo] = useState<{address: string, username?: string} | null>(null);

  // 解析推荐人地址
  useEffect(() => {
    let refWallet = referrerAddress || searchParams?.get("referral") || COMPANY_ADDRESS;
    if (refWallet && /^0x[a-fA-F0-9]{40}$/.test(refWallet) && refWallet.toLowerCase() !== COMPANY_ADDRESS.toLowerCase()) {
      // 查询 supabase 用户名
      supabase.from('users').select('username').eq('wallet_address', refWallet).single().then(res => {
        setRefInfo({ address: refWallet, username: res.data?.username ?? undefined });
        console.log('[RegisterForm] 推荐人地址:', refWallet, '用户名:', res.data?.username);
      });
    } else {
      setRefInfo(null);
      console.log('[RegisterForm] 未检测到推荐人，将默认绑定公司账户');
    }
  }, [referrerAddress, searchParams]);

  useEffect(() => { 
    setMounted(true); 
  }, []);

  useEffect(() => {
    if (isRegistered && onClose) {
      onClose();
    }
  }, [isRegistered, onClose]);

  // 如果钱包未连接或用户已注册，不显示表单
  if (!address || isRegistered) {
    return null;
  }

  const handleRegisterAndBind = async (values: RegisterFormValues) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    // 优先级：props > url > 公司地址
    const refWallet = referrerAddress || searchParams?.get("referral") || COMPANY_ADDRESS;
    if (refWallet && !/^0x[a-fA-F0-9]{40}$/.test(refWallet)) {
      toast.error("Invalid referral address");
      return;
    }

    setIsLoading(true);

    try {
      // 1. On-chain registration and referral binding
      await registerOnChain(refWallet || undefined);

      // 2. Register user info via Edge Function
      const REGISTER_USER_URL = `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}/register-user`;
      
      const response = await fetch(REGISTER_USER_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: values.email,
          username: values.username,
          password: values.password,
          wallet_address: address,
          referrer_wallet_address: refWallet
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed");
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Registration successful! Please login");
      resetForm();
      await refresh();
      router.replace("/dashboard");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoading = isFormLoading || isChainLoading;

  const renderFormField = (
    name: keyof RegisterFormValues,
    label: string,
    type: string = "text",
    placeholder: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: { field: ControllerRenderProps<RegisterFormValues, keyof RegisterFormValues> }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              {...field}
              className={styles.input}
            />
          </FormControl>
          <FormMessage className={styles.errorMessage} />
        </FormItem>
      )}
    />
  );

  const formContent = (
    <div className={styles.modalOverlay}>
      <div className={styles.formContainer}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegisterAndBind)} className={styles.form}>
            <h2 className={styles.title}>Create Account</h2>
            <div className={styles.walletAddressButton}>
              {address && `${address.slice(0, 6)}...${address.slice(-4)}`}
            </div>
            <div style={{marginBottom: 10, textAlign: 'center', fontSize: '0.9em'}}>
              {refInfo ? (
                <>
                  <div style={{fontWeight: 600, color: '#6366f1', fontSize: 13}}>
                    Referrer: {refInfo.address.slice(0,6)}...{refInfo.address.slice(-4)}
                  </div>
                  {refInfo.username && <div style={{color:'#64748b', fontSize:12}}>Username: {refInfo.username}</div>}
                </>
              ) : (
                <div style={{color:'#a0aec0', fontSize:12, fontWeight:500, padding:'2px 0'}}>Referrer not detected.</div>
              )}
            </div>
            {renderFormField("username", "Username", "text", "Enter your username")}
            {renderFormField("email", "Email", "email", "Enter your email")}
            {renderFormField("password", "Password", "password", "Enter your password")}
            {renderFormField("confirmPassword", "Confirm Password", "password", "Confirm your password")}
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
            {error && (
              <Alert variant="destructive" className={styles.errorAlert}>
                {error}
              </Alert>
            )}
            {onClose && (
              <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Close">
                ×
              </button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(formContent, document.body);
}
