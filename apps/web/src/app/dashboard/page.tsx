import { StatsCards } from "@/components/stats/stats-cards"
import { RecentDocuments } from "@/components/dashboard/recent-documents"
import { UsageMeter } from "@/components/dashboard/usage-meter"
import { TopConversations } from "@/components/dashboard/top-conversations"
import { Button } from "@/components/ui/button"
import { Clock, Sparkles } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6 w-full flex rounded-2xl bg-white p-6 flex-col gap-4 lg:flex-row">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 min-w-2/3">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold">Hello John,</h1>
            <p className="text-gray-500 mt-1">
              Explore content more deeply and effectively.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex items-start">
          <StatsCards />
        </div>
        <div className="">
          <RecentDocuments />
        </div>
      </div>
      <div className=" h-full w-full flex flex-col gap-6">
        <div className="p-4 w-full rounded-full bg-gray-200 flex items-center justify-center gap-4">
          <Clock />
          <span className="flex items-center text-2xl font-medium text-black">
            15 Risks Saved
          </span>
        </div>

        <div className="border border-gray-200 rounded-lg p-2">
          <UsageMeter
            percentage={75}
            usedCount={3}
            totalCount={4}
            plan="Pro"
          />
        </div>
        <div className="border border-gray-200 rounded-lg p-2">
          <TopConversations />
        </div>
      </div>
    </div>
  )
}