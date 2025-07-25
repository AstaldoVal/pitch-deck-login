import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { 
  Building2, 
  Plus, 
  Users,
  Search,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PropertySidebar } from "@/components/PropertySidebar";
import { AppHeader } from "@/components/AppHeader";
import { Input } from "@/components/ui/input";

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

const PropertyUnits = () => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load property data from localStorage (for prototype)
    const savedProperty = localStorage.getItem('property');
    if (savedProperty) {
      setPropertyData(JSON.parse(savedProperty));
    }
  }, []);

  const handleAddUnit = () => {
    toast({
      title: "Adding Unit",
      description: "This feature will be available in the next version"
    });
  };

  const handleImportUnits = () => {
    toast({
      title: "Import Units",
      description: "This feature will be available in the next version"
    });
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
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Units</h1>
                    <p className="text-gray-600 mt-1">
                      Manage units for {propertyData.name}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleImportUnits}>
                      <Building2 className="w-4 h-4 mr-2" />
                      Import from Rent Roll
                    </Button>
                    <Button onClick={handleAddUnit}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Unit
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <Card className="p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input 
                      placeholder="Search units..." 
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </Card>

              {/* Units Content */}
              <Card className="p-8">
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-medium mb-2">No units added yet</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Get started by adding your first unit or importing units from a rent roll file
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={handleImportUnits}>
                      <Building2 className="w-4 h-4 mr-2" />
                      Import from Rent Roll
                    </Button>
                    <Button onClick={handleAddUnit}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Unit
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

export default PropertyUnits;