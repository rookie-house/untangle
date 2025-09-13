import { useState } from "react";
import { signup, signin, googleSignIn, googleCallback } from "../lib/api/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
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
      const res = await signup(data);
      setUser(res.data.user);
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await signin(data);
      setUser(res.data.user);
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  // Google sign-in flow would be handled via redirect or popup
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleSignIn();
    //   Redirect to Google auth URL
      if (res.data?.url) {
        window.location.href = res.data.url.url;
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Google sign-in failed"
      );
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
    }   finally {
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
    handleGoogleCallback
  };
}
