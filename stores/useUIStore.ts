import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  isLoggedIn: boolean
  isRegistered: boolean
  isLoading: boolean
  error: string | null
  setLoggedIn: (status: boolean) => void
  setRegistered: (status: boolean) => void
  setLoading: (status: boolean) => void
  setError: (error: string | null) => void
  resetState: () => void
  resetUserState: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      isRegistered: false,
      isLoading: false,
      error: null,
      setLoggedIn: (status) => set({ isLoggedIn: status }),
      setRegistered: (status) => set({ isRegistered: status }),
      setLoading: (status) => set({ isLoading: status }),
      setError: (error) => set({ error }),
      resetState: () => set({
        isLoggedIn: false,
        isRegistered: false,
        isLoading: false,
        error: null,
      }),
      resetUserState: () => set({
        isLoggedIn: false,
        isRegistered: false,
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'user-storage',
    }
  )
) 