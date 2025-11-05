import { ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  bgColor: string;
}

function StatCard({ title, value, subtitle, bgColor }: StatCardProps) {
  return (
    <Card
      className={` relative h-[258px] overflow-hidden text-black w-[234px] flex flex-col justify-between rounded-4xl rounded-br-none ${bgColor}`}
    >
      <div className="flex p-6 flex-col gap-2 h-full w-full">
        <div className="flex justify-between text-2xl font-medium items-start">{title}</div>
        <div className="flex text-base flex-col">{subtitle}</div>
      </div>
      <div className="text-5xl p-6 flex w-full h-full items-start font-bold">{value}</div>

      <div className="absolute -bottom-0.5 rounded-tl-[25%] bg-white  -right-0.5 size-[72px] p-3">
        <div className="size-12 bg-gray-700 rounded-full  flex items-center justify-center">
          <ArrowUpRight className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );
}

export function StatsCards() {
  const stats = [
    {
      title: 'Total Documents Summarized',
      value: '55',
      subtitle: 'Total Documents that are sumarized',
      bgColor: 'bg-[#FBE9D0]',
    },
    {
      title: 'Total Conversations',
      value: '12',
      subtitle: 'Conversations for more clarifications',
      bgColor: 'bg-[#CFDEFC]',
    },
    {
      title: 'T&C Summarized',
      value: '24',
      subtitle: 'Terms and Conditions summaries so far',
      bgColor: 'bg-[#E4E3E8]',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          bgColor={stat.bgColor}
        />
      ))}
    </div>
  );
}
