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
        className={`${!open ? "w-14" : "w-60"} bg-blue-600 border-r-0`}
        collapsible="icon"
      >
        <SidebarContent className="bg-blue-600 flex flex-col h-full">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className={`${!open ? "sr-only" : ""} text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2`}>
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) =>
                          isActive ? "bg-blue-500 text-white font-medium" : "hover:bg-blue-500/20 text-blue-100"
                        }
                      >
                        <item.icon className="h-5 w-5 text-current" />
                        {open && <span className="font-medium">{item.title}</span>}
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
          <SidebarGroup>
            <SidebarGroupLabel className={`${!open ? "sr-only" : ""} text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2`}>
              Support
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {supportItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      {item.title === "Settings" ? (
                        <button 
                          onClick={handleSettingsClick}
                          className={`w-full text-left ${
                            currentPath === '/settings' ? "bg-blue-500 text-white font-medium" : "hover:bg-blue-500/20 text-blue-100"
                          }`}
                        >
                          <item.icon className="h-5 w-5 text-current" />
                          {open && <span className="font-medium">{item.title}</span>}
                        </button>
                      ) : (
                        <NavLink 
                          to={item.url} 
                          className={({ isActive }) =>
                            isActive ? "bg-blue-500 text-white font-medium" : "hover:bg-blue-500/20 text-blue-100"
                          }
                        >
                          <item.icon className="h-5 w-5 text-current" />
                          {open && <span className="font-medium">{item.title}</span>}
                        </NavLink>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Settings Popup */}
      {showSettingsPanel && (
        <div className="absolute left-60 top-20 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <NavLink 
            to="/settings" 
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm rounded-lg ${
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FileText className="h-4 w-4 mr-2" />
            Job Types
          </NavLink>
        </div>
      )}
    </>
  );
}