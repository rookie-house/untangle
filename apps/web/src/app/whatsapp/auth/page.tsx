'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WhatsappAuthPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sessionIdParam = searchParams.get('sessionId');
    setSessionId(sessionIdParam);
    setIsLoading(false);
    console.log('Session ID:', sessionIdParam); // Debug log
  }, []);

  const handleRedirect = (action: 'login' | 'signup') => {
    if (sessionId) {
      router.push(`/${action}?sessionId=${encodeURIComponent(sessionId)}`);
    }
    // Do nothing if sessionId is not provided
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6">
        <span className="text-lg font-semibold">Choose an action for WhatsApp Auth</span>
        {isLoading ? (
          <div className="text-gray-500">Loading...</div>
        ) : sessionId ? (
          <div className="flex flex-col gap-4">
            <button
              className="px-6 py-2 rounded bg-primary text-white font-bold hover:bg-primary/80 transition"
              onClick={() => handleRedirect('login')}
            >
              Login
            </button>
            <button
              className="px-6 py-2 rounded bg-secondary text-white font-bold hover:bg-secondary/80 transition"
              onClick={() => handleRedirect('signup')}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="mt-4 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">!</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Authentication Required</h3>
              <p className="text-red-700 mb-4">
                No valid session ID found. WhatsApp authentication requires a valid session
                identifier.
              </p>
              <div className="bg-red-100 p-3 rounded border border-red-300 text-sm text-red-800">
                <strong>Note:</strong> Please ensure you accessed this page through a valid WhatsApp
                authentication link or contact support if you believe this is an error.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
