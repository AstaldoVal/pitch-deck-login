import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CalendarIcon, Plus, X, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PropertySidebar } from "@/components/PropertySidebar";
import { AppHeader } from "@/components/AppHeader";

interface Contractor {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
}

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

interface JobCategory {
  id: string;
  name: string;
  materialSpec?: string;
  productInfo?: string;
  dimensions?: string;
  quantity?: string;
  notes?: string;
  files?: File[];
}

export default function PropertyBids() {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [scopeType, setScopeType] = useState<"job-type" | "unit-based">("job-type");
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([
    { id: "1", name: "Flooring" },
    { id: "2", name: "Kitchen" },
    { id: "3", name: "Bathroom" },
    { id: "4", name: "Painting" },
    { id: "5", name: "HVAC" },
    { id: "6", name: "Plumbing" },
    { id: "7", name: "Electrical" }
  ]);
  const [newContractor, setNewContractor] = useState<Contractor>({
    id: "",
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    location: ""
  });
  const [newCategory, setNewCategory] = useState("");
  
  // Form data with defaults
  const [generatedBy, setGeneratedBy] = useState("Roman Matsukatov");
  const [email, setEmail] = useState("roman.matsukatov@company.com");
  const [phone, setPhone] = useState("(555) 123-4567");
  const [companyName, setCompanyName] = useState("Property Management LLC");

  useEffect(() => {
    // Load property data from localStorage
    const savedProperty = localStorage.getItem('property');
    if (savedProperty) {
      setPropertyData(JSON.parse(savedProperty));
    }
  }, []);

  const generateBidNumber = () => {
    return `BID-${Date.now().toString().slice(-6)}`;
  };

  const addContractor = () => {
    if (contractors.length >= 5) return;
    
    if (newContractor.companyName && newContractor.firstName && newContractor.lastName && newContractor.email) {
      setContractors([...contractors, { ...newContractor, id: Date.now().toString() }]);
      setNewContractor({
        id: "",
        companyName: "",
        firstName: "",
        lastName: "",
        email: "",
        location: ""
      });
    }
  };

  const removeContractor = (id: string) => {
    setContractors(contractors.filter(contractor => contractor.id !== id));
  };

  const addJobCategory = () => {
    if (newCategory.trim()) {
      setJobCategories([...jobCategories, {
        id: Date.now().toString(),
        name: newCategory.trim()
      }]);
      setNewCategory("");
    }
  };

  const updateJobCategory = (id: string, field: keyof JobCategory, value: string) => {
    setJobCategories(categories =>
      categories.map(cat =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    );
  };

  const removeJobCategory = (id: string) => {
    setJobCategories(categories => categories.filter(cat => cat.id !== id));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <PropertySidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div className="flex-1 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Create Renovation Bid</h1>
              <Button>Submit Bid</Button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Property Information */}
                  {propertyData && (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                      <h4 className="font-medium text-sm text-muted-foreground">Property Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-xs text-muted-foreground">Property Name</Label>
                          <p className="font-medium">{propertyData.name}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Property Type</Label>
                          <p className="font-medium">{propertyData.propertyType}</p>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs text-muted-foreground">Address</Label>
                          <p className="font-medium">{propertyData.address}, {propertyData.city}, {propertyData.state} {propertyData.zip}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="bidNumber">Bid Number</Label>
                    <Input 
                      id="bidNumber" 
                      value={generateBidNumber()} 
                      readOnly 
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="generatedBy">Generated By</Label>
                    <Input 
                      id="generatedBy" 
                      value={generatedBy}
                      onChange={(e) => setGeneratedBy(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telephone #</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input 
                      id="companyName" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Contractors Section */}
            <Card>
              <CardHeader>
                <CardTitle>Contractors (up to 5)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contractors.length > 0 && (
                  <div className="space-y-2">
                    {contractors.map((contractor) => (
                      <div key={contractor.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{contractor.companyName}</div>
                          <div className="text-sm text-muted-foreground">
                            {contractor.firstName} {contractor.lastName} • {contractor.email}
                            {contractor.location && ` • ${contractor.location}`}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContractor(contractor.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {contractors.length < 5 && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium">Add New Contractor</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company Name *</Label>
                        <Input
                          value={newContractor.companyName}
                          onChange={(e) => setNewContractor({...newContractor, companyName: e.target.value})}
                          placeholder="Company name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={newContractor.location}
                          onChange={(e) => setNewContractor({...newContractor, location: e.target.value})}
                          placeholder="City, State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>First Name *</Label>
                        <Input
                          value={newContractor.firstName}
                          onChange={(e) => setNewContractor({...newContractor, firstName: e.target.value})}
                          placeholder="First name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name *</Label>
                        <Input
                          value={newContractor.lastName}
                          onChange={(e) => setNewContractor({...newContractor, lastName: e.target.value})}
                          placeholder="Last name"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Email Address *</Label>
                        <Input
                          type="email"
                          value={newContractor.email}
                          onChange={(e) => setNewContractor({...newContractor, email: e.target.value})}
                          placeholder="email@company.com"
                        />
                      </div>
                    </div>
                    <Button onClick={addContractor} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Contractor
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scope Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Scope Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={scopeType === "job-type" ? "default" : "outline"}
                      onClick={() => setScopeType("job-type")}
                      className="h-auto p-4 text-left"
                    >
                      <div>
                        <div className="font-medium">Job-Type Scope</div>
                        <div className="text-sm opacity-80 mt-1">
                          Driven by job categories and associated units/floorplans
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant={scopeType === "unit-based" ? "default" : "outline"}
                      onClick={() => setScopeType("unit-based")}
                      className="h-auto p-4 text-left"
                    >
                      <div>
                        <div className="font-medium">Unit-Based Scope</div>
                        <div className="text-sm opacity-80 mt-1">
                          Driven by selected units and associated job categories
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Job Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobCategories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{category.name}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeJobCategory(category.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Material Spec/Finish</Label>
                        <Input
                          placeholder="Specify materials or finishes"
                          value={category.materialSpec || ""}
                          onChange={(e) => updateJobCategory(category.id, "materialSpec", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Product Information</Label>
                        <Input
                          placeholder="Product details"
                          value={category.productInfo || ""}
                          onChange={(e) => updateJobCategory(category.id, "productInfo", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dimensions</Label>
                        <Input
                          placeholder="Size specifications"
                          value={category.dimensions || ""}
                          onChange={(e) => updateJobCategory(category.id, "dimensions", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          placeholder="Number of units"
                          value={category.quantity || ""}
                          onChange={(e) => updateJobCategory(category.id, "quantity", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        placeholder="Additional notes or requirements"
                        value={category.notes || ""}
                        onChange={(e) => updateJobCategory(category.id, "notes", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Additional Files</Label>
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Files
                      </Button>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom job category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addJobCategory()}
                  />
                  <Button onClick={addJobCategory}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}