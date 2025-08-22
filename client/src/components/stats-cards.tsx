import { Card, CardContent } from "@/components/ui/card";
import { Eye, Heart, UserPlus, MousePointer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function StatsCards() {
  const { data: engagementStats = {} } = useQuery({
    queryKey: ["/api/analytics/engagement"],
    retry: false,
  });

  const stats = [
    {
      icon: Eye,
      iconBg: "bg-blue-100",
      iconColor: "text-twitter-blue",
      value: (engagementStats as any)?.totalReach ? `${((engagementStats as any).totalReach / 1000000).toFixed(1)}M` : "1.2M",
      label: "Total Reach",
      change: "+12.5%",
      changeColor: "text-spotify-green",
    },
    {
      icon: Heart,
      iconBg: "bg-pink-100",
      iconColor: "text-instagram-pink",
      value: (engagementStats as any)?.totalEngagements ? `${((engagementStats as any).totalEngagements / 1000).toFixed(1)}K` : "45.7K",
      label: "Engagements",
      change: "+8.3%",
      changeColor: "text-spotify-green",
    },
    {
      icon: UserPlus,
      iconBg: "bg-indigo-100",
      iconColor: "text-linkedin-blue",
      value: (engagementStats as any)?.newFollowers ? `${((engagementStats as any).newFollowers / 1000).toFixed(1)}K` : "2.3K",
      label: "New Followers",
      change: "+15.2%",
      changeColor: "text-spotify-green",
    },
    {
      icon: MousePointer,
      iconBg: "bg-green-100",
      iconColor: "text-spotify-green",
      value: (engagementStats as any)?.avgClickThroughRate ? `${(engagementStats as any).avgClickThroughRate.toFixed(1)}%` : "3.7%",
      label: "Avg. CTR",
      change: "+2.1%",
      changeColor: "text-spotify-green",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-white rounded-lg shadow-sm border border-gray-200" data-testid={`card-stat-${index}`}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.iconBg}`}>
                  <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-twitter-dark" data-testid={`text-stat-value-${index}`}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600" data-testid={`text-stat-label-${index}`}>
                    {stat.label}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${stat.changeColor}`} data-testid={`text-stat-change-${index}`}>
                  {stat.change}
                </span>
                <span className="text-gray-600 text-sm ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
