import { signupSchema, authSchema } from "../lib/validations/auth.validation";
import { create } from "zustand";
import { signup, signin, googleSignIn, googleCallback } from "../lib/api/auth";

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

import { useState } from "react";
import Error from "next/error";

function extractErrorMessage(err: unknown, fallback: string) {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
    const apiMsg = (err as { response?: { data?: { message?: unknown } } })
      ?.response?.data?.message;
    if (typeof apiMsg === "string") return apiMsg;
  }
  return fallback;
}

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
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, "Signup failed");
      setError(errorMessage);
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
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, "Signin failed");
      setError(errorMessage);
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
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, "Google sign-in failed");
      setError(errorMessage);
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
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, "Google callback failed");
      setError(errorMessage);
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
