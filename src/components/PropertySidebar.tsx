import { useState, useEffect } from "react";
import { Home, Building2, Users, Settings, MessageCircle, ArrowLeft, Gavel, Briefcase, DollarSign, BarChart3, HardHat } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

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

interface PropertyData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  hasRentRoll: boolean;
  rentRollFile?: string;
  yearBuilt?: number;
  buildingType?: string;
  assetManager?: string;
}

const propertyItems = [
  { title: "Dashboard", url: "/property", icon: Home },
  { title: "Units", url: "/property/units", icon: Users },
  { title: "Bids", url: "/property/bids", icon: Gavel },
  { title: "Jobs", url: "/property/jobs", icon: Briefcase },
  { title: "Budget", url: "/property/budget", icon: DollarSign },
  { title: "Gantt Chart", url: "/property/gantt", icon: BarChart3 },
  { title: "Contractors", url: "/property/contractors", icon: HardHat },
];

const supportItems = [
  { title: "Live Chat", url: "/chat", icon: MessageCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function PropertySidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);

  useEffect(() => {
    // Load property data from localStorage
    const savedProperty = localStorage.getItem('property');
    if (savedProperty) {
      setPropertyData(JSON.parse(savedProperty));
    }
  }, []);

  const handleBackToProperties = () => {
    navigate('/properties');
  };

  return (
    <Sidebar
      className={`${!open ? "w-14" : "w-64"} bg-white border-r border-gray-200 shadow-lg`}
      collapsible="icon"
    >
      <SidebarContent className="bg-white flex flex-col h-full">
        {/* Back to Properties */}
        <SidebarGroup className="px-3 py-4 border-b border-gray-200">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button 
                    onClick={handleBackToProperties}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    {open && <span className="truncate">Back to Properties</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Current Property Info */}
        {propertyData && (
          <SidebarGroup className="px-3 py-4 border-b border-gray-200">
            <SidebarGroupLabel className={`${!open ? "sr-only" : ""} text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 px-2`}>
              Current Property
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {open && (
                <div className="px-3 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-gray-700" />
                    <span className="font-semibold text-sm text-gray-900 truncate">{propertyData.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {propertyData.city}, {propertyData.state}
                  </p>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Property Navigation */}
        <SidebarGroup className="px-3 py-4 flex-1">
          <SidebarGroupLabel className={`${!open ? "sr-only" : ""} text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 px-2`}>
            Property
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {propertyItems.map((item) => (
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

        {/* Support Section at bottom */}
        <SidebarGroup className="px-3 py-4 border-t border-gray-200">
          <SidebarGroupLabel className={`${!open ? "sr-only" : ""} text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 px-2`}>
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {supportItems.map((item) => (
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
      </SidebarContent>
    </Sidebar>
  );
}