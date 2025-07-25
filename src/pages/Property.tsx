import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { 
  Building2, 
  MapPin, 
  Plus, 
  Upload, 
  Users, 
  DollarSign,
  AlertCircle,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { AccountSetupProgress } from "@/components/AccountSetupProgress";

interface PropertyData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  hasRentRoll: boolean;
  rentRollFile?: string;
}

const Property = () => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [showOnboardingTip, setShowOnboardingTip] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load property data from localStorage (for prototype)
    const savedProperty = localStorage.getItem('property');
    if (savedProperty) {
      setPropertyData(JSON.parse(savedProperty));
    }
  }, []);

  const handleAddUnits = () => {
    toast({
      title: "Adding Units",
      description: "This feature will be available in the next version"
    });
  };

  const handleUploadRentRoll = () => {
    toast({
      title: "Uploading Rent Roll",
      description: "This feature will be available in the next version"
    });
  };

  if (!propertyData) {
    return (
      <SidebarProvider>
        <div className="min-h-screen w-full flex">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg text-gray-600">Property data not found</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Property Header */}
              <div className="mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {propertyData.name}
                      </h1>
                      <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                        <Building2 className="w-3 h-3 mr-1" />
                        {propertyData.propertyType}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>
                      {propertyData.address}, {propertyData.city}, {propertyData.state} {propertyData.zip}
                    </span>
                  </div>
                </Card>
              </div>

              {/* Account Setup Progress */}
              <div className="mb-8">
                <AccountSetupProgress 
                  hasRentRoll={propertyData.hasRentRoll}
                  rentRollFile={propertyData.rentRollFile}
                  uploadTime={new Date()}
                />
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Units</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">$0</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Occupancy</p>
                      <p className="text-2xl font-bold text-gray-900">0%</p>
                    </div>
                    <Building2 className="w-8 h-8 text-orange-600" />
                  </div>
                </Card>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Units Section */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Units</h2>
                    <Button onClick={handleAddUnits} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Unit
                    </Button>
                  </div>
                  
                  <div className="text-center py-12 text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No units added</p>
                    <p className="text-sm">Add your first unit or upload a Rent Roll</p>
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Property "{propertyData.name}" created
                        </p>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                    </div>

                    {propertyData.hasRentRoll && (
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Rent Roll "{propertyData.rentRollFile}" uploaded
                          </p>
                          <p className="text-xs text-gray-500">Processing...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Property;