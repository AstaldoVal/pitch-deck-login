import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Building2, 
  Edit3,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { useNavigate } from "react-router-dom";

interface PropertyData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  units: number;
  yearBuilt?: number;
  asset: string;
  hasRentRoll: boolean;
  rentRollFile?: string;
}

const Properties = () => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load property data from localStorage
    const savedProperty = localStorage.getItem('property');
    if (savedProperty) {
      const propertyData = JSON.parse(savedProperty);
      // Convert to table format with additional fields
      const tableProperty: PropertyData = {
        id: '1',
        name: propertyData.name,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        zip: propertyData.zip,
        propertyType: propertyData.propertyType,
        units: 0, // Default as no units added yet
        asset: 'Real Estate',
        hasRentRoll: propertyData.hasRentRoll,
        rentRollFile: propertyData.rentRollFile
      };
      setProperties([tableProperty]);
    }
  }, []);

  const handleEdit = (propertyId: string) => {
    toast({
      title: "Редактирование",
      description: "Функция редактирования будет доступна в следующей версии"
    });
  };

  const handleAddProperty = () => {
    navigate("/onboarding");
  };

  const handlePropertyClick = (property: PropertyData) => {
    // Save property data for detailed view
    localStorage.setItem('property', JSON.stringify(property));
    navigate("/property");
  };

  const getPropertyTypeBadge = (type: string) => {
    const colors = {
      'Apartment Complex': 'bg-blue-100 text-blue-800',
      'Single Family': 'bg-green-100 text-green-800',
      'Commercial': 'bg-purple-100 text-purple-800',
      'Office Building': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-screen">
          <AppHeader />
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Page Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
                  <p className="text-gray-600 mt-2">Manage your property portfolio</p>
                </div>
                <Button onClick={handleAddProperty} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </div>

              {/* Properties Table */}
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold whitespace-nowrap min-w-[120px]">Name</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap min-w-[80px]">Units</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap min-w-[100px]">Year Built</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap min-w-[200px]">Address</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap min-w-[120px]">City</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap min-w-[80px]">State</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap min-w-[100px]">ZIP Code</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap min-w-[120px]">Property Type</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap min-w-[100px]">Asset</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap min-w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-12">
                          <div className="flex flex-col items-center">
                            <Building2 className="w-12 h-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
                            <p className="text-gray-500 mb-4">Get started by adding your first property</p>
                            <Button onClick={handleAddProperty} variant="outline">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Property
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      properties.map((property) => (
                        <TableRow 
                          key={property.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handlePropertyClick(property)}
                        >
                          <TableCell className="font-medium text-blue-600">
                            {property.name}
                          </TableCell>
                          <TableCell>{property.units}</TableCell>
                          <TableCell>{property.yearBuilt}</TableCell>
                          <TableCell>{property.address}</TableCell>
                          <TableCell>{property.city}</TableCell>
                          <TableCell>{property.state}</TableCell>
                          <TableCell>{property.zip}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getPropertyTypeBadge(property.propertyType)}>
                              {property.propertyType}
                            </Badge>
                          </TableCell>
                          <TableCell>{property.asset}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(property.id);
                              }}
                              className="text-gray-600 hover:text-blue-600"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                </div>
              </Card>

              {/* Table Footer */}
              {properties.length > 0 && (
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>Total {properties.length} items</span>
                  {properties.length > 40 && (
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <span className="px-3 py-1 bg-blue-600 text-white rounded">1</span>
                      <Button variant="outline" size="sm" disabled>
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Properties;