import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Repeat, MessageCircle, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

export default function ActivityFeed() {
  const { data: activities = [] } = useQuery<any[]>({
    queryKey: ["/api/activities"],
    retry: false,
  });

  // Mock data if no activities available
  const displayActivities = activities.length > 0 ? activities : [
    {
      id: '1',
      type: 'like',
      description: 'liked your post about productivity tips',
      actorName: '@sarah_m',
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    },
    {
      id: '2',
      type: 'share',
      description: 'retweeted your latest update',
      actorName: '@marketing_pro',
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      id: '3',
      type: 'comment',
      description: 'commented on your LinkedIn post',
      actorName: '@john_design',
      createdAt: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
    },
    {
      id: '4',
      type: 'follow',
      description: 'started following you',
      actorName: '@tech_startup',
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'like':
        return (
          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="h-3 w-3 text-instagram-pink" />
          </div>
        );
      case 'share':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Repeat className="h-3 w-3 text-spotify-green" />
          </div>
        );
      case 'comment':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle className="h-3 w-3 text-yellow-600" />
          </div>
        );
      case 'follow':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <UserPlus className="h-3 w-3 text-purple-600" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="h-3 w-3 text-instagram-pink" />
          </div>
        );
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200" data-testid="card-activity-feed">
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-twitter-dark">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {displayActivities.map((activity: any, index: number) => (
            <div key={activity.id || index} className="flex items-start space-x-3" data-testid={`activity-${index}`}>
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-twitter-dark" data-testid={`text-activity-description-${index}`}>
                  <span className="font-medium">{activity.actorName}</span> {activity.description}
                </p>
                <p className="text-xs text-gray-600" data-testid={`text-activity-time-${index}`}>
                  {activity.createdAt ? formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true }) : '2 minutes ago'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
