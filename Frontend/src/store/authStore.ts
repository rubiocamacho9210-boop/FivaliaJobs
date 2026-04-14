import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AuthUser } from '@/types/auth';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  needsProfileSetup: boolean;
  hasHydrated: boolean;
  setSession: (token: string, user: AuthUser) => void;
  setUser: (user: Partial<AuthUser>) => void;
  setNeedsProfileSetup: (value: boolean) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      needsProfileSetup: false,
      hasHydrated: false,
      setSession: (token, user) => set({ token, user }),
      setUser: (userUpdate) => set((state) => ({
        user: state.user ? { ...state.user, ...userUpdate } : null,
      })),
      setNeedsProfileSetup: (value) => set({ needsProfileSetup: value }),
      clearSession: () => set({ token: null, user: null, needsProfileSetup: false }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'fivalia-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        needsProfileSetup: state.needsProfileSetup,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const authStore = useAuthStore;
