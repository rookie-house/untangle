'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

/**
 * AuthProvider component - handles auth store hydration on app startup
 * This ensures user data is restored from localStorage when the app loads
 */
export function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hydrate = useAuthStore((state) => state.hydrate);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    // Hydrate auth store from localStorage on mount
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
