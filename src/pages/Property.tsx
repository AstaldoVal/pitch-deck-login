import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  FileText,
  Edit,
  Map,
  Minus,
  Calendar,
  CheckCircle,
  Clock,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PropertySidebar } from "@/components/PropertySidebar";
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
  yearBuilt?: number;
  buildingType?: string;
  assetManager?: string;
  managementCompany?: string;
  renovationType?: string;
}

const Property = () => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [showOnboardingTip, setShowOnboardingTip] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRentRollUploaded = (fileName: string) => {
    if (propertyData) {
      const updatedPropertyData = {
        ...propertyData,
        hasRentRoll: true,
        rentRollFile: fileName
      };
      setPropertyData(updatedPropertyData);
    }
  };

  useEffect(() => {
    // Load property data from localStorage (for prototype)
    const savedProperty = localStorage.getItem('property');
    if (savedProperty) {
      setPropertyData(JSON.parse(savedProperty));
    }

    // Check if we came from bid creation
    if (location.state?.showBidSuccess) {
      toast({
        title: "Bid Created Successfully!",
        description: `Bid ${location.state.bidNumber} has been created and sent to contractors.`,
      });
      
      // Clear the state to prevent showing toast on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, toast, navigate, location.pathname]);

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

  const handleEditProperty = () => {
    // Navigate to property edit page with a default ID
    navigate('/property/edit/1');
  };

  const handleViewOnMap = () => {
    if (propertyData) {
      const address = `${propertyData.address}, ${propertyData.city}, ${propertyData.state} ${propertyData.zip}`;
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  if (!propertyData) {
    return (
      <SidebarProvider>
        <div className="min-h-screen w-full flex">
          <PropertySidebar />
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
        <PropertySidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Property Header and Account Setup Progress */}
              <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Property Header */}
                <div>
                  <Card className="p-6 h-full">
                     <div className="flex items-start justify-between mb-4">
                       <div className="flex-1">
                         <h1 className="text-2xl font-bold text-gray-900 mb-1">
                           Sunset Commons Apartments
                         </h1>
                         <p className="text-sm text-gray-600 mb-3">1457 Sunset Ave, Dallas, TX 75208</p>
                         <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                           <Building2 className="w-3 h-3 mr-1" />
                           Military
                         </Badge>
                       </div>
                       <div className="flex gap-2 ml-4">
                         <Button variant="ghost" size="icon" onClick={handleEditProperty} className="h-8 w-8">
                           <Edit className="w-4 h-4" />
                         </Button>
                         <Button variant="ghost" size="icon" onClick={handleViewOnMap} className="h-8 w-8">
                           <Map className="w-4 h-4" />
                         </Button>
                       </div>
                     </div>
                      
                      <div className="space-y-3">
                        {/* Management Company */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-600">
                            <Building2 className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Management Company</span>
                          </div>
                          <span className="text-sm text-gray-900">Greystar</span>
                        </div>

                        {/* Renovation Type */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-600">
                            <FileText className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Renovation Type</span>
                          </div>
                          <span className="text-sm text-gray-900">Interior, Exterior, General (Common)</span>
                        </div>

                        {/* Asset Manager */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Asset Manager</span>
                          </div>
                          {propertyData.assetManager ? (
                            <span className="text-sm text-gray-900">{propertyData.assetManager}</span>
                          ) : (
                            <div className="flex items-center text-gray-400">
                              <Minus className="w-3 h-3 mr-1" />
                              <span className="text-sm">Not assigned</span>
                            </div>
                          )}
                        </div>
                      </div>
                  </Card>
                </div>

                {/* Account Setup Progress */}
                <div>
                  <AccountSetupProgress 
                    hasRentRoll={propertyData.hasRentRoll}
                    rentRollFile={propertyData.rentRollFile}
                    uploadTime={new Date()}
                    onRentRollUploaded={handleRentRollUploaded}
                  />
                </div>
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

              {/* Progress Summary */}
              <Card className="p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Progress Summary</h2>
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* Jobs Completed */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Jobs Completed</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">18 of 112</p>
                    <p className="text-lg text-blue-600 font-semibold">16% Complete</p>
                  </div>

                  {/* Total Bid */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Total Bid</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">$1,522,439</p>
                  </div>

                  {/* Total Invoice */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Total Invoice</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">$750,000</p>
                  </div>

                  {/* Total Budget */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Target className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Total Budget</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">$1,650,000</p>
                  </div>
                </div>

                {/* Target Completion */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Target Completion Date</p>
                        <p className="text-lg font-semibold text-blue-600">March 20, 2026</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Time Remaining</p>
                      <p className="text-lg font-semibold text-orange-600">250 days</p>
                    </div>
                  </div>
                </div>

                {/* Jobs Due Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Jobs Due</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Next 7 days</p>
                      <p className="text-xl font-bold text-red-600">3</p>
                      <p className="text-xs text-red-600">2 outstanding</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Next 2 weeks</p>
                      <p className="text-xl font-bold text-orange-600">7</p>
                      <p className="text-xs text-orange-600">1 outstanding</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Next 30 days</p>
                      <p className="text-xl font-bold text-yellow-600">12</p>
                      <p className="text-xs text-gray-500">On track</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Next 60 days</p>
                      <p className="text-xl font-bold text-blue-600">25</p>
                      <p className="text-xs text-gray-500">On track</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Next 90 days</p>
                      <p className="text-xl font-bold text-green-600">38</p>
                      <p className="text-xs text-gray-500">On track</p>
                    </div>
                  </div>
                </div>
              </Card>

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