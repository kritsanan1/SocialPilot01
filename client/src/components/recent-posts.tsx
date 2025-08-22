import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiX, SiInstagram, SiLinkedin } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

export default function RecentPosts() {
  const { data: posts = [] } = useQuery<any[]>({
    queryKey: ["/api/posts"],
    retry: false,
  });

  const getPlatformIcon = (platforms: string[]) => {
    if (platforms?.includes('twitter')) return <SiX className="text-twitter-blue h-4 w-4" />;
    if (platforms?.includes('instagram')) return <SiInstagram className="text-instagram-pink h-4 w-4" />;
    if (platforms?.includes('linkedin')) return <SiLinkedin className="text-linkedin-blue h-4 w-4" />;
    return <SiX className="text-twitter-blue h-4 w-4" />;
  };

  // Mock data if no posts available
  const displayPosts = posts.length > 0 ? posts : [
    {
      id: '1',
      content: 'Excited to share our latest productivity tips for remote teams! 🚀 Check out how we\'re revolutionizing workplace collaboration.',
      platforms: ['twitter'],
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      mediaUrl: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80',
    },
    {
      id: '2', 
      content: 'Behind the scenes at our marketing team\'s strategy session 📊 #DataDriven #TeamWork',
      platforms: ['instagram'],
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80',
    },
    {
      id: '3',
      content: 'Thrilled to announce our Q4 achievements! Our team\'s dedication has driven unprecedented growth. Here\'s to an even stronger 2024! 🎉',
      platforms: ['linkedin'],
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      mediaUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80',
    },
  ];

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200" data-testid="card-recent-posts">
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-twitter-dark">Recent Posts</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {displayPosts.map((post: any, index: number) => (
            <div key={post.id || index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50" data-testid={`post-recent-${index}`}>
              <img 
                src={post.mediaUrl || 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80'} 
                alt="Post media" 
                className="w-12 h-12 rounded-lg object-cover"
                data-testid={`img-post-media-${index}`}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getPlatformIcon(post.platforms || ['twitter'])}
                  <span className="text-sm text-gray-600" data-testid={`text-post-time-${index}`}>
                    Posted {post.publishedAt ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true }) : '2 hours ago'}
                  </span>
                  <Badge className="bg-spotify-green text-white text-xs" data-testid={`badge-post-status-${index}`}>
                    Live
                  </Badge>
                </div>
                <p className="text-sm text-twitter-dark mb-2" data-testid={`text-post-content-${index}`}>
                  {post.content}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <span data-testid={`text-post-likes-${index}`}>124 likes</span>
                  <span data-testid={`text-post-retweets-${index}`}>23 retweets</span>
                  <span data-testid={`text-post-replies-${index}`}>8 replies</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
