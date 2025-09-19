import React from 'react'

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                {children}
            </main>
            <footer className="p-4 bg-background text-sm text-center">
                &copy; {new Date().getFullYear()} Untangle
            </footer>
        </div>
    )
}