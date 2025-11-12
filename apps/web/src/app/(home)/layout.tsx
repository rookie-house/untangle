'use client';

import { Sidebar } from '@/components/sidebar/sidebar';
import { Header } from '@/components/header';
import { useSidebar } from '@/components/providers/sidebar-provider';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

function HomeLayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen, toggle } = useSidebar();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Redirect to login if no user (after hydration attempt)
    if (user === null) {
      // Add a small delay to ensure hydration has completed
      const timer = setTimeout(() => {
        const currentUser = useAuthStore.getState().user;
        if (currentUser === null) {
          // Uncomment when ready to enable redirection
          router.push('/login');
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen bg-[#F0F4F9]">
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-all lg:hidden"
          onClick={() => toggle()}
        />
      )}
      <Sidebar />
      {/* Main Content */}
      <div
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isOpen ? '16rem' : '4rem',
        }}
      >
        <Header />
        <main className="flex-1 h-fit w-full p-6">{children}</main>
      </div>
    </div>
  );
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <HomeLayoutContent>{children}</HomeLayoutContent>;
}
