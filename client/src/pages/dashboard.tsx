import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import StatsCards from "@/components/stats-cards";
import RecentPosts from "@/components/recent-posts";
import ScheduledPosts from "@/components/scheduled-posts";
import AnalyticsChart from "@/components/analytics-chart";
import PlatformPerformance from "@/components/platform-performance";
import ActivityFeed from "@/components/activity-feed";
import PostModal from "@/components/post-modal";
import { useState } from "react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-twitter-blue"></div>
      </div>
    );
  }

  return (
    <div className="bg-light-bg font-inter text-twitter-dark">
      <Header onCreatePost={() => setIsPostModalOpen(true)} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64 p-6" data-testid="dashboard-main">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-twitter-dark" data-testid="text-dashboard-title">Dashboard Overview</h2>
                <p className="text-gray-600 mt-1">Monitor your social media performance across all platforms</p>
              </div>
            </div>
            
            <StatsCards />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Recent Posts & Schedule */}
            <div className="xl:col-span-2 space-y-6">
              <RecentPosts />
              <ScheduledPosts />
            </div>

            {/* Right Column - Analytics & Activity */}
            <div className="space-y-6">
              <AnalyticsChart />
              <PlatformPerformance />
              <ActivityFeed />
            </div>
          </div>
        </main>
      </div>

      <PostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
      
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
          data-testid="sidebar-overlay"
        />
      )}
    </div>
  );
}
