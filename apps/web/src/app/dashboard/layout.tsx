import { Sidebar } from '@/components/sidebar/sidebar'
import { Header } from '@/components/header'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            {/* Main Content */}
            <div className="flex-1 pl-64">
                <Header />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}