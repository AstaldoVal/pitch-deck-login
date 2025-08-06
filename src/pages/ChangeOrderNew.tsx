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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, X, FileText, Image, Calculator } from "lucide-react";
import { toast } from "sonner";

export default function ChangeOrderNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project: "",
    unitNumber: "",
    contractor: "",
    reason: "",
    description: "",
    costImpact: "",
    timeImpact: "",
    isAddition: true,
    customReason: ""
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
    if (!formData.project || !formData.unitNumber || !formData.reason || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.costImpact && !formData.timeImpact) {
      toast.error("Please specify either cost impact or time impact");
      return;
    }

    toast.success("Change order submitted successfully");
    navigate("/property/change-orders");
  };

  const handleFileUpload = (type: string) => {
    // Simulate file upload
    const newFile = {
      id: Date.now(),
      name: type === "documentation" ? "Change_Documentation.pdf" : 
            type === "photos" ? "Progress_Photos.zip" : "Supporting_Documents.pdf",
      type,
      size: "1.2 MB"
    };
    setAttachments(prev => [...prev, newFile]);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`);
  };

  const removeAttachment = (id: number) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const calculateAdjustedAmount = () => {
    const amount = parseFloat(formData.costImpact) || 0;
    return formData.isAddition ? amount : -amount;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "documentation":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "photos":
        return <Image className="w-4 h-4 text-green-600" />;
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
                onClick={() => navigate("/property/change-orders")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Change Orders
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">New Change Order</h1>
                <p className="text-muted-foreground">Submit a change order for contracted work</p>
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
                        <Label htmlFor="project">Project <span className="text-destructive">*</span></Label>
                        <Select 
                          value={formData.project} 
                          onValueChange={(value) => {
                            setFormData(prev => ({ 
                              ...prev, 
                              project: value, 
                              unitNumber: "",
                              contractor: getContractorForProject(value)
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
                          <Label htmlFor="unitNumber">Unit/Building Number <span className="text-destructive">*</span></Label>
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

                  {/* Change Order Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Change Order #</Label>
                            <p className="text-lg font-semibold">CO-NEW</p>
                            <p className="text-sm text-muted-foreground">Will be assigned upon submission</p>
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
                            <Label className="text-sm font-medium text-muted-foreground">Requested By</Label>
                            <p className="text-lg font-semibold">{formData.contractor || "Select project first"}</p>
                            <p className="text-sm text-muted-foreground">Contractor</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Date Requested</Label>
                            <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
                          </div>

                          <div>
                            <Label htmlFor="reason">Reason for Change <span className="text-destructive">*</span></Label>
                            <Select 
                              value={formData.reason} 
                              onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select reason" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="owner-request">Owner Request</SelectItem>
                                <SelectItem value="material-delay">Material Delay</SelectItem>
                                <SelectItem value="building-condition">Building Condition Discovery</SelectItem>
                                <SelectItem value="permit-requirement">Permit Requirement</SelectItem>
                                <SelectItem value="code-compliance">Code Compliance</SelectItem>
                                <SelectItem value="design-change">Design Change</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {formData.reason === "other" && (
                            <div>
                              <Label htmlFor="customReason">Custom Reason</Label>
                              <Input
                                id="customReason"
                                placeholder="Specify the reason"
                                value={formData.customReason}
                                onChange={(e) => setFormData(prev => ({ ...prev, customReason: e.target.value }))}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description of Change <span className="text-destructive">*</span></Label>
                        <Textarea
                          id="description"
                          placeholder="Provide a detailed description of the proposed change..."
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Impact Assessment */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Impact Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="costImpact">Cost Impact ($)</Label>
                            <Input
                              id="costImpact"
                              type="number"
                              placeholder="0"
                              value={formData.costImpact}
                              onChange={(e) => setFormData(prev => ({ ...prev, costImpact: e.target.value }))}
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="addition-subtraction"
                              checked={formData.isAddition}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAddition: checked }))}
                            />
                            <Label htmlFor="addition-subtraction" className="text-sm">
                              {formData.isAddition ? "Addition" : "Subtraction"}
                            </Label>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Adjusted Amount</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Calculator className="w-4 h-4 text-muted-foreground" />
                              <span className={`text-lg font-semibold ${calculateAdjustedAmount() >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {calculateAdjustedAmount() >= 0 ? '+' : ''}${Math.abs(calculateAdjustedAmount()).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="timeImpact">Time Impact (days)</Label>
                            <Input
                              id="timeImpact"
                              type="number"
                              placeholder="0"
                              value={formData.timeImpact}
                              onChange={(e) => setFormData(prev => ({ ...prev, timeImpact: e.target.value }))}
                            />
                          </div>

                          <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-medium mb-2">Impact Summary</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Cost Impact:</span>
                                <span className={calculateAdjustedAmount() >= 0 ? 'text-red-600' : 'text-green-600'}>
                                  {calculateAdjustedAmount() >= 0 ? '+' : ''}${Math.abs(calculateAdjustedAmount()).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Time Impact:</span>
                                <span className={parseInt(formData.timeImpact || "0") >= 0 ? 'text-red-600' : 'text-green-600'}>
                                  {parseInt(formData.timeImpact || "0") >= 0 ? '+' : ''}{formData.timeImpact || 0} days
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Supporting Files */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Supporting Documentation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleFileUpload("documentation")}
                          className="h-20 flex-col gap-2"
                        >
                          <Upload className="w-6 h-6" />
                          Upload Documentation
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
                                onClick={() => removeAttachment(attachment.id)}
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
                      <CardTitle>Change Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Type:</span>
                        <span className="font-medium">{formData.isAddition ? "Addition" : "Subtraction"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Cost Impact:</span>
                        <span className={`font-medium ${calculateAdjustedAmount() >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {calculateAdjustedAmount() >= 0 ? '+' : ''}${Math.abs(calculateAdjustedAmount()).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Time Impact:</span>
                        <span className={`font-medium ${parseInt(formData.timeImpact || "0") >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {parseInt(formData.timeImpact || "0") >= 0 ? '+' : ''}{formData.timeImpact || 0} days
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm">Status:</span>
                        <span className="font-medium">Draft</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit */}
                  <Card>
                    <CardContent className="p-4">
                      <Button 
                        type="submit" 
                        className="w-full"
                      >
                        Submit Change Order
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        Change order will be submitted for review
                      </p>
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