import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PropertySidebar } from "@/components/PropertySidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarIcon, Plus, X, Building, Users, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProjectFormData {
  projectName: string;
  description: string;
  propertyName: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  budget: string;
  projectManager: string;
  contractor: string;
  contactEmail: string;
  contactPhone: string;
  scopeType: "Unit-based" | "Job-type" | "Whole Property";
  jobCategories: string[];
  priority: "Low" | "Medium" | "High";
  units: string[];
}

const jobCategoryOptions = [
  "Kitchen Renovation",
  "Bathroom Renovation", 
  "Flooring",
  "Painting",
  "HVAC Systems",
  "Electrical Work",
  "Plumbing",
  "Roofing",
  "Windows & Doors",
  "Appliances",
  "Landscaping",
  "Structural Work"
];

const unitOptions = [
  "Unit 101",
  "Unit 102", 
  "Unit 103",
  "Unit 201",
  "Unit 202",
  "Unit 203",
  "Common Areas",
  "Lobby",
  "Parking"
];

export default function PropertyProjectNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: "",
    description: "",
    propertyName: "Sunset Apartments",
    startDate: undefined,
    endDate: undefined,
    budget: "",
    projectManager: "",
    contractor: "",
    contactEmail: "",
    contactPhone: "",
    scopeType: "Unit-based",
    jobCategories: [],
    priority: "Medium",
    units: []
  });

  const [newJobCategory, setNewJobCategory] = useState("");
  const [newUnit, setNewUnit] = useState("");

  const contractorContacts = {
    "ABC Construction": { email: "contact@abcconstruction.com", phone: "(555) 123-4567" },
    "Elite Builders": { email: "info@elitebuilders.com", phone: "(555) 234-5678" },
    "Premier Renovations": { email: "office@premierreno.com", phone: "(555) 345-6789" },
    "Quality Contractors Inc": { email: "hello@qualitycontractors.com", phone: "(555) 456-7890" },
    "Swift Construction": { email: "contact@swiftconstruction.com", phone: "(555) 567-8901" },
    "Modern Build Solutions": { email: "info@modernbuild.com", phone: "(555) 678-9012" }
  };

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    if (field === 'contractor' && value) {
      const contractorInfo = contractorContacts[value as keyof typeof contractorContacts];
      setFormData(prev => ({
        ...prev,
        [field]: value,
        contactEmail: contractorInfo?.email || '',
        contactPhone: contractorInfo?.phone || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addJobCategory = (category: string) => {
    if (category && !formData.jobCategories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        jobCategories: [...prev.jobCategories, category]
      }));
    }
    setNewJobCategory("");
  };

  const removeJobCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      jobCategories: prev.jobCategories.filter(c => c !== category)
    }));
  };

  const addUnit = (unit: string) => {
    if (unit && !formData.units.includes(unit)) {
      setFormData(prev => ({
        ...prev,
        units: [...prev.units, unit]
      }));
    }
    setNewUnit("");
  };

  const removeUnit = (unit: string) => {
    setFormData(prev => ({
      ...prev,
      units: prev.units.filter(u => u !== unit)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.projectName || !formData.startDate || !formData.endDate || !formData.budget) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.startDate >= formData.endDate) {
      toast.error("End date must be after start date");
      return;
    }

    // Create project data
    const newProject = {
      id: `PRJ-${Date.now()}`,
      ...formData,
      status: 'Not Started',
      createdAt: new Date().toISOString(),
      totalBudget: parseFloat(formData.budget),
      unitsIncluded: formData.units.map(unit => ({
        id: `unit-${Math.random().toString(36).substr(2, 9)}`,
        unitNumber: unit,
        status: 'Not Started',
        totalBid: 0,
        totalBudget: 0,
        totalInvoiced: 0,
        percentComplete: 0
      }))
    };

    // Save to localStorage (in real app, this would be an API call)
    const existingBids = JSON.parse(localStorage.getItem('propertyBids') || '[]');
    const updatedBids = [...existingBids, { ...newProject, status: 'accepted' }];
    localStorage.setItem('propertyBids', JSON.stringify(updatedBids));

    toast.success("Project created successfully!");
    navigate('/property/projects');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <PropertySidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/property/projects")}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Projects
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
                  <p className="text-muted-foreground">Set up a new renovation project</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="projectName">Project Name *</Label>
                        <Input
                          id="projectName"
                          placeholder="Enter project name"
                          value={formData.projectName}
                          onChange={(e) => handleInputChange('projectName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="propertyName">Property</Label>
                        <Select
                          value={formData.propertyName}
                          onValueChange={(value) => handleInputChange('propertyName', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a property" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sunset Apartments">Sunset Apartments</SelectItem>
                            <SelectItem value="Oceanview Condos">Oceanview Condos</SelectItem>
                            <SelectItem value="Downtown Lofts">Downtown Lofts</SelectItem>
                            <SelectItem value="Garden Grove Complex">Garden Grove Complex</SelectItem>
                            <SelectItem value="Riverside Towers">Riverside Towers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Project Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the scope and goals of this project"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Scope Type</Label>
                        <Select
                          value={formData.scopeType}
                          onValueChange={(value) => handleInputChange('scopeType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Unit-based">Unit-based</SelectItem>
                            <SelectItem value="Job-type">Job-type</SelectItem>
                            <SelectItem value="Whole Property">Whole Property</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value) => handleInputChange('priority', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget *</Label>
                        <Input
                          id="budget"
                          type="number"
                          placeholder="Enter budget amount"
                          value={formData.budget}
                          onChange={(e) => handleInputChange('budget', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Units Selection for Unit-based projects */}
                    {formData.scopeType === "Unit-based" && (
                      <div className="space-y-4 mt-6 p-4 bg-muted/50 rounded-lg">
                        <div className="space-y-2">
                          <Label className="text-base font-medium">Units to Include</Label>
                          <p className="text-sm text-muted-foreground">Select which units will be part of this project</p>
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={newUnit}
                            onValueChange={setNewUnit}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select unit to add" />
                            </SelectTrigger>
                            <SelectContent>
                              {unitOptions.filter(unit => !formData.units.includes(unit)).map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            onClick={() => addUnit(newUnit)}
                            disabled={!newUnit}
                            size="sm"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {formData.units.map((unit) => (
                            <Badge key={unit} variant="secondary" className="gap-1">
                              {unit}
                              <button
                                type="button"
                                onClick={() => removeUnit(unit)}
                                className="ml-1 hover:bg-red-100 rounded-full"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      Project Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.startDate}
                              onSelect={(date) => handleInputChange('startDate', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>End Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.endDate}
                              onSelect={(date) => handleInputChange('endDate', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="projectManager">Asset Manager</Label>
                        <Select
                          value={formData.projectManager}
                          onValueChange={(value) => handleInputChange('projectManager', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select asset manager" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="John Smith">John Smith</SelectItem>
                            <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                            <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                            <SelectItem value="Emily Wilson">Emily Wilson</SelectItem>
                            <SelectItem value="David Brown">David Brown</SelectItem>
                            <SelectItem value="Lisa Rodriguez">Lisa Rodriguez</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contractor">Contractor</Label>
                        <Select
                          value={formData.contractor}
                          onValueChange={(value) => handleInputChange('contractor', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select contractor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ABC Construction">ABC Construction</SelectItem>
                            <SelectItem value="Elite Builders">Elite Builders</SelectItem>
                            <SelectItem value="Premier Renovations">Premier Renovations</SelectItem>
                            <SelectItem value="Quality Contractors Inc">Quality Contractors Inc</SelectItem>
                            <SelectItem value="Swift Construction">Swift Construction</SelectItem>
                            <SelectItem value="Modern Build Solutions">Modern Build Solutions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Contractor Contact Information */}
                    {formData.contractor && (
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-3">Contractor Contact Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Email:</span>
                            <div className="font-medium">{formData.contactEmail}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Phone:</span>
                            <div className="font-medium">{formData.contactPhone}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Job Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Categories</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">What type of work will be performed in this project?</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {jobCategoryOptions.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            if (formData.jobCategories.includes(category)) {
                              removeJobCategory(category);
                            } else {
                              addJobCategory(category);
                            }
                          }}
                          className={cn(
                            "p-3 text-sm text-left border rounded-lg transition-all hover:bg-muted",
                            formData.jobCategories.includes(category)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border hover:border-primary/50"
                          )}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/property/projects')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Project
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}