import { StatsCards } from "@/components/stats/stats-cards"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Hello John,</h1>
          <p className="text-gray-500 mt-1">
            Explore content more deeply and effectively.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          New summarize
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="flex items-start">
        <StatsCards />
      </div>
    </div>
  )
}