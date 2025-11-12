import { signupSchema, authSchema } from '../lib/validation/auth.schema';

import api from '@/lib/api';

import { useAuthStore } from '../store/auth.store';
import { useState } from 'react';

function extractErrorMessage(err: unknown, fallback: string) {
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object') {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === 'string') return msg;
    const apiMsg = (err as { response?: { data?: { message?: unknown } } })?.response?.data
      ?.message;
    if (typeof apiMsg === 'string') return apiMsg;
  }
  return fallback;
}

export function useAuth() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (
    data: {
      name: string;
      email: string;
      password: string;
    },
    sessionId?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      signupSchema.parse(data);
      const res = await api.auth.signup(data, sessionId);
      setUser(res.data.user);
      return res.data;
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, 'Signup failed');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (data: { email: string; password: string }, sessionId?: string) => {
    setLoading(true);
    setError(null);
    try {
      authSchema.parse(data);
      const res = await api.auth.signin(data, sessionId);
      setUser(res.data.data.user);
      localStorage.setItem('token', res.data.data.token);
      return res.data;
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, 'Signin failed');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (sessionId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.auth.googleSignIn(sessionId);
      if (res.data?.url) {
        // console.log(res.data.url)
        window.location.href = res.data.url;
      }
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, 'Google sign-in failed');
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
      const res = await api.auth.googleCallback(params);
      setUser(res.data.user);
      return res.data;
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, 'Google callback failed');
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
