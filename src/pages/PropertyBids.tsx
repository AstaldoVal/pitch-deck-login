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
import { CalendarIcon, Plus, X, Upload, FileText, User, Mail, Phone, Building, ChevronDown } from "lucide-react";
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
  isExpanded?: boolean;
}

export default function PropertyBids() {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [scopeType, setScopeType] = useState<"job-type" | "unit-based">("job-type");
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
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
      // Check if category already exists
      const categoryExists = jobCategories.some(cat => cat.name === newCategory.trim());
      if (!categoryExists) {
        const newJobCategory = {
          id: Date.now().toString(),
          name: newCategory.trim(),
          isExpanded: false
        };
        setJobCategories([newJobCategory, ...jobCategories]);
      }
      setNewCategory("");
    }
  };

  const toggleCategoryExpansion = (id: string) => {
    setJobCategories(categories =>
      categories.map(cat =>
        cat.id === id ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    );
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
          <div className="flex-1 p-8 space-y-12 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Create Renovation Bid</h1>
                <p className="text-muted-foreground mt-2">Generate detailed renovation proposals for contractors</p>
              </div>
              <Button size="lg" className="px-8">Submit Bid</Button>
            </div>

            {/* Basic Information */}
            <section className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
              </div>
              
              {/* Bid Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Bid Details</h3>
                    </div>
                    <div className="space-y-4 pl-7">
                      <div>
                        <Label className="text-sm text-muted-foreground">Bid Number</Label>
                        <p className="font-semibold text-xl mt-1">{generateBidNumber()}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Generated By</Label>
                        <Input 
                          value={generatedBy}
                          onChange={(e) => setGeneratedBy(e.target.value)}
                          className="mt-1 border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                        />
                      </div>
                      {propertyData && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Asset Manager</Label>
                          <p className="font-medium mt-1">{propertyData.assetManager || "Not assigned"}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Contact Information</h3>
                    </div>
                    <div className="space-y-4 pl-7">
                      <div>
                        <Label className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          Email
                        </Label>
                        <Input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Phone
                        </Label>
                        <Input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="mt-1 border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          Company
                        </Label>
                        <Input 
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="mt-1 border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Information */}
              {propertyData && (
                <div className="pt-8 border-t border-border/40">
                  <div className="flex items-center gap-2 mb-6">
                    <Building className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Property Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pl-7">
                    <div>
                      <Label className="text-sm text-muted-foreground">Property Name</Label>
                      <p className="font-medium mt-1">{propertyData.name}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm text-muted-foreground">Address</Label>
                      <p className="font-medium mt-1">{propertyData.address}, {propertyData.city}, {propertyData.state} {propertyData.zip}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Year Built / Building Type</Label>
                      <p className="font-medium mt-1">{propertyData.yearBuilt || "Not specified"} • {propertyData.buildingType || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Contractors Section */}
            <section className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold">Contractors</h2>
                <p className="text-muted-foreground mt-1">Add up to 5 contractors for this bid</p>
              </div>
              
              {contractors.length > 0 && (
                <div className="space-y-3">
                  {contractors.map((contractor) => (
                    <div key={contractor.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border-l-4 border-l-primary/30">
                      <div>
                        <div className="font-semibold">{contractor.companyName}</div>
                        <div className="text-sm text-muted-foreground">
                          {contractor.firstName} {contractor.lastName} • {contractor.email}
                          {contractor.location && ` • ${contractor.location}`}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContractor(contractor.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {contractors.length < 5 && (
                <div className="space-y-6 p-6 bg-muted/10 rounded-xl">
                  <h4 className="font-medium text-lg">Add New Contractor</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Company Name *</Label>
                      <Input
                        value={newContractor.companyName}
                        onChange={(e) => setNewContractor({...newContractor, companyName: e.target.value})}
                        placeholder="Company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Location</Label>
                      <Input
                        value={newContractor.location}
                        onChange={(e) => setNewContractor({...newContractor, location: e.target.value})}
                        placeholder="City, State"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">First Name *</Label>
                      <Input
                        value={newContractor.firstName}
                        onChange={(e) => setNewContractor({...newContractor, firstName: e.target.value})}
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Last Name *</Label>
                      <Input
                        value={newContractor.lastName}
                        onChange={(e) => setNewContractor({...newContractor, lastName: e.target.value})}
                        placeholder="Last name"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-medium">Email Address *</Label>
                      <Input
                        type="email"
                        value={newContractor.email}
                        onChange={(e) => setNewContractor({...newContractor, email: e.target.value})}
                        placeholder="email@company.com"
                      />
                    </div>
                  </div>
                  <Button onClick={addContractor} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Contractor
                  </Button>
                </div>
              )}
            </section>

            {/* Scope Selection */}
            <section className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold">Scope Type</h2>
                <p className="text-muted-foreground mt-1">Choose how to define the project scope</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setScopeType("job-type")}
                  className={cn(
                    "p-6 text-left rounded-xl border-2 transition-all",
                    scopeType === "job-type" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-border/60 hover:bg-muted/20"
                  )}
                >
                  <div className="font-semibold text-lg">Job-Type Scope</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Driven by job categories and associated units/floorplans
                  </div>
                </button>
                <button
                  onClick={() => setScopeType("unit-based")}
                  className={cn(
                    "p-6 text-left rounded-xl border-2 transition-all",
                    scopeType === "unit-based" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-border/60 hover:bg-muted/20"
                  )}
                >
                  <div className="font-semibold text-lg">Unit-Based Scope</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Driven by selected units and associated job categories
                  </div>
                </button>
              </div>
            </section>

            {/* Job Categories */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Job Categories</h2>
                  <p className="text-muted-foreground mt-1">Define the work scope for contractors</p>
                </div>
                {/* Add New Job Category */}
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border">
                  <span className="text-sm font-medium whitespace-nowrap">Add Category:</span>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flooring">Flooring</SelectItem>
                      <SelectItem value="Kitchen">Kitchen</SelectItem>
                      <SelectItem value="Bathroom">Bathroom</SelectItem>
                      <SelectItem value="Painting">Painting</SelectItem>
                      <SelectItem value="HVAC">HVAC</SelectItem>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Appliances">Appliances</SelectItem>
                      <SelectItem value="Windows">Windows</SelectItem>
                      <SelectItem value="Doors">Doors</SelectItem>
                      <SelectItem value="Roofing">Roofing</SelectItem>
                      <SelectItem value="Landscaping">Landscaping</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addJobCategory} disabled={!newCategory} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Selected Job Categories */}
              {jobCategories.length > 0 && (
                <div className="space-y-6">
                  {jobCategories.map((category) => (
                    <div key={category.id} className="border-l-4 border-l-primary/30 pl-6 py-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleCategoryExpansion(category.id)}>
                          <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", category.isExpanded ? "rotate-180" : "")} />
                          <Badge variant="secondary" className="text-base px-3 py-1">{category.name}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeJobCategory(category.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {category.isExpanded && (
                        <div className="space-y-6 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Material Spec/Finish</Label>
                              <Input
                                placeholder="Specify materials or finishes"
                                value={category.materialSpec || ""}
                                onChange={(e) => updateJobCategory(category.id, "materialSpec", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Product Information</Label>
                              <Input
                                placeholder="Product details"
                                value={category.productInfo || ""}
                                onChange={(e) => updateJobCategory(category.id, "productInfo", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Dimensions</Label>
                              <Input
                                placeholder="Size specifications"
                                value={category.dimensions || ""}
                                onChange={(e) => updateJobCategory(category.id, "dimensions", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Quantity</Label>
                              <Input
                                placeholder="Number of units"
                                value={category.quantity || ""}
                                onChange={(e) => updateJobCategory(category.id, "quantity", e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Notes</Label>
                            <Textarea
                              placeholder="Additional notes or requirements"
                              value={category.notes || ""}
                              onChange={(e) => updateJobCategory(category.id, "notes", e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Additional Files</Label>
                            <Button variant="outline" className="w-full">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}