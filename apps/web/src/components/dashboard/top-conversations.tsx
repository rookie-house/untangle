import { Card } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"

interface TopConversation {
    id: string
    source: string
    percentage: string
    icon: string
    color: string
}

const conversations: TopConversation[] = [
    {
        id: "1",
        source: "news.google.com",
        percentage: "15%",
        icon: "/icons/google.svg",
        color: "bg-blue-500"
    },
    {
        id: "2",
        source: "techcrunch.com",
        percentage: "35%",
        icon: "/icons/techcrunch.svg",
        color: "bg-green-500"
    },
    {
        id: "3",
        source: "news.mit.edu",
        percentage: "50%",
        icon: "/icons/mit.svg",
        color: "bg-gray-900"
    }
]

export function TopConversations() {
    return (
        <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-lg font-semibold">Top Conversations</h2>
                    <p className="text-sm text-gray-500">List of popular sources</p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </button>
            </div>

            {/* Progress Bars */}
            <div className="h-2 flex gap-0.5 mb-6">
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        className={`${conv.color} h-full`}
                        style={{ width: conv.percentage }}
                    />
                ))}
            </div>

            {/* Conversation List */}
            <div className="space-y-4">
                {conversations.map((conv) => (
                    <div key={conv.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            {/* Fallback if image fails to load */}
                            <div className="w-4 h-4 bg-gray-400" />
                        </div>
                        <span className="flex-1 text-sm">{conv.source}</span>
                        <span className="text-sm font-medium bg-gray-50 px-2 py-1 rounded">
                            {conv.percentage}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    )
}