import { useState } from "react";
import { Home, Building2, Settings, MessageCircle, ChevronDown, ChevronRight, FileText } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Properties", url: "/properties", icon: Building2 },
];

const supportItems = [
  { title: "Live Chat", url: "/chat", icon: MessageCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  const isActive = (path: string) => currentPath === path;

  const handleSettingsClick = () => {
    setShowSettingsPanel(!showSettingsPanel);
  };

  return (
    <>
      <Sidebar
        className={`${!open ? "w-14" : "w-64"} bg-white border-r border-gray-200 shadow-lg`}
        collapsible="icon"
      >
        <SidebarContent className="bg-white flex flex-col h-full">
          {/* Main Navigation */}
          <SidebarGroup className="px-3 py-4">
            <SidebarGroupLabel className={`${!open ? "sr-only" : ""} text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 px-2`}>
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                            isActive 
                              ? "bg-blue-600 text-white shadow-md" 
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        {open && <span className="truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Spacer to push Support to bottom */}
          <div className="flex-1"></div>

          {/* Support Section at bottom */}
          <SidebarGroup className="px-3 py-4 border-t border-gray-200">
            <SidebarGroupLabel className={`${!open ? "sr-only" : ""} text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 px-2`}>
              Support
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {supportItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.title === "Settings" ? (
                      <div className="relative">
                        <SidebarMenuButton asChild>
                          <button 
                            onClick={handleSettingsClick}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-left ${
                              currentPath === '/settings' 
                                ? "bg-blue-600 text-white shadow-md" 
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                            {open && <span className="truncate">{item.title}</span>}
                          </button>
                        </SidebarMenuButton>
                        
                        {/* Settings Popup positioned relative to Settings button */}
                        {showSettingsPanel && (
                          <div className="absolute left-full top-0 ml-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <NavLink 
                              to="/settings" 
                              className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 font-medium ${
                                  isActive 
                                    ? "bg-blue-600 text-white" 
                                    : "text-gray-700 hover:bg-gray-100"
                                }`
                              }
                              onClick={() => setShowSettingsPanel(false)}
                            >
                              <FileText className="h-4 w-4" />
                              Job Types
                            </NavLink>
                          </div>
                        )}
                      </div>
                    ) : (
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                              isActive 
                                ? "bg-blue-600 text-white shadow-md" 
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            }`
                          }
                        >
                          <item.icon className="h-5 w-5" />
                          {open && <span className="truncate">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

    </>
  );
}