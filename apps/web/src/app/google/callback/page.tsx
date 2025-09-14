"use client"
import React, { useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import TailwindBoxLoader from '@/app/_components/loader';

const page = () => {
   const searchParams = useSearchParams();
   const router = useRouter();
   const code = searchParams.get("code") as string;
   const state = searchParams.get("state") as string;

   console.log({ code, state });
   const { handleGoogleCallback } = useAuth();

   useEffect(() => {
    if (code) {
      const callbackResponse = handleGoogleCallback({ code });

      callbackResponse.then(res => {
        const token = res?.data?.token || '';
        localStorage.setItem('token', token);
        // After handling the callback, redirect to the desired page
        router.push('/dashboard'); // Change '/dashboard' to your desired route
      });
    }

  }, []);

  return (
    <div className='flex items-center justify-center w-screen h-screen'>
        <TailwindBoxLoader />
    </div>
  )
}

export default page