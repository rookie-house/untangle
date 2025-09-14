export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="p-4 bg-gray-100">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </header>
            <main className="flex-1 p-8">
                {children}
            </main>
            <footer className="p-4 bg-gray-100 text-center">
                &copy; {new Date().getFullYear()} Untangle
            </footer>
        </div>
    )
}