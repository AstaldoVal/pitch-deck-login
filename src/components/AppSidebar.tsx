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
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-blue-500 text-white font-medium" : "hover:bg-blue-500/20 text-blue-100";

  return (
    <Sidebar
      className={`${state === "collapsed" ? "w-14" : "w-60"} mt-16 bg-blue-600 border-r-0`}
      collapsible="icon"
    >
      <SidebarContent className="bg-blue-600">
        <SidebarGroup>
          <SidebarGroupLabel className={`${state === "collapsed" ? "sr-only" : ""} text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5 text-current" />
                      {state !== "collapsed" && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={`${state === "collapsed" ? "sr-only" : ""} text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2`}>
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5 text-current" />
                      {state !== "collapsed" && <span className="font-medium">{item.title}</span>}
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