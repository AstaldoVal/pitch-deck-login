import { Bell, Search, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Logo from "@/components/Logo";
import { useMessages } from "@/contexts/MessagesContext";

export function AppHeader() {
  const { setIsOpen, getPropertyChats } = useMessages();
  
  const totalUnreadCount = getPropertyChats().reduce((total, chat) => total + chat.unreadCount, 0);
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-4 py-3 min-w-0 gap-2">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <Logo size="md" />
        </div>

        <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-shrink-0">
          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 w-48 xl:w-64"
            />
          </div>

          {/* Messages */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative flex-shrink-0"
            onClick={() => setIsOpen(true)}
          >
            <MessageSquare className="h-4 w-4" />
            {totalUnreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                {totalUnreadCount}
              </Badge>
            )}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative flex-shrink-0">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-2 min-w-0">
            <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 hidden sm:block">
              Property Owner
            </Badge>
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}