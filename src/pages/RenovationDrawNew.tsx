import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PropertySidebar } from "@/components/PropertySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, X, FileText, Image } from "lucide-react";
import { toast } from "sonner";

export default function RenovationDrawNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project: "",
    unitNumber: "",
    contractedCost: "",
    previouslyRequested: "",
    currentRequestedPercent: "",
    notes: "",
    contractor: "",
    hasLienWaiver: false,
    description: ""
  });
  const [attachments, setAttachments] = useState<Array<{id: number, name: string, type: string, size: string}>>([]);

  // Helper functions for project-based data
  const getContractorForProject = (projectId: string): string => {
    const projectContractors: Record<string, string> = {
      "project-1": "Elite Construction",
      "project-2": "ProBuild Solutions", 
      "project-3": "Facade Masters",
      "project-4": "Luxury Interiors"
    };
    return projectContractors[projectId] || "";
  };

  const getUnitsForProject = (projectId: string): string[] => {
    const projectUnits: Record<string, string[]> = {
      "project-1": ["Unit 1A", "Unit 1B", "Unit 2A"],
      "project-2": ["Unit 2B", "Unit 3A", "Unit 3B"],
      "project-3": ["Building Exterior", "Common Areas"],
      "project-4": ["Common Areas", "Lobby", "Mailroom"]
    };
    return projectUnits[projectId] || [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.project || !formData.unitNumber || !formData.contractedCost || !formData.currentRequestedPercent) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.hasLienWaiver) {
      toast.error("Lien waiver must be submitted before creating draw request");
      return;
    }

    toast.success("Draw request submitted successfully");
    navigate("/property/renovation-draws");
  };

  const handleFileUpload = (type: string) => {
    // Simulate file upload
    const newFile = {
      id: Date.now(),
      name: type === "invoice" ? "Invoice_Example.pdf" : 
            type === "photos" ? "Progress_Photos.zip" : "Lien_Waiver.pdf",
      type,
      size: "1.2 MB"
    };
    setAttachments(prev => [...prev, newFile]);
    
    if (type === "lien-waiver") {
      setFormData(prev => ({ ...prev, hasLienWaiver: true }));
    }
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`);
  };

  const removeAttachment = (id: number, type: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
    
    if (type === "lien-waiver") {
      setFormData(prev => ({ ...prev, hasLienWaiver: false }));
    }
  };

  const calculateCurrentAmount = () => {
    const contracted = parseFloat(formData.contractedCost) || 0;
    const percent = parseFloat(formData.currentRequestedPercent) || 0;
    return (contracted * percent / 100);
  };

  const calculateRemainingBalance = () => {
    const contracted = parseFloat(formData.contractedCost) || 0;
    const previous = parseFloat(formData.previouslyRequested) || 0;
    const current = calculateCurrentAmount();
    return contracted - previous - current;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "invoice":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "photos":
        return <Image className="w-4 h-4 text-green-600" />;
      case "lien-waiver":
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PropertySidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/property/renovation-draws")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Draws
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">New Draw Request</h1>
                <p className="text-muted-foreground">Submit a new renovation draw request</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                     <CardContent className="space-y-4">
                      {/* Project Selection */}
                      <div>
                        <Label htmlFor="project">Project *</Label>
                        <Select 
                          value={formData.project} 
                          onValueChange={(value) => {
                            setFormData(prev => ({ 
                              ...prev, 
                              project: value, 
                              unitNumber: "", // Reset unit when project changes
                              contractor: getContractorForProject(value) // Auto-fill contractor
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="project-1">Kitchen Renovation - Phase 1</SelectItem>
                            <SelectItem value="project-2">Bathroom Upgrades - Building A</SelectItem>
                            <SelectItem value="project-3">Exterior Facade Restoration</SelectItem>
                            <SelectItem value="project-4">Common Area Modernization</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="unitNumber">Unit/Building Number *</Label>
                          <Select 
                            value={formData.unitNumber} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, unitNumber: value }))}
                            disabled={!formData.project}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={formData.project ? "Select unit or building" : "Select project first"} />
                            </SelectTrigger>
                            <SelectContent>
                              {getUnitsForProject(formData.project).map((unit) => (
                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="contractor">Contractor</Label>
                          <Input
                            value={formData.contractor}
                            disabled
                            className="bg-muted"
                            placeholder="Auto-filled from project"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Draw Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Draw Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Draw #</Label>
                            <p className="text-lg font-semibold">RD-NEW</p>
                            <p className="text-sm text-muted-foreground">Will be assigned upon approval</p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Current Status</Label>
                            <div className="mt-1">
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                Draft
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Draw Amount</Label>
                            <p className="text-lg font-semibold">
                              ${calculateCurrentAmount().toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formData.currentRequestedPercent}% of ${parseFloat(formData.contractedCost || "0").toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Date Requested</Label>
                            <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Requested By</Label>
                            <p className="text-lg font-semibold">John Smith</p>
                            <p className="text-sm text-muted-foreground">Asset Manager</p>
                          </div>

                          <div>
                            <Label htmlFor="description">Draw Description</Label>
                            <Textarea
                              id="description"
                              placeholder="Provide a brief description of this draw request..."
                              value={formData.description}
                              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Financial Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contractedCost">Current Contracted Cost *</Label>
                          <Input
                            id="contractedCost"
                            type="number"
                            placeholder="50000"
                            value={formData.contractedCost}
                            onChange={(e) => setFormData(prev => ({ ...prev, contractedCost: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="previouslyRequested">Previously Requested Amount</Label>
                          <Input
                            id="previouslyRequested"
                            type="number"
                            placeholder="15000"
                            value={formData.previouslyRequested}
                            onChange={(e) => setFormData(prev => ({ ...prev, previouslyRequested: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="currentRequestedPercent">Current Amount Requested (%) *</Label>
                          <Input
                            id="currentRequestedPercent"
                            type="number"
                            placeholder="30"
                            min="0"
                            max="100"
                            value={formData.currentRequestedPercent}
                            onChange={(e) => setFormData(prev => ({ ...prev, currentRequestedPercent: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label>Final Requested Amount</Label>
                          <Input
                            value={`$${calculateCurrentAmount().toLocaleString()}`}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Remaining Balance</Label>
                        <Input
                          value={`$${calculateRemainingBalance().toLocaleString()}`}
                          disabled
                          className="bg-muted"
                        />
                      </div>

                    </CardContent>
                  </Card>

                  {/* Notes and Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Work Progress Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Label htmlFor="notes">Describe the completed work and current progress</Label>
                      <Textarea
                        id="notes"
                        placeholder="Provide details about the work completed, materials used, and any relevant information for this draw request..."
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        rows={4}
                      />
                    </CardContent>
                  </Card>

                  {/* Supporting Files */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Supporting Files</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleFileUpload("invoice")}
                          className="h-20 flex-col gap-2"
                        >
                          <Upload className="w-6 h-6" />
                          Upload Invoices
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleFileUpload("photos")}
                          className="h-20 flex-col gap-2"
                        >
                          <Upload className="w-6 h-6" />
                          Upload Photos
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleFileUpload("lien-waiver")}
                          className="h-20 flex-col gap-2"
                        >
                          <Upload className="w-6 h-6" />
                          Upload Lien Waiver
                        </Button>
                      </div>

                      {/* Uploaded Files */}
                      {attachments.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Uploaded Files:</h4>
                          {attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                {getFileIcon(attachment.type)}
                                <div>
                                  <p className="font-medium">{attachment.name}</p>
                                  <p className="text-sm text-muted-foreground">{attachment.size}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttachment(attachment.id, attachment.type)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6 sticky top-6 self-start">
                  {/* Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Request Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Contract Total:</span>
                        <span className="font-medium">${parseFloat(formData.contractedCost || "0").toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Previously Requested:</span>
                        <span className="font-medium">${parseFloat(formData.previouslyRequested || "0").toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Current Request:</span>
                        <span className="font-medium text-primary">${calculateCurrentAmount().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm">Remaining Balance:</span>
                        <span className="font-medium">${calculateRemainingBalance().toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Requirements Checklist */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="invoices" 
                          checked={attachments.some(att => att.type === "invoice")}
                          disabled
                        />
                        <Label htmlFor="invoices" className="text-sm">Invoices uploaded</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="photos" 
                          checked={attachments.some(att => att.type === "photos")}
                          disabled
                        />
                        <Label htmlFor="photos" className="text-sm">Progress photos uploaded</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="lien-waiver" 
                          checked={formData.hasLienWaiver}
                          disabled
                        />
                        <Label htmlFor="lien-waiver" className="text-sm">Lien waiver submitted *</Label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit */}
                  <Card>
                    <CardContent className="p-4">
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={!formData.hasLienWaiver}
                      >
                        Submit Draw Request
                      </Button>
                      {!formData.hasLienWaiver && (
                        <p className="text-sm text-red-600 mt-2">
                          ⚠️ Lien waiver must be uploaded before submission
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}