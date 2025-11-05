'use client';

import { Sidebar } from '@/components/sidebar/sidebar';
import { Header } from '@/components/header';
import { useSidebar } from '@/components/providers/sidebar-provider';

function HomeLayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen, toggle } = useSidebar();

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
