import { useState, useEffect, useRef } from "react";
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
  const scrollPositionRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
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

  // Preserve scroll position on form data changes
  const preserveScrollPosition = () => {
    if (containerRef.current) {
      scrollPositionRef.current = containerRef.current.scrollTop;
    }
  };

  const restoreScrollPosition = () => {
    if (containerRef.current && scrollPositionRef.current > 0) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = scrollPositionRef.current;
        }
      }, 0);
    }
  };

  const setFormDataWithScrollPreservation = (newData: PropertyFormData | ((prev: PropertyFormData) => PropertyFormData)) => {
    preserveScrollPosition();
    setFormData(newData);
    restoreScrollPosition();
  };

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
        <div className={`h-16 fixed top-0 right-0 z-20 bg-white transition-all duration-200 ${open ? 'left-[240px]' : 'left-[56px]'}`}>
          <AppHeader />
        </div>
        <div ref={containerRef} className="flex-1 overflow-y-scroll pt-16 scroll-smooth">
          <div className="max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="relative mb-8">
              <div className="absolute top-0 right-0">
                <span className="text-sm text-red-500">Mandatory fields *</span>
              </div>
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCancel}
                  className="mr-4 p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">Edit property</h1>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <Card className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormDataWithScrollPreservation({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  

                  <div className="space-y-2">
                    <Label htmlFor="assetManager">Asset Manager</Label>
                    <Select value={formData.assetManager} onValueChange={(value) => setFormDataWithScrollPreservation({...formData, assetManager: value})}>
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
                    <Select value={formData.propertyType} onValueChange={(value) => setFormDataWithScrollPreservation({...formData, propertyType: value})}>
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
                    <Label htmlFor="buildings">Buildings <span className="text-red-500">*</span></Label>
                    <Input
                      id="buildings"
                      type="number"
                      value={formData.buildings}
                      onChange={(e) => setFormDataWithScrollPreservation({...formData, buildings: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearBuilt">Year Built</Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      value={formData.yearBuilt}
                      onChange={(e) => setFormDataWithScrollPreservation({...formData, yearBuilt: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buildingType">Building Type</Label>
                    <Select value={formData.buildingType} onValueChange={(value) => setFormDataWithScrollPreservation({...formData, buildingType: value})}>
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
                    <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormDataWithScrollPreservation({...formData, address: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormDataWithScrollPreservation({...formData, city: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                      <Select value={formData.state} onValueChange={(value) => setFormDataWithScrollPreservation({...formData, state: value})}>
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
                      <Label htmlFor="zipCode">ZIP Code <span className="text-red-500">*</span></Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormDataWithScrollPreservation({...formData, zipCode: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Exterior Parameters Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.showExteriorParams}
                    onCheckedChange={(checked) => setFormDataWithScrollPreservation({...formData, showExteriorParams: checked})}
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
                                      e.stopPropagation();
                                      setFormDataWithScrollPreservation(prev => ({
                                        ...prev, 
                                        exteriorRenovation: prev.exteriorRenovation.filter(i => i !== item)
                                      }));
                                    }}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Checkboxes */}
                          <div className="space-y-2">
                            {['Brick', 'Cement', 'Stone', 'Stucco', 'Wood or vinyl siding'].map((option) => (
                              <div key={option} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={formData.exteriorRenovation.includes(option)}
                                  onChange={(e) => {
                                    const isCurrentlyChecked = formData.exteriorRenovation.includes(option);
                                    setFormDataWithScrollPreservation(prev => ({
                                      ...prev,
                                      exteriorRenovation: isCurrentlyChecked 
                                        ? prev.exteriorRenovation.filter(item => item !== option)
                                        : [...prev.exteriorRenovation, option]
                                    }));
                                  }}
                                  className="rounded"
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
                          <Select value={formData.roofType} onValueChange={(value) => setFormDataWithScrollPreservation({...formData, roofType: value})}>
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
                          <Select value={formData.windowType} onValueChange={(value) => setFormDataWithScrollPreservation({...formData, windowType: value})}>
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
                          <Select value={formData.doorType} onValueChange={(value) => setFormDataWithScrollPreservation({...formData, doorType: value})}>
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Dog Park</Label>
                          <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                checked={formData.dogPark === true}
                                onChange={() => setFormDataWithScrollPreservation({...formData, dogPark: true})}
                              />
                              <span>Yes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                checked={formData.dogPark === false}
                                onChange={() => setFormDataWithScrollPreservation({...formData, dogPark: false})}
                              />
                              <span>No</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Entrance/Exit Gate</Label>
                          <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                checked={formData.entranceGate === true}
                                onChange={() => setFormDataWithScrollPreservation({...formData, entranceGate: true})}
                              />
                              <span>Yes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                checked={formData.entranceGate === false}
                                onChange={() => setFormDataWithScrollPreservation({...formData, entranceGate: false})}
                              />
                              <span>No</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Pool</Label>
                          <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                checked={formData.pool === true}
                                onChange={() => setFormDataWithScrollPreservation({...formData, pool: true})}
                              />
                              <span>Yes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                checked={formData.pool === false}
                                onChange={() => setFormDataWithScrollPreservation({...formData, pool: false})}
                              />
                              <span>No</span>
                            </label>
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
                            onChange={(e) => setFormDataWithScrollPreservation({...formData, parkingSpots: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="grillStations">Number of Grill Stations</Label>
                          <Input
                            id="grillStations"
                            type="number"
                            value={formData.grillStations}
                            onChange={(e) => setFormDataWithScrollPreservation({...formData, grillStations: e.target.value})}
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