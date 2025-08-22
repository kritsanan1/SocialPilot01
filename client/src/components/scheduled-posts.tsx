import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiX, SiInstagram, SiLinkedin } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function ScheduledPosts() {
  const { data: scheduledPosts = [] } = useQuery<any[]>({
    queryKey: ["/api/posts/scheduled"],
    retry: false,
  });

  const getPlatformIcon = (platforms: string[]) => {
    if (platforms?.includes('twitter')) return <SiX className="text-twitter-blue h-4 w-4" />;
    if (platforms?.includes('instagram')) return <SiInstagram className="text-instagram-pink h-4 w-4" />;
    if (platforms?.includes('linkedin')) return <SiLinkedin className="text-linkedin-blue h-4 w-4" />;
    return <SiX className="text-twitter-blue h-4 w-4" />;
  };

  // Mock data if no scheduled posts available
  const displayPosts = scheduledPosts.length > 0 ? scheduledPosts : [
    {
      id: '1',
      content: 'Tuesday Tips: 5 proven strategies to boost your content engagement rates. Thread incoming! 🧵✨',
      platforms: ['twitter'],
      scheduledFor: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      mediaUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80',
    },
    {
      id: '2',
      content: 'Coffee break creativity session ☕ When the best ideas happen over casual conversations. #TeamMoments',
      platforms: ['instagram'],
      scheduledFor: new Date(Date.now() + 22 * 60 * 60 * 1000), // Tomorrow 10 AM
      mediaUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80',
    },
  ];

  const handleEdit = (postId: string) => {
    console.log('Edit post:', postId);
  };

  const handleDelete = (postId: string) => {
    console.log('Delete post:', postId);
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200" data-testid="card-scheduled-posts">
      <CardHeader className="px-6 py-4 border-b border-gray-200 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-twitter-dark">Upcoming Scheduled Posts</CardTitle>
        <Button variant="link" className="text-sm text-twitter-blue hover:underline p-0" data-testid="button-view-calendar">
          View Calendar
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {displayPosts.map((post: any, index: number) => (
            <div key={post.id || index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg" data-testid={`post-scheduled-${index}`}>
              <img 
                src={post.mediaUrl || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80'} 
                alt="Scheduled post media" 
                className="w-12 h-12 rounded-lg object-cover"
                data-testid={`img-scheduled-media-${index}`}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getPlatformIcon(post.platforms || ['twitter'])}
                  <span className="text-sm text-gray-600" data-testid={`text-scheduled-time-${index}`}>
                    Scheduled for {post.scheduledFor ? format(new Date(post.scheduledFor), 'MMM d, h:mm a') : 'Today, 3:00 PM'}
                  </span>
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs" data-testid={`badge-scheduled-status-${index}`}>
                    Pending
                  </Badge>
                </div>
                <p className="text-sm text-twitter-dark mb-2" data-testid={`text-scheduled-content-${index}`}>
                  {post.content}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="link"
                    onClick={() => handleEdit(post.id || `${index}`)}
                    className="text-xs text-twitter-blue hover:underline p-0"
                    data-testid={`button-edit-${index}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => handleDelete(post.id || `${index}`)}
                    className="text-xs text-red-600 hover:underline p-0"
                    data-testid={`button-delete-${index}`}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
