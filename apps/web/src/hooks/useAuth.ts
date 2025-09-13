import { signupSchema, authSchema } from "../lib/validations/auth.validation";
import { create } from "zustand";
import { signup, signin, googleSignIn, googleCallback } from "../lib/api/auth";

type User = any;

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

import { useState } from "react";

export function useAuth() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      signupSchema.parse(data);
      const res = await signup(data);
      setUser(res.data.user);
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Signup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      authSchema.parse(data);
      const res = await signin(data);
      setUser(res.data.user);
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Signin failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleSignIn();
      if (res.data?.url) {
        window.location.href = res.data.url.url;
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Google sign-in failed"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCallback = async (params: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleCallback(params);
      setUser(res.data.user);
      return res.data;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Google callback failed"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    handleSignup,
    handleSignin,
    handleGoogleSignIn,
    handleGoogleCallback,
  };
}
