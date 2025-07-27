import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";

interface PropertyFormData {
  name: string;
  portfolio: string;
  assetManager: string;
  propertyType: string;
  buildings: string;
  yearBuilt: string;
  buildingType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  showExteriorParams: boolean;
  exteriorRenovation: string[];
  roofType: string;
  windowType: string;
  doorType: string;
  dogPark: boolean;
  entranceGate: boolean;
  pool: boolean;
  parkingSpots: string;
  grillStations: string;
}

const PropertyEdit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<PropertyFormData>({
    name: "",
    portfolio: "",
    assetManager: "",
    propertyType: "",
    buildings: "",
    yearBuilt: "",
    buildingType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    showExteriorParams: false,
    exteriorRenovation: [],
    roofType: "",
    windowType: "",
    doorType: "",
    dogPark: false,
    entranceGate: false,
    pool: false,
    parkingSpots: "",
    grillStations: ""
  });

  useEffect(() => {
    // Load property data from localStorage
    const savedProperty = localStorage.getItem('property');
    if (savedProperty) {
      const propertyData = JSON.parse(savedProperty);
      setFormData({
        name: propertyData.name || "",
        portfolio: "Apartment collection",
        assetManager: "Admin Renoquest",
        propertyType: "Affordable",
        buildings: "3",
        yearBuilt: propertyData.yearBuilt?.toString() || "1988",
        buildingType: "High rise",
        address: propertyData.address || "",
        city: propertyData.city || "",
        state: propertyData.state || "",
        zipCode: propertyData.zip || "",
        showExteriorParams: false,
        exteriorRenovation: [],
        roofType: "",
        windowType: "",
        doorType: "",
        dogPark: false,
        entranceGate: false,
        pool: false,
        parkingSpots: "",
        grillStations: ""
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update property data in localStorage
    const updatedProperty = {
      ...JSON.parse(localStorage.getItem('property') || '{}'),
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zipCode,
      yearBuilt: parseInt(formData.yearBuilt),
      propertyType: formData.propertyType
    };
    
    localStorage.setItem('property', JSON.stringify(updatedProperty));
    
    toast({
      title: "Property Updated",
      description: "Property has been successfully updated"
    });
    
    navigate("/properties");
  };

  const handleCancel = () => {
    navigate("/properties");
  };

  const PropertyEditContent = () => {
    const { open } = useSidebar();
    
    return (
      <div className="flex-1 relative">
        <div className={`fixed top-0 right-0 z-20 bg-white transition-all duration-200 ${open ? 'left-[240px]' : 'left-[56px]'}`}>
          <AppHeader />
        </div>
        <div className="pt-16 h-screen overflow-auto">
          <div className="max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex items-center mb-8">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancel}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Edit property</h1>
              <span className="ml-4 text-sm text-red-500">* Mandatory fields</span>
            </div>

            <form onSubmit={handleSubmit}>
              <Card className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">* Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  

                  <div className="space-y-2">
                    <Label htmlFor="assetManager">Asset Manager</Label>
                    <Select value={formData.assetManager} onValueChange={(value) => setFormData({...formData, assetManager: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin Renoquest">Admin Renoquest</SelectItem>
                        <SelectItem value="John Smith">John Smith</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select value={formData.propertyType} onValueChange={(value) => setFormData({...formData, propertyType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Student housing">Student housing</SelectItem>
                        <SelectItem value="Military">Military</SelectItem>
                        <SelectItem value="Conventional">Conventional</SelectItem>
                        <SelectItem value="Senior living housing">Senior living housing</SelectItem>
                        <SelectItem value="Affordable">Affordable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buildings">* Buildings</Label>
                    <Input
                      id="buildings"
                      type="number"
                      value={formData.buildings}
                      onChange={(e) => setFormData({...formData, buildings: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearBuilt">Year Built</Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      value={formData.yearBuilt}
                      onChange={(e) => setFormData({...formData, yearBuilt: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buildingType">Building Type</Label>
                    <Select value={formData.buildingType} onValueChange={(value) => setFormData({...formData, buildingType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select building type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Garden style">Garden style</SelectItem>
                        <SelectItem value="Mid rise">Mid rise</SelectItem>
                        <SelectItem value="High rise">High rise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">* Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">* City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">* State</Label>
                      <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA">CA</SelectItem>
                          <SelectItem value="CT">CT</SelectItem>
                          <SelectItem value="NY">NY</SelectItem>
                          <SelectItem value="TX">TX</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">* ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Exterior Parameters Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.showExteriorParams}
                    onCheckedChange={(checked) => setFormData({...formData, showExteriorParams: checked})}
                  />
                  <Label>Show Exterior and General parameters</Label>
                </div>

                {/* Exterior Section */}
                {formData.showExteriorParams && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Exterior</h3>
                      
                      {/* Exterior and General Renovation Multi-select */}
                      <div className="space-y-2 mb-6">
                        <Label>Exterior and General Renovation</Label>
                        <div className="border rounded-md p-3 space-y-2">
                          {/* Selected items display */}
                          {formData.exteriorRenovation.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2" style={{ scrollSnapType: 'none' }}>
                              {formData.exteriorRenovation.map((item) => (
                                <span 
                                  key={item} 
                                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center select-none"
                                  style={{ scrollSnapAlign: 'none' }}
                                >
                                  {item}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setFormData(prev => ({
                                        ...prev, 
                                        exteriorRenovation: prev.exteriorRenovation.filter(i => i !== item)
                                      }));
                                    }}
                                    className="ml-2 text-blue-600 hover:text-blue-800 select-none"
                                    tabIndex={-1}
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Checkboxes */}
                          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                            {['Brick', 'Cement', 'Stone', 'Stucco', 'Wood or vinyl siding'].map((option) => (
                              <div 
                                key={option} 
                                className="flex items-center space-x-2 cursor-pointer select-none"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const isCurrentlyChecked = formData.exteriorRenovation.includes(option);
                                  setFormData(prev => ({
                                    ...prev,
                                    exteriorRenovation: isCurrentlyChecked 
                                      ? prev.exteriorRenovation.filter(item => item !== option)
                                      : [...prev.exteriorRenovation, option]
                                  }));
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.exteriorRenovation.includes(option)}
                                  onChange={() => {}}
                                  onFocus={(e) => e.target.blur()}
                                  className="rounded pointer-events-none"
                                  tabIndex={-1}
                                  disabled={false}
                                  readOnly
                                />
                                <span>{option}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="roofType">Roof Type</Label>
                          <Select value={formData.roofType} onValueChange={(value) => setFormData({...formData, roofType: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Asphalt shingles">Asphalt shingles</SelectItem>
                              <SelectItem value="Flat or slope">Flat or slope</SelectItem>
                              <SelectItem value="Concrete clay or ceramic tile">Concrete clay or ceramic tile</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="windowType">Window Type</Label>
                          <Select value={formData.windowType} onValueChange={(value) => setFormData({...formData, windowType: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Aluminium-Framed">Aluminium-Framed</SelectItem>
                              <SelectItem value="Wood-Framed">Wood-Framed</SelectItem>
                              <SelectItem value="Vinyl-Framed">Vinyl-Framed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="doorType">Door Type</Label>
                          <Select value={formData.doorType} onValueChange={(value) => setFormData({...formData, doorType: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Please select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Metal">Metal</SelectItem>
                              <SelectItem value="Wood">Wood</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* General Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">General</h3>
                      
                      <div className="grid grid-cols-3 gap-8 mb-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Dog Park</Label>
                            <div className="flex space-x-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  checked={formData.dogPark === true}
                                  onChange={() => setFormData({...formData, dogPark: true})}
                                />
                                <span>Yes</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  checked={formData.dogPark === false}
                                  onChange={() => setFormData({...formData, dogPark: false})}
                                />
                                <span>No</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Entrance/Exit Gate</Label>
                            <div className="flex space-x-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  checked={formData.entranceGate === true}
                                  onChange={() => setFormData({...formData, entranceGate: true})}
                                />
                                <span>Yes</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  checked={formData.entranceGate === false}
                                  onChange={() => setFormData({...formData, entranceGate: false})}
                                />
                                <span>No</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Pool</Label>
                            <div className="flex space-x-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  checked={formData.pool === true}
                                  onChange={() => setFormData({...formData, pool: true})}
                                />
                                <span>Yes</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  checked={formData.pool === false}
                                  onChange={() => setFormData({...formData, pool: false})}
                                />
                                <span>No</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="parkingSpots">Number of Parking Spots</Label>
                          <Input
                            id="parkingSpots"
                            type="number"
                            value={formData.parkingSpots}
                            onChange={(e) => setFormData({...formData, parkingSpots: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="grillStations">Number of Grill Stations</Label>
                          <Input
                            id="grillStations"
                            type="number"
                            value={formData.grillStations}
                            onChange={(e) => setFormData({...formData, grillStations: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Update Property
                  </Button>
                </div>
              </Card>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar />
        <PropertyEditContent />
      </div>
    </SidebarProvider>
  );
};

export default PropertyEdit;