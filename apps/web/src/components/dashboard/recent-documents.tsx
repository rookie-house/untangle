import { ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"

interface RecentDocument {
  id: string
  title: string
  timeAgo: string
  image: string
}

const recentDocuments: RecentDocument[] = [
  {
    id: "1",
    title: "Analyzing Driving License Agreements.",
    timeAgo: "1 day ago",
    image: "/images/documents/license.png"
  },
  {
    id: "2",
    title: "Summarizing Terms and Conditions for Upstock.",
    timeAgo: "1 day ago",
    image: "/images/documents/terms.png"
  },
  {
    id: "3",
    title: "Documents required to apply for PAN card",
    timeAgo: "1 day ago",
    image: "/images/documents/pan.png"
  }
]

export function RecentDocuments() {
  return (
    <Card className="col-span-2 border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Recent Documents</h2>
            <p className="text-sm text-gray-500">Check out your recent summaries</p>
          </div>
          <span className="text-sm text-gray-500">3 summaries</span>
        </div>

        <div className="space-y-4">
          {recentDocuments.map((doc) => (
            <div
              key={doc.id}
              className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-gray-50"
            >
              <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                {/* Fallback gradient if image fails to load */}
                <div className="h-full w-full bg-gradient-to-br from-blue-100 to-blue-50" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {doc.title}
                </h3>
                <p className="text-sm text-gray-500">{doc.timeAgo}</p>
              </div>

              <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}