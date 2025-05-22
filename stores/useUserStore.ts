import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  isLoggedIn: boolean
  isRegistered: boolean
  isLoading: boolean
  error: string | null
  registrationError: string | null
  checkRegistrationError: string | null
  setLoggedIn: (status: boolean) => void
  setRegistered: (status: boolean) => void
  setLoading: (status: boolean) => void
  setError: (error: string | null) => void
  setRegistrationError: (error: string | null) => void
  setCheckRegistrationError: (error: string | null) => void
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
      registrationError: null,
      checkRegistrationError: null,
      setLoggedIn: (status) => set({ isLoggedIn: status }),
      setRegistered: (status) => set({ isRegistered: status }),
      setLoading: (status) => set({ isLoading: status }),
      setError: (error) => set({ error }),
      setRegistrationError: (error) => set({ registrationError: error }),
      setCheckRegistrationError: (error) => set({ checkRegistrationError: error }),
      resetState: () => set({
        isLoggedIn: false,
        isRegistered: false,
        isLoading: false,
        error: null,
        registrationError: null,
        checkRegistrationError: null
      }),
      resetUserState: () => set({
        isLoggedIn: false,
        isRegistered: false,
        isLoading: false,
        error: null,
        registrationError: null,
        checkRegistrationError: null
      }),
    }),
    {
      name: 'user-storage',
    }
  )
) 