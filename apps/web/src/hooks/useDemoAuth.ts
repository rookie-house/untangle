"use client";

import { useState } from "react";
import { mockUser } from "@/lib/demo-data";

export function useDemoAuth() {
  const [user, setUser] = useState(mockUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    user,
    loading,
    error,
    setUser,
  };
}
