import { create } from "zustand";

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
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));