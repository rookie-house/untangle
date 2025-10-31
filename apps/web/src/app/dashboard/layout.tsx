'use client'

import { Sidebar } from '@/components/sidebar/sidebar'
import { Header } from '@/components/header'
import { SidebarProvider, useSidebar } from '@/components/providers/sidebar-provider'
import { SidebarContext } from '@/components/providers/sidebar-provider'
import { useContext } from 'react'

function DashboardLayoutContent({
    children,
}: {
    children: React.ReactNode
}) {
    const { isOpen } = useSidebar()

    return (
        <div className="flex min-h-screen bg-[#F0F4F9]">
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-green-500/50 transition-all lg:hidden"
                    onClick={() => useSidebar().toggle()}
                />
            )}
            <Sidebar />
            {/* Main Content */}
            <div
                className="flex-1 transition-all duration-300 ease-in-out"
                style={{
                    marginLeft: isOpen ? "16rem" : "4rem"
                }}
            >
                <Header />
                <main className="flex-1 h-fit w-full p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <DashboardLayoutContent>
            {children}
        </DashboardLayoutContent>
    )
}