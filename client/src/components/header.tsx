import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Plus, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";

interface HeaderProps {
  onCreatePost: () => void;
  onToggleSidebar: () => void;
}

export default function Header({ onCreatePost, onToggleSidebar }: HeaderProps) {
  const { user } = useAuth() as { user: User | undefined; };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden mr-3 p-2 rounded-md hover:bg-gray-100"
            data-testid="button-sidebar-toggle"
          >
            <Menu className="h-4 w-4 text-gray-600" />
          </Button>
          <h1 className="text-xl font-semibold text-twitter-dark" data-testid="text-app-title">SocialHub</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-twitter-blue focus:border-transparent w-64"
              data-testid="input-search"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2 rounded-lg hover:bg-gray-100" data-testid="button-notifications">
            <Bell className="h-4 w-4 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-instagram-pink text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          
          {/* Create Post Button */}
          <Button 
            onClick={onCreatePost}
            className="px-4 py-2 bg-twitter-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600"
            data-testid="button-create-post"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <img 
              src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"} 
              alt="User profile" 
              className="h-8 w-8 rounded-full object-cover"
              data-testid="img-user-avatar"
            />
            <span className="hidden md:block text-sm font-medium" data-testid="text-user-name">
              {user?.firstName || user?.email?.split('@')[0] || "User"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
