'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, FileText, MessageSquare, Settings, CopyIcon, Menu } from 'lucide-react';
import { useSidebar } from '@/components/providers/sidebar-provider';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
  },
  {
    name: 'All Documents',
    href: '/all-documents',
    icon: FileText,
  },
  {
    name: 'Conversations',
    href: '/conversations',
    icon: MessageSquare,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle, isHydrated } = useSidebar();
  const { user } = useAuthStore();

  if (!isHydrated) {
    return null;
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-white transition-all duration-300 ease-in-out group',
        isOpen ? 'w-64' : 'w-16',
        'lg:hover:w-64', // Expand on hover for desktop
        !isOpen && '-translate-x-full lg:translate-x-0', // Hide on mobile when closed
        'lg:group-hover:w-64' // Support hover expansion
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo and Toggle */}
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <button
            onClick={toggle}
            className="p-2 h-fit w-fit hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div
            className={cn(
              'flex items-center gap-2 overflow-hidden transition-opacity duration-300',
              isOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'
            )}
          >
            <Image
              src="/logo.png"
              alt="Untangle Logo"
              width={100}
              height={100}
              className="h-[30px] w-auto"
            />
            <span className="font-semibold text-xl whitespace-nowrap">UnTangle</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg transition-all duration-200',
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100',
                    isOpen ? 'px-3 py-2' : 'px-2 py-2 justify-center'
                  )}
                  title={!isOpen ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={cn(
                      'transition-all duration-200',
                      isOpen
                        ? 'opacity-100'
                        : 'opacity-0 w-0 -ml-2 lg:group-hover:opacity-100 lg:group-hover:w-auto lg:group-hover:ml-0'
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="border-t p-4">
          <div
            className={cn(
              'flex items-center gap-3 transition-all duration-200',
              isOpen ? 'justify-start' : 'justify-center'
            )}
          >
            <div className="h-10 w-10 rounded-full bg-[#FFCECE] flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-[#4E4B4B]">
                <Image
                  src="https://github.com/shadcn.png"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </span>
            </div>
            <div
              className={cn(
                'flex items-center gap-3 transition-all duration-200 overflow-hidden',
                isOpen
                  ? 'opacity-100 w-auto'
                  : 'opacity-0 w-0 lg:group-hover:opacity-100 lg:group-hover:w-auto'
              )}
            >
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="truncate text-sm text-gray-500">{user?.email}</p>
              </div>
              <button
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                title="Copy email"
                onClick={() => navigator.clipboard.writeText('j.kow@gmail.com')}
              >
                <CopyIcon className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
