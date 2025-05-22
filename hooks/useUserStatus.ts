import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/useUserStore'

export function useUserStatus() {
  const { address } = useAccount()
  const [status, setStatus] = useState<{
    isRegistered: boolean;
    isLoading: boolean;
    user: any;
    error: string | null;
  }>({
    isRegistered: false,
    isLoading: true,
    user: null,
    error: null
  })
  const [refreshFlag, setRefreshFlag] = useState(0)
  const refresh = useCallback(() => setRefreshFlag(f => f + 1), [])

  // 全局 store
  const { setRegistered, setLoggedIn, setLoading } = useUserStore();

  useEffect(() => {
    if (!address) {
      setStatus({
        isRegistered: false,
        isLoading: false,
        user: null,
        error: null
      });
      setRegistered(false);
      setLoggedIn(false);
      setLoading(false);
      return;
    }
    setStatus(s => ({ ...s, isLoading: true, error: null }));
    setLoading(true);

    (async () => {
      try {
        // 你可以改成调用 edge function: check-user
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('wallet_address', address)
          .maybeSingle()
        const isReg = !!data;
        setStatus({
          isRegistered: isReg,
          isLoading: false,
          user: data,
          error: error?.message || null
        });
        setRegistered(isReg);
        setLoggedIn(isReg);
        setLoading(false);
      } catch (err: any) {
        setStatus({
          isRegistered: false,
          isLoading: false,
          user: null,
          error: err.message
        });
        setRegistered(false);
        setLoggedIn(false);
        setLoading(false);
      }
    })()
  }, [address, refreshFlag])

  return { ...status, refresh }
} 