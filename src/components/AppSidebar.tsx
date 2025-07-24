import { useState } from "react";
import { Home, Building2, Users, Settings, MessageCircle, FileText, BarChart3 } from "lucide-react";
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
  { title: "Dashboard", url: "/property", icon: Home },
  { title: "Properties", url: "/properties", icon: Building2 },
  { title: "Units", url: "/units", icon: Users },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Documents", url: "/documents", icon: FileText },
];

const supportItems = [
  { title: "Live Chat", url: "/chat", icon: MessageCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar
      className={`${!open ? "w-14" : "w-60"} bg-blue-600 border-r-0`}
      collapsible="icon"
    >
      <SidebarContent className="bg-blue-600">
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

        <SidebarGroup>
          <SidebarGroupLabel className={`${!open ? "sr-only" : ""} text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2`}>
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
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
      </SidebarContent>
    </Sidebar>
  );
}