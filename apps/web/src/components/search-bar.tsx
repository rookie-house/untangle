import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
    return (
        <div className="relative w-full max-w-[440px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
                type="search"
                placeholder="Search for article, video or document"
                className="w-full pl-10 pr-4 h-10 bg-white rounded-full border border-gray-200 focus-visible:ring-blue-500"
            />
        </div>
    )
}