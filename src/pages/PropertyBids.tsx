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
  quantity?: string;
  unitTypes?: string[];
  laborHours?: string;
  skillLevel?: string;
  priority?: string;
  notes?: string;
  files?: File[];
  isExpanded?: boolean;
}

interface Unit {
  id: string;
  unitNumber: string;
  unitType: string;
  floorPlan: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  selected: boolean;
}

export default function PropertyBids() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [scopeType, setScopeType] = useState<"job-type" | "unit-based">("job-type");
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [hasRentRoll, setHasRentRoll] = useState(false);
  const [rentRollFile, setRentRollFile] = useState<File | null>(null);
  const [newContractor, setNewContractor] = useState<Contractor>({
    id: "",
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    location: ""
  });
  const [showContractorForm, setShowContractorForm] = useState(false);
  
  // Form data with defaults
  const [generatedBy, setGeneratedBy] = useState("Roman Matsukatov");
  const [email, setEmail] = useState("roman.matsukatov@company.com");
  const [phone, setPhone] = useState("(555) 123-4567");
  const [companyName, setCompanyName] = useState("Property Management LLC");
  const [totalBudget, setTotalBudget] = useState("");

  const steps = [
    { number: 1, title: "Basic Information", description: "Bid details and property info" },
    { number: 2, title: "Project Timeline", description: "Start and end dates" },
    { number: 3, title: "Rent Roll Upload", description: "Upload property units data" },
    { number: 4, title: "Scope Type", description: "Define project scope" },
    { number: 5, title: "Contractors", description: "Add contractors to bid" }
  ];

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

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

  useEffect(() => {
    // Load property data from localStorage
    const savedProperty = localStorage.getItem('property');
    if (savedProperty) {
      const property = JSON.parse(savedProperty);
      setPropertyData(property);
      setHasRentRoll(property.hasRentRoll || false);
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
      setShowContractorForm(false);
    }
  };

  const removeContractor = (id: string) => {
    setContractors(contractors.filter(contractor => contractor.id !== id));
  };

  const addJobCategory = () => {
    const categories = ["Flooring", "Kitchen", "Bathroom", "Painting", "HVAC", "Plumbing", "Electrical", "Appliances", "Windows", "Doors", "Roofing", "Landscaping"];
    const newJobCategory = {
      id: Date.now().toString(),
      name: categories[0], // По умолчанию первая категория
      isExpanded: false
    };
    setJobCategories([...jobCategories, newJobCategory]);
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

  const handleRentRollUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setRentRollFile(file);
      setHasRentRoll(true);
      
      // Simulate parsing units from rent roll
      const sampleUnits: Unit[] = [
        { id: "1", unitNumber: "101", unitType: "1BR", floorPlan: "A", sqft: 650, bedrooms: 1, bathrooms: 1, selected: false },
        { id: "2", unitNumber: "102", unitType: "1BR", floorPlan: "A", sqft: 650, bedrooms: 1, bathrooms: 1, selected: false },
        { id: "3", unitNumber: "201", unitType: "2BR", floorPlan: "B", sqft: 950, bedrooms: 2, bathrooms: 2, selected: false },
        { id: "4", unitNumber: "202", unitType: "2BR", floorPlan: "B", sqft: 950, bedrooms: 2, bathrooms: 2, selected: false },
        { id: "5", unitNumber: "301", unitType: "3BR", floorPlan: "C", sqft: 1200, bedrooms: 3, bathrooms: 2, selected: false },
      ];
      setUnits(sampleUnits);
      
      toast({
        title: "Rent Roll Uploaded",
        description: `${file.name} has been processed and ${sampleUnits.length} units were found.`,
      });
    }
  };

  const toggleUnitSelection = (unitId: string) => {
    setUnits(units => 
      units.map(unit => 
        unit.id === unitId ? { ...unit, selected: !unit.selected } : unit
      )
    );
  };

  const selectAllUnits = () => {
    setUnits(units => units.map(unit => ({ ...unit, selected: true })));
  };

  const deselectAllUnits = () => {
    setUnits(units => units.map(unit => ({ ...unit, selected: false })));
  };

  const handleSaveDraft = () => {
    // Создаем объект бида с собранными данными со статусом "Not Started"
    const bidData = {
      id: generateBidNumber(),
      generatedBy,
      email,
      phone,
      companyName,
      totalBudget,
      property: propertyData,
      startDate,
      endDate,
      scopeType,
      jobCategories,
      contractors,
      createdAt: new Date().toISOString(),
      status: "Not started"
    };

    // Сохраняем бид в localStorage
    const savedBids = JSON.parse(localStorage.getItem('propertyBids') || '[]');
    savedBids.push(bidData);
    localStorage.setItem('propertyBids', JSON.stringify(savedBids));

    // Показываем уведомление и переходим на страницу списка бидов
    toast({
      title: "Draft Saved",
      description: "Your bid has been saved as a draft.",
    });
    navigate('/property/bids-list');
  };

  const handleCreateBid = () => {
    // Создаем объект бида с собранными данными
    const bidData = {
      id: generateBidNumber(),
      generatedBy,
      email,
      phone,
      companyName,
      totalBudget,
      property: propertyData,
      startDate,
      endDate,
      scopeType,
      jobCategories,
      contractors,
      createdAt: new Date().toISOString()
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
                <p className="text-muted-foreground mt-3 text-lg">Generate detailed renovation proposals for contractors</p>
              </div>
              
              {/* Compact Step Navigation in top right */}
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="px-3 py-1">
                  Step {currentStep} of {steps.length}
                </Badge>
                <div className="flex items-center gap-2">
                  {steps.map((step) => (
                    <button
                      key={step.number}
                      onClick={() => goToStep(step.number)}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                        currentStep === step.number
                          ? "bg-primary text-white"
                          : currentStep > step.number
                          ? "bg-primary/80 text-white hover:bg-primary"
                          : "bg-muted text-muted-foreground hover:bg-muted/60"
                      )}
                    >
                      {currentStep > step.number ? <Check className="h-3 w-3" /> : step.number}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step Content */}
            {currentStep === 1 && (
              /* Basic Information */
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
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Total Budget</Label>
                          <Input 
                            type="text"
                            placeholder="$1,650,000"
                            value={totalBudget}
                            onChange={(e) => setTotalBudget(e.target.value)}
                            className="mt-1"
                          />
                        </div>
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
                            className="mt-1"
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
                            className="mt-1"
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
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Information */}
                {propertyData && (
                  <div className="pt-8 border-t-2 border-border/60">
                    <div className="flex items-center gap-2 mb-6">
                      <Building className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Property Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4 pl-7">
                        <div>
                          <Label className="text-sm text-muted-foreground">Property Name</Label>
                          <p className="font-medium mt-1">{propertyData.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Address</Label>
                          <p className="font-medium mt-1">{propertyData.address}, {propertyData.city}, {propertyData.state} {propertyData.zip}</p>
                        </div>
                      </div>
                      <div className="space-y-4 pl-7">
                        <div>
                          <Label className="text-sm text-muted-foreground">Year Built</Label>
                          <p className="font-medium mt-1">{propertyData.yearBuilt || "Not specified"}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Building Type</Label>
                          <p className="font-medium mt-1">{propertyData.buildingType || "Not specified"}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Asset Manager</Label>
                          <p className="font-medium mt-1">{propertyData.assetManager || "Not assigned"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {currentStep === 2 && (
              /* Timeline Section */
              <section className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold">Timeline & Activity Period</h2>
                  <p className="text-muted-foreground mt-1">Set project dates and bid collection period</p>
                </div>
                
                {/* Project Timeline */}
                <div className="border border-border rounded-lg p-6 bg-card">
                  <div className="flex items-center gap-2 mb-6">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Project Timeline</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Project Kick-off Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Select start date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Project Completion Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Select end date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Bid Collection Activity Period */}
                <div className="border border-border rounded-lg p-6 bg-card">
                  <div className="flex items-center gap-2 mb-6">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Bid Collection Period</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Set the timeframe for contractors to submit their proposals
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Bid Submission Opens
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>Today (auto-set)</span>
                          </Button>
                        </PopoverTrigger>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Bid Submission Deadline
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>Select deadline</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={undefined}
                            onSelect={() => {}}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {currentStep === 3 && (
              /* Rent Roll Upload Section */
              <section className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold">Rent Roll Upload</h2>
                  <p className="text-muted-foreground mt-1">Upload property units data to populate scope options</p>
                </div>

                {/* Rent Roll Upload */}
                <div className="border border-border rounded-lg p-6 bg-card">
                  <div className="flex items-center gap-2 mb-6">
                    <Upload className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Upload Rent Roll</h3>
                  </div>

                  {!hasRentRoll ? (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Upload your rent roll file to automatically populate unit information and enable unit-based scoping.
                      </p>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <div className="space-y-2">
                          <p className="text-lg font-medium">Upload Rent Roll</p>
                          <p className="text-sm text-muted-foreground">
                            Supported formats: .xlsx, .xls, .csv
                          </p>
                        </div>
                        <div className="mt-4">
                          <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleRentRollUpload}
                            className="hidden"
                            id="rent-roll-upload"
                          />
                          <label htmlFor="rent-roll-upload">
                            <Button className="bg-gradient-to-r from-primary to-primary/80">
                              Select File
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                        <FileText className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium text-green-900">
                            {rentRollFile?.name}
                          </p>
                          <p className="text-sm text-green-700">
                            {units.length} units found and processed
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setHasRentRoll(false);
                            setRentRollFile(null);
                            setUnits([]);
                          }}
                          className="text-green-700 hover:text-green-900"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Units Preview */}
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Units Overview</h4>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={selectAllUnits}>
                              Select All
                            </Button>
                            <Button size="sm" variant="outline" onClick={deselectAllUnits}>
                              Deselect All
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                          {units.map((unit) => (
                            <div
                              key={unit.id}
                              onClick={() => toggleUnitSelection(unit.id)}
                              className={cn(
                                "p-3 rounded-lg border cursor-pointer transition-all",
                                unit.selected
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-border/60"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{unit.unitNumber}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {unit.unitType} • {unit.sqft} sq ft
                                  </p>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={unit.selected}
                                  onChange={() => toggleUnitSelection(unit.id)}
                                  className="h-4 w-4"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 text-sm text-muted-foreground">
                          {units.filter(u => u.selected).length} of {units.length} units selected
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {currentStep === 4 && (
              <>
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

                {/* Job-Type Scope Content */}
                {scopeType === "job-type" && (
                  <section className="space-y-8 pt-8 border-t-2 border-border/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold">Job Categories</h2>
                        <p className="text-muted-foreground mt-1">Define the work scope for contractors</p>
                      </div>
                      <Button onClick={addJobCategory} className="bg-gradient-to-r from-primary to-brand-blue-dark">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Job
                      </Button>
                    </div>

                    {/* Selected Job Categories */}
                    {jobCategories.length > 0 && (
                      <div className="space-y-6">
                        {jobCategories.map((category) => (
                           <div key={category.id} className="border-l-4 border-l-primary/30 pl-6 py-4 space-y-4">
                             <div 
                               className="flex items-center justify-between cursor-pointer hover:bg-accent/30 rounded-lg p-2 -m-2 transition-colors"
                               onClick={() => toggleCategoryExpansion(category.id)}
                             >
                               <div className="flex items-center gap-3">
                                 <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", category.isExpanded ? "rotate-180" : "")} />
                                 <div onClick={(e) => e.stopPropagation()}>
                                   <Select 
                                     value={category.name} 
                                     onValueChange={(value) => updateJobCategory(category.id, "name", value)}
                                   >
                                     <SelectTrigger className="w-48">
                                     <SelectValue />
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
                                 </div>
                                 {!category.isExpanded && (
                                   <div className="text-sm text-muted-foreground italic">
                                     Click to expand and add job details
                                   </div>
                                 )}
                               </div>
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   removeJobCategory(category.id);
                                 }}
                                 className="text-muted-foreground hover:text-destructive"
                               >
                                 <X className="h-4 w-4" />
                               </Button>
                             </div>
                            
                             {category.isExpanded && (
                               <div className="space-y-6 pt-4">
                                 {/* Basic Information */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div className="space-y-2">
                                     <Label className="text-sm text-muted-foreground">Material Spec/Finish</Label>
                                     <Input
                                       placeholder="e.g., Luxury Vinyl Plank, Granite countertop"
                                       value={category.materialSpec || ""}
                                       onChange={(e) => updateJobCategory(category.id, "materialSpec", e.target.value)}
                                     />
                                   </div>
                                   <div className="space-y-2">
                                     <Label className="text-sm text-muted-foreground">Product Information</Label>
                                     <Input
                                       placeholder="Brand, model, specifications"
                                       value={category.productInfo || ""}
                                       onChange={(e) => updateJobCategory(category.id, "productInfo", e.target.value)}
                                     />
                                   </div>
                                   <div className="space-y-2">
                                     <Label className="text-sm text-muted-foreground">Dimensions</Label>
                                     <Input
                                       placeholder="Size, area, linear feet"
                                       value={category.dimensions || ""}
                                       onChange={(e) => updateJobCategory(category.id, "dimensions", e.target.value)}
                                     />
                                   </div>
                                   <div className="space-y-2">
                                     <Label className="text-sm text-muted-foreground">Quantity</Label>
                                     <Input
                                       placeholder="Number of units affected"
                                       value={category.quantity || ""}
                                       onChange={(e) => updateJobCategory(category.id, "quantity", e.target.value)}
                                     />
                                   </div>
                                 </div>

                                 {/* Project Details */}
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                   <div className="space-y-2">
                                     <Label className="text-sm text-muted-foreground">Estimated Labor Hours</Label>
                                     <Input
                                       placeholder="e.g., 8 hours per unit"
                                       value={category.laborHours || ""}
                                       onChange={(e) => updateJobCategory(category.id, "laborHours", e.target.value)}
                                     />
                                   </div>
                                   <div className="space-y-2">
                                     <Label className="text-sm text-muted-foreground">Skill Level Required</Label>
                                     <Select value={category.skillLevel || ""} onValueChange={(value) => updateJobCategory(category.id, "skillLevel", value)}>
                                       <SelectTrigger>
                                         <SelectValue placeholder="Select skill level" />
                                       </SelectTrigger>
                                       <SelectContent>
                                         <SelectItem value="basic">Basic</SelectItem>
                                         <SelectItem value="intermediate">Intermediate</SelectItem>
                                         <SelectItem value="advanced">Advanced</SelectItem>
                                         <SelectItem value="specialized">Specialized</SelectItem>
                                       </SelectContent>
                                     </Select>
                                   </div>
                                   <div className="space-y-2">
                                     <Label className="text-sm text-muted-foreground">Priority Level</Label>
                                     <Select value={category.priority || ""} onValueChange={(value) => updateJobCategory(category.id, "priority", value)}>
                                       <SelectTrigger>
                                         <SelectValue placeholder="Select priority" />
                                       </SelectTrigger>
                                       <SelectContent>
                                         <SelectItem value="high">High</SelectItem>
                                         <SelectItem value="medium">Medium</SelectItem>
                                         <SelectItem value="low">Low</SelectItem>
                                       </SelectContent>
                                     </Select>
                                   </div>
                                 </div>
                                 
                                 <div className="space-y-2">
                                   <Label className="text-sm font-medium">Detailed Work Description</Label>
                                   <Textarea
                                     placeholder="Provide detailed work requirements, standards, and any special instructions for contractors"
                                     value={category.notes || ""}
                                     onChange={(e) => updateJobCategory(category.id, "notes", e.target.value)}
                                     className="min-h-[100px]"
                                   />
                                 </div>
                                 
                                 <div className="space-y-2">
                                   <Label className="text-sm font-medium">Reference Documents & Images</Label>
                                   <Button variant="outline" className="w-full">
                                     <Upload className="mr-2 h-4 w-4" />
                                     Upload Specs, Drawings, or Reference Images
                                   </Button>
                                 </div>
                               </div>
                             )}
                          </div>
                        ))}
                      </div>
                    )}

                    {jobCategories.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                        <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No job categories added yet</h3>
                        <p className="mb-4">Define job categories to specify work scope for contractors</p>
                        <Button onClick={addJobCategory} variant="outline">
                          <Plus className="mr-2 h-4 w-4" />
                          Add First Job Category
                        </Button>
                      </div>
                    )}
                  </section>
                )}

                {/* Unit-Based Scope Content */}
                {scopeType === "unit-based" && (
                  <section className="space-y-8 pt-8 border-t-2 border-border/60">
                    {!hasRentRoll ? (
                      /* Rent Roll Upload for Unit-Based */
                      <div className="border border-border rounded-lg p-6 bg-card">
                        <div className="flex items-center gap-2 mb-6">
                          <Upload className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-medium">Upload Rent Roll for Unit-Based Scope</h3>
                        </div>
                        <div className="space-y-4">
                          <p className="text-muted-foreground">
                            Upload your rent roll file to automatically populate unit information and enable unit-based scoping.
                          </p>
                          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <div className="space-y-2">
                              <p className="text-lg font-medium">Upload Rent Roll</p>
                              <p className="text-sm text-muted-foreground">
                                Supported formats: .xlsx, .xls, .csv
                              </p>
                            </div>
                            <div className="mt-4">
                              <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleRentRollUpload}
                                className="hidden"
                                id="rent-roll-upload-unit-based"
                              />
                              <label htmlFor="rent-roll-upload-unit-based">
                                <Button className="bg-gradient-to-r from-primary to-primary/80">
                                  Select File
                                </Button>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Unit Selection */}
                        <div className="border border-border rounded-lg p-6 bg-card">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Home className="h-5 w-5 text-primary" />
                              <h3 className="text-lg font-medium">Select Units for Renovation</h3>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={selectAllUnits}>
                                Select All
                              </Button>
                              <Button size="sm" variant="outline" onClick={deselectAllUnits}>
                                Deselect All
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                            {units.map((unit) => (
                              <div
                                key={unit.id}
                                onClick={() => toggleUnitSelection(unit.id)}
                                className={cn(
                                  "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                                  unit.selected
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border hover:border-border/60"
                                )}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="font-medium">{unit.unitNumber}</div>
                                  <input
                                    type="checkbox"
                                    checked={unit.selected}
                                    onChange={() => toggleUnitSelection(unit.id)}
                                    className="h-4 w-4"
                                  />
                                </div>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <div>{unit.unitType} • Plan {unit.floorPlan}</div>
                                  <div>{unit.sqft} sq ft</div>
                                  <div>{unit.bedrooms}BR/{unit.bathrooms}BA</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="text-muted-foreground">
                              {units.filter(u => u.selected).length} of {units.length} units selected
                            </div>
                            {units.filter(u => u.selected).length > 0 && (
                              <Badge variant="outline">
                                Total: {units.filter(u => u.selected).reduce((sum, u) => sum + u.sqft, 0)} sq ft
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Job Categories for Selected Units */}
                        {units.filter(u => u.selected).length > 0 && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-xl font-semibold">Job Categories for Selected Units</h3>
                                <p className="text-muted-foreground mt-1">Define work scope for {units.filter(u => u.selected).length} selected units</p>
                              </div>
                              <Button onClick={addJobCategory} className="bg-gradient-to-r from-primary to-brand-blue-dark">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Job
                              </Button>
                            </div>

                            {/* Job Categories List */}
                            {jobCategories.length > 0 && (
                              <div className="space-y-6">
                                {jobCategories.map((category) => (
                                   <div key={category.id} className="border-l-4 border-l-primary/30 pl-6 py-4 space-y-4">
                                     <div 
                                       className="flex items-center justify-between cursor-pointer hover:bg-accent/30 rounded-lg p-2 -m-2 transition-colors"
                                       onClick={() => toggleCategoryExpansion(category.id)}
                                     >
                                       <div className="flex items-center gap-3">
                                         <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", category.isExpanded ? "rotate-180" : "")} />
                                         <div onClick={(e) => e.stopPropagation()}>
                                           <Select 
                                             value={category.name} 
                                             onValueChange={(value) => updateJobCategory(category.id, "name", value)}
                                           >
                                             <SelectTrigger className="w-48">
                                             <SelectValue />
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
                                         </div>
                                         {!category.isExpanded && (
                                           <div className="text-sm text-muted-foreground italic">
                                             Applies to {units.filter(u => u.selected).length} selected units
                                           </div>
                                         )}
                                       </div>
                                       <Button
                                         variant="ghost"
                                         size="sm"
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           removeJobCategory(category.id);
                                         }}
                                         className="text-muted-foreground hover:text-destructive"
                                       >
                                         <X className="h-4 w-4" />
                                       </Button>
                                     </div>
                                    
                                     {category.isExpanded && (
                                       <div className="space-y-6 pt-4">
                                         {/* Unit Types Display */}
                                         <div className="space-y-2">
                                           <Label className="text-sm text-muted-foreground">Applicable Units</Label>
                                           <div className="flex flex-wrap gap-2">
                                             {units.filter(u => u.selected).map(unit => (
                                               <Badge
                                                 key={unit.id}
                                                 variant="outline"
                                                 className="text-xs"
                                               >
                                                 {unit.unitNumber} ({unit.unitType})
                                               </Badge>
                                             ))}
                                           </div>
                                         </div>

                                         {/* Basic Information */}
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                           <div className="space-y-2">
                                             <Label className="text-sm text-muted-foreground">Material Spec/Finish</Label>
                                             <Input
                                               placeholder="e.g., Luxury Vinyl Plank, Granite countertop"
                                               value={category.materialSpec || ""}
                                               onChange={(e) => updateJobCategory(category.id, "materialSpec", e.target.value)}
                                             />
                                           </div>
                                           <div className="space-y-2">
                                             <Label className="text-sm text-muted-foreground">Product Information</Label>
                                             <Input
                                               placeholder="Brand, model, specifications"
                                               value={category.productInfo || ""}
                                               onChange={(e) => updateJobCategory(category.id, "productInfo", e.target.value)}
                                             />
                                           </div>
                                           <div className="space-y-2">
                                             <Label className="text-sm text-muted-foreground">Dimensions</Label>
                                             <Input
                                               placeholder="Size, area, linear feet"
                                               value={category.dimensions || ""}
                                               onChange={(e) => updateJobCategory(category.id, "dimensions", e.target.value)}
                                             />
                                           </div>
                                           <div className="space-y-2">
                                             <Label className="text-sm text-muted-foreground">Quantity per Unit</Label>
                                             <Input
                                               placeholder="Quantity per selected unit"
                                               value={category.quantity || ""}
                                               onChange={(e) => updateJobCategory(category.id, "quantity", e.target.value)}
                                             />
                                           </div>
                                         </div>

                                         {/* Project Details */}
                                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                           <div className="space-y-2">
                                             <Label className="text-sm text-muted-foreground">Estimated Labor Hours per Unit</Label>
                                             <Input
                                               placeholder="e.g., 8 hours per unit"
                                               value={category.laborHours || ""}
                                               onChange={(e) => updateJobCategory(category.id, "laborHours", e.target.value)}
                                             />
                                           </div>
                                           <div className="space-y-2">
                                             <Label className="text-sm text-muted-foreground">Skill Level Required</Label>
                                             <Select value={category.skillLevel || ""} onValueChange={(value) => updateJobCategory(category.id, "skillLevel", value)}>
                                               <SelectTrigger>
                                                 <SelectValue placeholder="Select skill level" />
                                               </SelectTrigger>
                                               <SelectContent>
                                                 <SelectItem value="basic">Basic</SelectItem>
                                                 <SelectItem value="intermediate">Intermediate</SelectItem>
                                                 <SelectItem value="advanced">Advanced</SelectItem>
                                                 <SelectItem value="specialized">Specialized</SelectItem>
                                               </SelectContent>
                                             </Select>
                                           </div>
                                           <div className="space-y-2">
                                             <Label className="text-sm text-muted-foreground">Priority Level</Label>
                                             <Select value={category.priority || ""} onValueChange={(value) => updateJobCategory(category.id, "priority", value)}>
                                               <SelectTrigger>
                                                 <SelectValue placeholder="Select priority" />
                                               </SelectTrigger>
                                               <SelectContent>
                                                 <SelectItem value="high">High</SelectItem>
                                                 <SelectItem value="medium">Medium</SelectItem>
                                                 <SelectItem value="low">Low</SelectItem>
                                               </SelectContent>
                                             </Select>
                                           </div>
                                         </div>
                                         
                                         <div className="space-y-2">
                                           <Label className="text-sm font-medium">Detailed Work Description</Label>
                                           <Textarea
                                             placeholder="Provide detailed work requirements, standards, and any special instructions for contractors"
                                             value={category.notes || ""}
                                             onChange={(e) => updateJobCategory(category.id, "notes", e.target.value)}
                                             className="min-h-[100px]"
                                           />
                                         </div>
                                         
                                         <div className="space-y-2">
                                           <Label className="text-sm font-medium">Reference Documents & Images</Label>
                                           <Button variant="outline" className="w-full">
                                             <Upload className="mr-2 h-4 w-4" />
                                             Upload Specs, Drawings, or Reference Images
                                           </Button>
                                         </div>
                                       </div>
                                     )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {jobCategories.length === 0 && (
                              <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                                <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-medium mb-2">No job categories added yet</h3>
                                <p className="mb-4">Define job categories for the selected {units.filter(u => u.selected).length} units</p>
                                <Button onClick={addJobCategory} variant="outline">
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add First Job Category
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </section>
                )}
              </>
            )}

            {currentStep === 5 && (
              /* Contractors Section */
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Contractors</h2>
                    <p className="text-muted-foreground mt-1">Add up to 5 contractors for this bid</p>
                  </div>
                  {contractors.length < 5 && (
                    <Button 
                      onClick={() => setShowContractorForm(true)}
                      className="bg-gradient-to-r from-primary to-brand-blue-dark hover:shadow-medium transition-all duration-300"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Contractor
                    </Button>
                  )}
                </div>
                
                {/* Contract Form */}
                {showContractorForm && (
                  <div className="space-y-6 p-6 bg-gradient-to-br from-accent/10 to-primary/5 rounded-xl border border-primary/20 shadow-soft">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-lg">Add New Contractor</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowContractorForm(false)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Company Name *</Label>
                        <Input
                          value={newContractor.companyName}
                          onChange={(e) => setNewContractor({...newContractor, companyName: e.target.value})}
                          placeholder="Company name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Location</Label>
                        <Input
                          value={newContractor.location}
                          onChange={(e) => setNewContractor({...newContractor, location: e.target.value})}
                          placeholder="City, State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">First Name *</Label>
                        <Input
                          value={newContractor.firstName}
                          onChange={(e) => setNewContractor({...newContractor, firstName: e.target.value})}
                          placeholder="First name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Last Name *</Label>
                        <Input
                          value={newContractor.lastName}
                          onChange={(e) => setNewContractor({...newContractor, lastName: e.target.value})}
                          placeholder="Last name"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-sm text-muted-foreground">Email Address *</Label>
                        <Input
                          type="email"
                          value={newContractor.email}
                          onChange={(e) => setNewContractor({...newContractor, email: e.target.value})}
                          placeholder="email@company.com"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={addContractor} className="bg-gradient-to-r from-primary to-brand-blue-dark">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Contractor
                      </Button>
                      <Button variant="outline" onClick={() => setShowContractorForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                {contractors.length > 0 && (
                  <div className="space-y-3">
                    {contractors.map((contractor) => (
                      <div key={contractor.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-background to-accent/10 rounded-lg border-l-4 border-l-primary/30 shadow-soft">
                        <div>
                          <div className="font-semibold text-lg">{contractor.companyName}</div>
                          <div className="text-sm text-muted-foreground">
                            {contractor.firstName} {contractor.lastName} • {contractor.email}
                            {contractor.location && ` • ${contractor.location}`}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContractor(contractor.id)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {contractors.length === 0 && !showContractorForm && (
                  <div className="text-center py-12 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No contractors added yet. Click "Add Contractor" to get started.</p>
                  </div>
                )}
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