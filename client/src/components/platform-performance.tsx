import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiX, SiInstagram, SiLinkedin } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";

export default function PlatformPerformance() {
  const { data: performanceData = [] } = useQuery<any[]>({
    queryKey: ["/api/analytics/platform-performance"],
    retry: false,
  });

  // Mock data if no performance data available
  const platforms = performanceData.length > 0 ? performanceData : [
    { platform: 'twitter', engagementRate: 8.7 },
    { platform: 'instagram', engagementRate: 12.3 },
    { platform: 'linkedin', engagementRate: 5.9 },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <SiX className="text-twitter-blue h-4 w-4" />;
      case 'instagram': return <SiInstagram className="text-instagram-pink h-4 w-4" />;
      case 'linkedin': return <SiLinkedin className="text-linkedin-blue h-4 w-4" />;
      default: return <SiX className="text-twitter-blue h-4 w-4" />;
    }
  };

  const getPlatformName = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200" data-testid="card-platform-performance">
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-twitter-dark">Platform Performance</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {platforms.map((platform: any, index: number) => (
            <div key={platform.platform} className="flex items-center justify-between" data-testid={`platform-${platform.platform}-${index}`}>
              <div className="flex items-center">
                {getPlatformIcon(platform.platform)}
                <span className="text-sm font-medium text-twitter-dark ml-3" data-testid={`text-platform-name-${index}`}>
                  {getPlatformName(platform.platform)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-twitter-dark" data-testid={`text-engagement-rate-${index}`}>
                  {platform.engagementRate}%
                </p>
                <p className="text-xs text-gray-600">Engagement</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
