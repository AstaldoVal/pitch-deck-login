import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { 
  Building2, 
  Plus, 
  Users, 
  DollarSign,
  FileText,
  Edit,
  Map,
  Minus,
  Calendar,
  Target,
  Upload,
  Clock
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

const PropertyEmpty = () => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
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
    // For empty state, we'll use placeholder data
    const emptyPropertyData: PropertyData = {
      name: "Sunset Commons Apartments",
      address: "1457 Sunset Ave",
      city: "Dallas",
      state: "TX",
      zip: "75208",
      propertyType: "Military",
      hasRentRoll: false,
      yearBuilt: 2010,
      buildingType: "Mid-Rise",
      assetManager: undefined,
      managementCompany: undefined,
      renovationType: undefined
    };
    setPropertyData(emptyPropertyData);
  }, []);

  const handleAddUnits = () => {
    toast({
      title: "Adding Units",
      description: "Start by uploading your rent roll or adding units manually"
    });
  };

  const handleUploadRentRoll = () => {
    toast({
      title: "Upload Rent Roll",
      description: "Upload your rent roll to automatically import unit data"
    });
  };

  const handleEditProperty = () => {
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
                <p className="text-lg text-gray-600">Loading property...</p>
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
                           {propertyData.name}
                         </h1>
                         <p className="text-sm text-gray-600 mb-3">
                           {propertyData.address}, {propertyData.city}, {propertyData.state} {propertyData.zip}
                         </p>
                         <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                           <Building2 className="w-3 h-3 mr-1" />
                           {propertyData.propertyType}
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
                          <div className="flex items-center text-gray-400">
                            <Minus className="w-3 h-3 mr-1" />
                            <span className="text-sm">Not set</span>
                          </div>
                        </div>

                        {/* Renovation Type */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-600">
                            <FileText className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Renovation Type</span>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Minus className="w-3 h-3 mr-1" />
                            <span className="text-sm">Not selected</span>
                          </div>
                        </div>

                        {/* Asset Manager */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Asset Manager</span>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Minus className="w-3 h-3 mr-1" />
                            <span className="text-sm">Not assigned</span>
                          </div>
                        </div>
                      </div>
                  </Card>
                </div>

                {/* Getting Started Guide */}
                <div>
                  <Card className="p-6 h-full">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Getting Started</h2>
                    
                    <div className="space-y-4">
                      {/* Step 1 */}
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-3">
                            1
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Upload Rent Roll</p>
                            <p className="text-xs text-gray-600">Import your unit data automatically</p>
                          </div>
                        </div>
                        <Button size="sm" onClick={handleUploadRentRoll}>
                          <Upload className="w-4 h-4 mr-1" />
                          Upload
                        </Button>
                      </div>

                      {/* Step 2 */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-400 text-white text-xs font-bold rounded-full flex items-center justify-center mr-3">
                            2
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Create Your First Bid</p>
                            <p className="text-xs text-gray-400">Get quotes from contractors</p>
                          </div>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-400 text-white text-xs font-bold rounded-full flex items-center justify-center mr-3">
                            3
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Track Progress</p>
                            <p className="text-xs text-gray-400">Monitor renovation status</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Account Setup Progress */}
              <div className="mb-8">
                <AccountSetupProgress 
                  hasRentRoll={propertyData.hasRentRoll}
                  rentRollFile={propertyData.rentRollFile}
                  uploadTime={new Date()}
                  onRentRollUploaded={handleRentRollUploaded}
                />
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Units</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-xs text-gray-400 mt-1">Upload rent roll to see units</p>
                    </div>
                    <Users className="w-8 h-8 text-gray-300" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">$0</p>
                      <p className="text-xs text-gray-400 mt-1">No revenue data yet</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-gray-300" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Occupancy</p>
                      <p className="text-2xl font-bold text-gray-900">0%</p>
                      <p className="text-xs text-gray-400 mt-1">No occupancy data yet</p>
                    </div>
                    <Building2 className="w-8 h-8 text-gray-300" />
                  </div>
                </Card>
              </div>

              {/* Renovation Summary */}
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Renovation Summary</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Last Draw Submission</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Minus className="w-3 h-3 mr-1" />
                      <span className="text-sm">No submissions yet</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Previous Draw Submission</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Minus className="w-3 h-3 mr-1" />
                      <span className="text-sm">No previous submissions</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Next Scheduled Inspection</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Minus className="w-3 h-3 mr-1" />
                      <span className="text-sm">Not scheduled</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Last Inspection Date</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Minus className="w-3 h-3 mr-1" />
                      <span className="text-sm">No inspections yet</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Progress Summary */}
              <Card className="p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Progress Summary</h2>
                  <Target className="w-6 h-6 text-blue-600" />
                </div>

                {/* Progress and Key Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                   {/* Visual Progress Indicator */}
                   <div className="flex flex-col items-center">
                     <div className="relative w-48 h-48 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                       <div className="text-center">
                         <div className="text-3xl font-bold text-gray-400">0%</div>
                         <div className="text-xs text-gray-400">Complete</div>
                       </div>
                     </div>
                     <div className="text-center">
                       <div className="text-sm font-medium text-gray-600 mb-1">Balance to Complete</div>
                       <div className="text-xl font-bold text-gray-400">$0</div>
                     </div>
                   </div>

                  {/* Key Metrics Grid */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Total Bid */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-500 mb-2">
                      <DollarSign className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Total Bid</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-400">$0</p>
                  </div>

                  {/* Total Invoice */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-500 mb-2">
                      <FileText className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Total Invoice</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-400">$0</p>
                  </div>

                  {/* Total Budget */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-500 mb-2">
                      <Target className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Total Budget</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-400">$0</p>
                  </div>

                  {/* Timeline */}
                   <div className="bg-gray-50 rounded-lg p-4">
                     <div className="flex items-center text-gray-500 mb-2">
                       <Calendar className="w-5 h-5 mr-2" />
                       <span className="text-sm font-medium">Target Date</span>
                     </div>
                     <p className="text-lg font-bold text-gray-400">Not set</p>
                     <p className="text-sm text-gray-400 font-medium mt-1">No timeline yet</p>
                   </div>
                 </div>
               </div>

                {/* Jobs Due Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Jobs Due</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Next 7 days</p>
                      <p className="text-xl font-bold text-gray-400">0</p>
                      <p className="text-xs text-gray-400">No jobs scheduled</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Next 2 weeks</p>
                      <p className="text-xl font-bold text-gray-400">0</p>
                      <p className="text-xs text-gray-400">No jobs scheduled</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Next 3 weeks</p>
                      <p className="text-xl font-bold text-gray-400">0</p>
                      <p className="text-xs text-gray-400">No jobs scheduled</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Next month</p>
                      <p className="text-xl font-bold text-gray-400">0</p>
                      <p className="text-xs text-gray-400">No jobs scheduled</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Overdue</p>
                      <p className="text-xl font-bold text-gray-400">0</p>
                      <p className="text-xs text-gray-400">All clear</p>
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
                    <Button onClick={handleAddUnits} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Unit
                    </Button>
                  </div>
                  
                  <div className="text-center py-12 text-gray-400">
                    <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                    <p className="text-lg font-medium mb-2">No units yet</p>
                    <p className="text-sm mb-4">Start by uploading your rent roll or adding units manually</p>
                    <div className="space-y-2">
                      <Button onClick={handleUploadRentRoll} className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Rent Roll
                      </Button>
                      <Button onClick={handleAddUnits} variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Unit Manually
                      </Button>
                    </div>
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

                    <div className="text-center py-8 text-gray-400">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                      <p className="text-sm">No recent activity</p>
                      <p className="text-xs">Activity will appear here as you work on your property</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Next Steps */}
              <Card className="p-6 mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Next Steps</h2>
                  <Target className="w-6 h-6 text-blue-600" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <div className="flex items-center text-blue-700 mb-2">
                      <Upload className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Upload Rent Roll</span>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">Import your unit data to get started</p>
                    <Button size="sm" className="w-full" onClick={handleUploadRentRoll}>
                      Upload Now
                    </Button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-500 mb-2">
                      <FileText className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Create First Bid</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Start getting quotes from contractors</p>
                    <Button size="sm" className="w-full" variant="secondary" disabled>
                      Coming Soon
                    </Button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-500 mb-2">
                      <Target className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Set Budget</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Define your renovation budget</p>
                    <Button size="sm" className="w-full" variant="secondary" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PropertyEmpty;