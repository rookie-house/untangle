"use client";
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, FileText, MessageSquare, Settings, CopyIcon, LogOut } from 'lucide-react'

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        name: 'All Documents',
        href: '/documents',
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
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center gap-2 border-b px-6">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-xl flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="Untangle Logo"
                                width={100}
                                height={100}
                                className="h-[30px] w-auto"
                            />
                            UnTangle
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-full px-3 py-2 transition-colors ${isActive
                                    ? 'bg-blue-50 border border-blue-700 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Profile */}
                <div className="border-t p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="overflow-hidden rounded-full">
                                <Image
                                    src="https://github.com/shadcn.png"
                                    alt="User"
                                    width={100}
                                    height={100}
                                    className='size-full object-cover'
                                />
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900">John</p>
                            <p className="truncate text-sm text-gray-500">j.kow@gmail.com</p>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded">
                            {/* <Image
                                src="/icons/copy.svg"
                                alt="Copy email"
                                width={16}
                                height={16}
                            /> */}
                            <LogOut className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    )
}