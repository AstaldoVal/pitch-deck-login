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

// Dynamic property items that check for existing bids
const getPropertyItems = () => {
  const savedBids = JSON.parse(localStorage.getItem('propertyBids') || '[]');
  const hasBids = savedBids.length > 0;
  
  return [
    { title: "Dashboard", url: "/property", icon: Home },
    { title: "Units", url: "/property/units", icon: Users },
    { title: "Contractors", url: "/contractors", icon: HardHat },
    { title: "Bids", url: hasBids ? "/property/bids-list" : "/property/bids", icon: Gavel },
    { title: "Projects", url: "/property/projects", icon: Briefcase },
    { title: "Budget", url: "/property/budget", icon: DollarSign },
    { title: "Gantt Chart", url: "/property/gantt", icon: BarChart3 },
  ];
};

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
  const [propertyItems, setPropertyItems] = useState(getPropertyItems());

  useEffect(() => {
    // Load property data from localStorage
    const savedProperty = localStorage.getItem('property');
    if (savedProperty) {
      setPropertyData(JSON.parse(savedProperty));
    }
    
    // Update property items when component mounts or location changes
    setPropertyItems(getPropertyItems());
  }, [location.pathname]);

  const handleBackToProperties = () => {
    navigate('/properties');
  };

  return (
    <Sidebar
      className={`${!open ? "w-14" : "w-60"} bg-blue-600 border-r-0`}
      collapsible="icon"
    >
      <SidebarContent className="bg-blue-600 flex flex-col h-full">
        {/* Back to Properties */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button 
                    onClick={handleBackToProperties}
                    className="w-full text-left hover:bg-blue-500/20 text-blue-100 flex items-center gap-2"
                  >
                    <ArrowLeft className="h-5 w-5 text-current" />
                    {open && <span className="font-medium">Back to Properties</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Current Property Info */}
        {propertyData && (
          <SidebarGroup>
            <SidebarGroupLabel className={`${!open ? "sr-only" : ""} text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2`}>
              Current Property
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {open && (
                <div className="px-3 py-2 text-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium text-sm truncate">{propertyData.name}</span>
                  </div>
                  <p className="text-xs text-blue-200 truncate">
                    {propertyData.city}, {propertyData.state}
                  </p>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Property Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={`${!open ? "sr-only" : ""} text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2`}>
            Property
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {propertyItems.map((item) => (
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