import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  name: string;
  email: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
};

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => {
        set({ user });
      },
      logout: () => {
        set({ user: null });
      },
      hydrate: () => {
        // Load from localStorage on app startup
        try {
          const stored = localStorage.getItem('auth-store');
          if (stored) {
            const parsed = JSON.parse(stored);
            const user = parsed.state?.user || null;
            if (user) {
              console.log('Hydrated user from localStorage:', user);
              set({ user });
            }
          }
        } catch (error) {
          console.error('Failed to hydrate auth store:', error);
          localStorage.removeItem('auth-store');
        }
      },
    }),
    {
      name: 'auth-store', // localStorage key
      skipHydration: true, // We'll handle hydration manually
    }
  )
);
