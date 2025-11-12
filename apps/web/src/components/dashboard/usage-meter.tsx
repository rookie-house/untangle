import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

interface UsageMeterProps {
  percentage: number;
  usedCount: number;
  totalCount: number;
  plan: string;
}

export function UsageMeter({ percentage, usedCount, totalCount, plan }: UsageMeterProps) {
  // Calculate the rotation for the progress indicator (converts percentage to degrees)
  const rotation = (percentage / 100) * 360;
  const clipPath = `polygon(50% 50%, 50% 0%, ${
    rotation <= 180
      ? `${50 + 50 * Math.tan((rotation * Math.PI) / 180)}% 0`
      : '100% 0, 100% 100%, 0 100%, 0 0'
  })`;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold">Your usage</h2>
          <p className="text-sm text-gray-500">Current plan: {plan}</p>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Circular Progress */}
      <div className="flex justify-center mb-4">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full border-8 border-gray-100" />

          {/* Progress circle */}
          <div
            className="absolute inset-0 rounded-full border-8 border-blue-500"
            style={{ clipPath }}
          />

          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{percentage}%</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-center text-gray-600 mb-4">
        {usedCount} summaries used of {totalCount}
      </p>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          Pricing plans
        </Button>
        <Button className="flex-1">Upgrade</Button>
      </div>
    </Card>
  );
}
