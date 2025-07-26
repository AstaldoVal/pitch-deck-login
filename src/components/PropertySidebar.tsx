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
      className={`${!open ? "w-14" : "w-64"} bg-gradient-to-b from-card to-accent/20 border-r border-border shadow-medium`}
      collapsible="icon"
    >
      <SidebarContent className="bg-gradient-to-b from-card to-accent/20 flex flex-col h-full">
        {/* Back to Properties */}
        <SidebarGroup className="px-3 py-4 border-b border-border">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="group">
                  <button 
                    onClick={handleBackToProperties}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-left text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-[1.01] hover:shadow-sm"
                  >
                    <ArrowLeft className={`h-5 w-5 transition-transform duration-200 ${!open ? "mx-auto" : "group-hover:scale-110"}`} />
                    {open && <span className="truncate">Back to Properties</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Current Property Info */}
        {propertyData && (
          <SidebarGroup className="px-3 py-4 border-b border-border">
            <SidebarGroupLabel className={`${!open ? "sr-only" : ""} text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-3 px-2`}>
              Current Property
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {open && (
                <div className="px-3 py-3 bg-accent/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-foreground" />
                    <span className="font-semibold text-sm text-foreground truncate">{propertyData.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {propertyData.city}, {propertyData.state}
                  </p>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Property Navigation */}
        <SidebarGroup className="px-3 py-4 flex-1">
          <SidebarGroupLabel className={`${!open ? "sr-only" : ""} text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-3 px-2`}>
            Property
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {propertyItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-md scale-[1.02]" 
                            : "text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-[1.01] hover:shadow-sm"
                        }`
                      }
                    >
                      <item.icon className={`h-5 w-5 transition-transform duration-200 ${!open ? "mx-auto" : "group-hover:scale-110"}`} />
                      {open && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support Section at bottom */}
        <SidebarGroup className="px-3 py-4 border-t border-border">
          <SidebarGroupLabel className={`${!open ? "sr-only" : ""} text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-3 px-2`}>
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-md scale-[1.02]" 
                            : "text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-[1.01] hover:shadow-sm"
                        }`
                      }
                    >
                      <item.icon className={`h-5 w-5 transition-transform duration-200 ${!open ? "mx-auto" : "group-hover:scale-110"}`} />
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