import { create } from 'zustand';
import { secureStorage } from '@/services/secureStorage';
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
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  token: null,
  user: null,
  needsProfileSetup: false,
  hasHydrated: false,
  
  setSession: async (token, user) => {
    await secureStorage.setToken(token);
    await secureStorage.setUser(JSON.stringify(user));
    await secureStorage.setNeedsProfileSetup(false);
    set({ token, user, needsProfileSetup: false });
  },
  
  setUser: async (userUpdate) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userUpdate };
      await secureStorage.setUser(JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },
  
  setNeedsProfileSetup: async (value) => {
    await secureStorage.setNeedsProfileSetup(value);
    set({ needsProfileSetup: value });
  },
  
  clearSession: async () => {
    await secureStorage.clearAll();
    set({ token: null, user: null, needsProfileSetup: false });
  },
  
  setHasHydrated: (value) => set({ hasHydrated: value }),
  
  hydrate: async () => {
    try {
      const [token, userJson, needsProfile] = await Promise.all([
        secureStorage.getToken(),
        secureStorage.getUser(),
        secureStorage.getNeedsProfileSetup(),
      ]);
      
      const user = userJson ? JSON.parse(userJson) : null;
      set({
        token,
        user,
        needsProfileSetup: needsProfile,
        hasHydrated: true,
      });
    } catch (error) {
      console.error('Failed to hydrate auth state');
      set({ hasHydrated: true });
    }
  },
}));

export const authStore = useAuthStore;
