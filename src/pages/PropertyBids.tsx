import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Plus, X, Upload, FileText, User, Mail, Phone, Building, ChevronDown, ChevronLeft, ChevronRight, Check, Home } from "lucide-react";
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
  unitType?: string;
  notes?: string;
}

interface Unit {
  id: string;
  name: string;
  type: string;
  sqft: number;
}

interface Step {
  number: number;
  title: string;
  description: string;
}

export default function PropertyBids() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [scopeType, setScopeType] = useState<'job-types' | 'unit-based'>('job-types');
  
  // Property Data
  const [propertyData, setPropertyData] = useState<PropertyData>({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    propertyType: "",
    hasRentRoll: false,
  });

  // Job Categories
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  // Units
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
  
  // Contractors
  const [contractors, setContractors] = useState<Contractor[]>([]);
  
  // Project details
  const [projectName, setProjectName] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const steps: Step[] = [
    { number: 1, title: "Property Information", description: "Basic property details" },
    { number: 2, title: "Scope Type", description: "Choose your scope approach" },
    { number: 3, title: "Define Scope", description: "Select work details" },
    { number: 4, title: "Project Details", description: "Timeline and specifications" },
    { number: 5, title: "Select Contractors", description: "Choose contractors for bidding" },
  ];

  // Load sample data on mount
  useEffect(() => {
    const sampleJobCategories: JobCategory[] = [
      { id: '1', name: 'Kitchen Cabinets', materialSpec: 'Solid Wood', productInfo: 'Shaker Style' },
      { id: '2', name: 'Flooring', materialSpec: 'Luxury Vinyl Plank', productInfo: '8mm thickness' },
      { id: '3', name: 'Bathroom Vanity', materialSpec: 'Granite Countertop', productInfo: '36" width' },
      { id: '4', name: 'Interior Paint', materialSpec: 'Benjamin Moore', productInfo: 'Eggshell finish' },
      { id: '5', name: 'HVAC', materialSpec: 'Central Air', productInfo: '3 Ton Unit' },
      { id: '6', name: 'Electrical', materialSpec: 'Updated Panel', productInfo: '200 Amp' },
      { id: '7', name: 'Plumbing', materialSpec: 'Copper Pipes', productInfo: 'Full replacement' },
      { id: '8', name: 'Windows', materialSpec: 'Double Pane', productInfo: 'Vinyl frame' },
    ];
    setJobCategories(sampleJobCategories);

    const sampleUnits: Unit[] = [
      { id: '1', name: 'Unit 101', type: '1 Bedroom', sqft: 750 },
      { id: '2', name: 'Unit 102', type: '2 Bedroom', sqft: 1100 },
      { id: '3', name: 'Unit 201', type: '1 Bedroom', sqft: 750 },
      { id: '4', name: 'Unit 202', type: '2 Bedroom', sqft: 1100 },
      { id: '5', name: 'Unit 301', type: 'Studio', sqft: 500 },
    ];
    setUnits(sampleUnits);

    const sampleContractors: Contractor[] = [
      {
        id: '1',
        companyName: 'Acme Construction',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@acmeconstruction.com',
        location: 'New York, NY'
      },
      {
        id: '2',
        companyName: 'Premium Renovators',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@premiumreno.com',
        location: 'Brooklyn, NY'
      },
      {
        id: '3',
        companyName: 'Elite Builders',
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike@elitebuilders.com',
        location: 'Queens, NY'
      }
    ];
    setContractors(sampleContractors);
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleScopeTypeChange = (type: 'job-types' | 'unit-based') => {
    setScopeType(type);
    // Clear selections when switching scope types
    setSelectedCategories(new Set());
    setSelectedUnits(new Set());
  };

  const toggleCategory = (categoryId: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  const toggleUnit = (unitId: string) => {
    const newSelected = new Set(selectedUnits);
    if (newSelected.has(unitId)) {
      newSelected.delete(unitId);
    } else {
      newSelected.add(unitId);
    }
    setSelectedUnits(newSelected);
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your bid has been saved as a draft.",
    });
  };

  const handleCreateBid = () => {
    const bidData = {
      id: Date.now().toString(),
      propertyData,
      scopeType,
      selectedCategories: Array.from(selectedCategories),
      selectedUnits: Array.from(selectedUnits),
      jobCategories: jobCategories.filter(cat => selectedCategories.has(cat.id)),
      units: units.filter(unit => selectedUnits.has(unit.id)),
      projectName,
      dueDate,
      description,
      specialInstructions,
      contractors: contractors.map(c => c.id),
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    // Сохраняем бид в localStorage (можно заменить на API)
    const savedBids = JSON.parse(localStorage.getItem('propertyBids') || '[]');
    savedBids.push(bidData);
    localStorage.setItem('propertyBids', JSON.stringify(savedBids));

    // Переходим на страницу списка бидов и показываем тост
    navigate('/property/bids-list');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-background via-background to-accent/10">
        <PropertySidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div className="flex-1 p-8 pb-24 space-y-6">
            {/* Header with Stepper */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Create Renovation Bid
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Define your project scope and invite contractors to bid
                </p>
              </div>
            </div>

            {/* Progress Stepper */}
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold",
                        currentStep >= step.number
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-border text-muted-foreground"
                      )}
                    >
                      {currentStep > step.number ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-0.5 mx-4",
                          currentStep > step.number
                            ? "bg-primary"
                            : "bg-border"
                        )}
                      />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      "text-sm font-medium",
                      currentStep >= step.number
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Step Content */}
            {currentStep === 1 && (
              /* Property Information */
              <section className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Property Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="propertyName">Property Name *</Label>
                        <Input
                          id="propertyName"
                          value={propertyData.name}
                          onChange={(e) => setPropertyData({ ...propertyData, name: e.target.value })}
                          placeholder="Enter property name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="propertyType">Property Type *</Label>
                        <Select
                          value={propertyData.propertyType}
                          onValueChange={(value) => setPropertyData({ ...propertyData, propertyType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment Complex</SelectItem>
                            <SelectItem value="single-family">Single Family</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="condo">Condominium</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          value={propertyData.address}
                          onChange={(e) => setPropertyData({ ...propertyData, address: e.target.value })}
                          placeholder="Street address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={propertyData.city}
                          onChange={(e) => setPropertyData({ ...propertyData, city: e.target.value })}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={propertyData.state}
                          onChange={(e) => setPropertyData({ ...propertyData, state: e.target.value })}
                          placeholder="State"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code *</Label>
                        <Input
                          id="zip"
                          value={propertyData.zip}
                          onChange={(e) => setPropertyData({ ...propertyData, zip: e.target.value })}
                          placeholder="ZIP code"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearBuilt">Year Built</Label>
                        <Input
                          id="yearBuilt"
                          type="number"
                          value={propertyData.yearBuilt || ''}
                          onChange={(e) => setPropertyData({ ...propertyData, yearBuilt: parseInt(e.target.value) || undefined })}
                          placeholder="e.g. 1995"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assetManager">Asset Manager</Label>
                        <Input
                          id="assetManager"
                          value={propertyData.assetManager || ''}
                          onChange={(e) => setPropertyData({ ...propertyData, assetManager: e.target.value })}
                          placeholder="Asset manager name"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {currentStep === 2 && (
              /* Scope Type Selection */
              <section className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Choose Your Scope Approach</CardTitle>
                    <p className="text-muted-foreground">Select how you want to define the renovation scope</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div
                        className={cn(
                          "border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md",
                          scopeType === 'job-types'
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => handleScopeTypeChange('job-types')}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5",
                            scopeType === 'job-types'
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          )}>
                            {scopeType === 'job-types' && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">Job Type Scope</h3>
                            <p className="text-muted-foreground text-sm mt-1">
                              Define scope by specific job categories (kitchen, flooring, HVAC, etc.)
                            </p>
                            <div className="mt-3 flex flex-wrap gap-1">
                              <Badge variant="secondary" className="text-xs">Kitchen</Badge>
                              <Badge variant="secondary" className="text-xs">Flooring</Badge>
                              <Badge variant="secondary" className="text-xs">HVAC</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md",
                          scopeType === 'unit-based'
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => handleScopeTypeChange('unit-based')}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5",
                            scopeType === 'unit-based'
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          )}>
                            {scopeType === 'unit-based' && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">Unit-based Scope</h3>
                            <p className="text-muted-foreground text-sm mt-1">
                              Define scope by selecting specific units from your rent roll
                            </p>
                            <div className="mt-3 flex flex-wrap gap-1">
                              <Badge variant="secondary" className="text-xs">Unit 101</Badge>
                              <Badge variant="secondary" className="text-xs">Unit 202</Badge>
                              <Badge variant="secondary" className="text-xs">Unit 301</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {scopeType === 'unit-based' && (
                      <div className="border border-border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Rent Roll Required</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Unit-based scope requires a rent roll to identify available units. Upload your rent roll file to proceed.
                        </p>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Upload and Enter
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            )}

            {currentStep === 3 && (
              /* Define Scope */
              <section className="space-y-6">
                {scopeType === 'job-types' ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <Building className="h-6 w-6" />
                          Job Type Scope
                        </CardTitle>
                        <p className="text-muted-foreground">Select the job categories for your renovation project</p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {jobCategories.map((category) => (
                            <div
                              key={category.id}
                              className={cn(
                                "border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                                selectedCategories.has(category.id)
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border hover:border-primary/50"
                              )}
                              onClick={() => toggleCategory(category.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{category.name}</h4>
                                  {category.materialSpec && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Material: {category.materialSpec}
                                    </p>
                                  )}
                                  {category.productInfo && (
                                    <p className="text-sm text-muted-foreground">
                                      Product: {category.productInfo}
                                    </p>
                                  )}
                                </div>
                                <div className={cn(
                                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                                  selectedCategories.has(category.id)
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground"
                                )}>
                                  {selectedCategories.has(category.id) && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {selectedCategories.size > 0 && (
                          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                            <h4 className="font-semibold mb-2">Selected Job Categories ({selectedCategories.size})</h4>
                            <div className="flex flex-wrap gap-2">
                              {Array.from(selectedCategories).map((categoryId) => {
                                const category = jobCategories.find(c => c.id === categoryId);
                                return category ? (
                                  <Badge key={categoryId} variant="default" className="flex items-center gap-1">
                                    {category.name}
                                    <X 
                                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCategory(categoryId);
                                      }}
                                    />
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <Home className="h-6 w-6" />
                          Unit-based Scope
                        </CardTitle>
                        <p className="text-muted-foreground">Select the units for your renovation project</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {units.map((unit) => (
                            <div
                              key={unit.id}
                              className={cn(
                                "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md",
                                selectedUnits.has(unit.id)
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border hover:border-primary/50"
                              )}
                              onClick={() => toggleUnit(unit.id)}
                            >
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                                  selectedUnits.has(unit.id)
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground"
                                )}>
                                  {selectedUnits.has(unit.id) && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold">{unit.name}</h4>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{unit.type}</span>
                                    <span>•</span>
                                    <span>{unit.sqft} sq ft</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {selectedUnits.size > 0 && (
                          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                            <h4 className="font-semibold mb-2">Selected Units ({selectedUnits.size})</h4>
                            <div className="flex flex-wrap gap-2">
                              {Array.from(selectedUnits).map((unitId) => {
                                const unit = units.find(u => u.id === unitId);
                                return unit ? (
                                  <Badge key={unitId} variant="default" className="flex items-center gap-1">
                                    {unit.name}
                                    <X 
                                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleUnit(unitId);
                                      }}
                                    />
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </section>
            )}

            {currentStep === 4 && (
              /* Project Details */
              <section className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Project Details</CardTitle>
                    <p className="text-muted-foreground">Provide timeline and project specifications</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="projectName">Project Name *</Label>
                        <Input
                          id="projectName"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          placeholder="Enter project name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Due Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dueDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dueDate ? format(dueDate, "PPP") : "Select due date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dueDate}
                              onSelect={setDueDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Project Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide a detailed description of the renovation project..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialInstructions">Special Instructions</Label>
                      <Textarea
                        id="specialInstructions"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Any special requirements, restrictions, or instructions for contractors..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {currentStep === 5 && (
              /* Contractors Section */
              <section className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <User className="h-6 w-6" />
                      Select Contractors
                    </CardTitle>
                    <p className="text-muted-foreground">Choose contractors to invite for bidding on this project</p>
                  </CardHeader>
                  <CardContent>
                    {contractors.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {contractors.map((contractor) => (
                          <Card key={contractor.id} className="border-2 hover:shadow-md transition-all duration-200">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{contractor.companyName}</h3>
                                  <p className="text-muted-foreground">
                                    {contractor.firstName} {contractor.lastName}
                                  </p>
                                  <div className="mt-2 space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Mail className="h-4 w-4" />
                                      {contractor.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Building className="h-4 w-4" />
                                      {contractor.location}
                                    </div>
                                  </div>
                                </div>
                                <Button size="sm" className="ml-4">
                                  Invite to Bid
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No contractors added yet. Click "Add Contractor" to get started.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            )}
          </div>
          
          {/* Fixed Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 shadow-lg">
            <div className="flex justify-between items-center px-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>Step {currentStep} of {steps.length}</span>
                <span>•</span>
                <span>{steps[currentStep - 1].title}</span>
              </div>
              
              {currentStep === steps.length ? (
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={handleSaveDraft}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Save Draft
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button 
                            disabled={contractors.length === 0}
                            onClick={handleCreateBid}
                            className="flex items-center gap-2 bg-gradient-to-r from-primary to-brand-blue-dark text-white shadow-medium hover:shadow-strong transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Create Bid
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {contractors.length === 0 && (
                        <TooltipContent>
                          <p>Please add at least one contractor to create the bid.</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={nextStep}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-brand-blue-dark"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}