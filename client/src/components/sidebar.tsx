import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, Edit3, Settings, Users, ChartBar, LogOut } from "lucide-react";
import { SiX, SiInstagram, SiLinkedin } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { data: socialAccounts = [] } = useQuery({
    queryKey: ["/api/social-accounts"],
    retry: false,
  });

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 h-full w-64 bg-white shadow-sm border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-40",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
      data-testid="sidebar"
    >
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <a 
              href="#" 
              className="flex items-center px-4 py-3 text-sm font-medium text-twitter-blue bg-blue-50 rounded-lg"
              data-testid="link-dashboard"
            >
              <BarChart3 className="h-4 w-4 mr-3" />
              Dashboard
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              data-testid="link-schedule"
            >
              <Calendar className="h-4 w-4 mr-3" />
              Schedule
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              data-testid="link-content"
            >
              <Edit3 className="h-4 w-4 mr-3" />
              Content
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              data-testid="link-analytics"
            >
              <ChartBar className="h-4 w-4 mr-3" />
              Analytics
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              data-testid="link-team"
            >
              <Users className="h-4 w-4 mr-3" />
              Team
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              data-testid="link-settings"
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </a>
          </li>
        </ul>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Connected Accounts
          </h3>
          <ul className="space-y-1">
            <li>
              <div className="flex items-center px-4 py-2 text-sm" data-testid="account-twitter">
                <SiX className="text-twitter-blue mr-3 h-4 w-4" />
                <span className="text-gray-700">@company</span>
                <span className="ml-auto w-2 h-2 bg-spotify-green rounded-full" data-testid="status-connected"></span>
              </div>
            </li>
            <li>
              <div className="flex items-center px-4 py-2 text-sm" data-testid="account-instagram">
                <SiInstagram className="text-instagram-pink mr-3 h-4 w-4" />
                <span className="text-gray-700">@company</span>
                <span className="ml-auto w-2 h-2 bg-spotify-green rounded-full" data-testid="status-connected"></span>
              </div>
            </li>
            <li>
              <div className="flex items-center px-4 py-2 text-sm" data-testid="account-linkedin">
                <SiLinkedin className="text-linkedin-blue mr-3 h-4 w-4" />
                <span className="text-gray-700">Company Page</span>
                <span className="ml-auto w-2 h-2 bg-spotify-green rounded-full" data-testid="status-connected"></span>
              </div>
            </li>
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:bg-gray-100"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </nav>
    </aside>
  );
}
