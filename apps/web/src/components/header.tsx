import { Bell } from "lucide-react"
import { SearchBar } from "@/components/search-bar"

export function Header() {
    return (
        <header className="sticky top-0 z-10 w-full border-b bg-[#F0F4F9]">
            <div className="flex h-16 items-center px-6 justify-between">
                <SearchBar />

                <div className="flex items-center gap-4">
                    <button className="relative inline-flex items-center justify-center">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[11px] font-medium text-white flex items-center justify-center">
                            1
                        </span>
                    </button>
                </div>
            </div>
        </header>
    )
}