import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/AppHeader";
import { PropertySidebar } from "@/components/PropertySidebar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const RenovationInspectionEdit = () => {
  const navigate = useNavigate();
  const { inspectionId } = useParams();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    unit: "",
    reason: "",
    inspector: "",
    selectedDays: [] as string[],
    selectedTimes: [] as string[],
    status: "Scheduled"
  });

  const reasons = [
    "Draw Payment Approval",
    "Change Order Verification", 
    "Progress Check",
    "Milestone Completion",
    "Quality Inspection",
    "Final Walkthrough"
  ];

  const inspectors = [
    "John Smith - Property Manager",
    "Sarah Johnson - Property Owner", 
    "Mike Davis - Regional Manager",
    "Lisa Chen - Operations Director"
  ];

  const availableDays = [
    { id: "mon-16", label: "Monday", date: "Jan 16" },
    { id: "tue-17", label: "Tuesday", date: "Jan 17" },
    { id: "wed-18", label: "Wednesday", date: "Jan 18" },
    { id: "thu-19", label: "Thursday", date: "Jan 19" },
    { id: "fri-20", label: "Friday", date: "Jan 20" }
  ];

  const timeSlots = [
    { id: "morning", label: "Morning", time: "8am-12pm" },
    { id: "afternoon", label: "Afternoon", time: "12pm-4pm" },
    { id: "evening", label: "Evening", time: "4pm-8pm" }
  ];

  // Mock data for existing inspections
  const mockInspections = [
    {
      id: "INS-001",
      unit: "101",
      reason: "Draw Payment Approval",
      inspector: "John Smith - Property Manager",
      date: "Jan 16, 2024",
      time: "Morning (8am-12pm)",
      status: "Scheduled"
    },
    {
      id: "INS-002",
      unit: "Building A",
      reason: "Progress Check",
      inspector: "Sarah Johnson - Property Owner",
      date: "Jan 18, 2024",
      time: "Afternoon (12pm-4pm)",
      status: "Completed"
    },
    {
      id: "INS-003",
      unit: "Common Areas",
      reason: "Milestone Completion",
      inspector: "Mike Davis - Regional Manager",
      date: "Jan 20, 2024",
      time: "Morning (8am-12pm)",
      status: "In Progress"
    },
    {
      id: "INS-004",
      unit: "203",
      reason: "Change Order Verification",
      inspector: "Lisa Chen - Operations Director",
      date: "Jan 15, 2024",
      time: "Evening (4pm-8pm)",
      status: "Completed"
    }
  ];

  useEffect(() => {
    // Load inspection data based on ID
    const inspection = mockInspections.find(i => i.id === inspectionId);
    if (inspection) {
      setFormData({
        unit: inspection.unit,
        reason: inspection.reason,
        inspector: inspection.inspector,
        selectedDays: ["mon-16"], // Mock selected day based on inspection date
        selectedTimes: [inspection.time.includes("Morning") ? "morning" : 
                       inspection.time.includes("Afternoon") ? "afternoon" : "evening"],
        status: inspection.status
      });
    }
  }, [inspectionId]);

  const toggleDay = (dayId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayId)
        ? prev.selectedDays.filter(d => d !== dayId)
        : [...prev.selectedDays, dayId]
    }));
  };

  const toggleTime = (timeId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTimes: prev.selectedTimes.includes(timeId)
        ? prev.selectedTimes.filter(t => t !== timeId)
        : [...prev.selectedTimes, timeId]
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.unit || !formData.reason || !formData.inspector || 
        formData.selectedDays.length === 0 || formData.selectedTimes.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select at least one day and time slot.",
        variant: "destructive",
      });
      return;
    }

    // Update inspection data
    const updatedInspection = {
      id: inspectionId,
      unit: formData.unit,
      reason: formData.reason,
      inspector: formData.inspector,
      date: formData.selectedDays.join(", "),
      time: formData.selectedTimes.join(", "),
      status: formData.status,
      updatedAt: new Date().toISOString()
    };

    // In a real app, this would be an API call
    console.log("Updating inspection:", updatedInspection);

    // Show success toast
    toast({
      title: "Inspection Updated",
      description: `Inspection ${inspectionId} has been successfully updated.`,
    });

    // Navigate back to inspections list
    navigate('/property/renovation-inspections');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <PropertySidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <div className="max-w-6xl">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">Edit Inspection - {inspectionId}</CardTitle>
                  <p className="text-muted-foreground">
                    Update inspection details for milestone scope of work verification
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Unit/Building */}
                  <div className="space-y-2">
                    <Label htmlFor="unit" className="text-lg font-medium">Unit / Building</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit or building" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="101">101</SelectItem>
                        <SelectItem value="102">102</SelectItem>
                        <SelectItem value="103">103</SelectItem>
                        <SelectItem value="201">201</SelectItem>
                        <SelectItem value="202">202</SelectItem>
                        <SelectItem value="203">203</SelectItem>
                        <SelectItem value="Building A">Building A</SelectItem>
                        <SelectItem value="Building B">Building B</SelectItem>
                        <SelectItem value="Building C">Building C</SelectItem>
                        <SelectItem value="Common Areas">Common Areas</SelectItem>
                        <SelectItem value="Lobby">Lobby</SelectItem>
                        <SelectItem value="Parking Garage">Parking Garage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reason and Inspector */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-lg font-medium">Reason</Label>
                      <Select
                        value={formData.reason}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select from" />
                        </SelectTrigger>
                        <SelectContent>
                          {reasons.map((reason) => (
                            <SelectItem key={reason} value={reason}>
                              {reason}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-lg font-medium">Inspector</Label>
                      <Select
                        value={formData.inspector}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, inspector: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select from" />
                        </SelectTrigger>
                        <SelectContent>
                          {inspectors.map((inspector) => (
                            <SelectItem key={inspector} value={inspector}>
                              {inspector}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label className="text-lg font-medium">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Availability */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Availability</h3>
                      <p className="text-muted-foreground mb-4">
                        Please select days and times when the property available for inspection.
                      </p>
                    </div>

                    {/* Day Selection */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {availableDays.map((day) => (
                        <Button
                          key={day.id}
                          variant="outline"
                          onClick={() => toggleDay(day.id)}
                          className={cn(
                            "h-auto p-3 flex flex-col items-center gap-1 transition-all",
                            formData.selectedDays.includes(day.id)
                              ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                              : "bg-background border-border hover:bg-muted/50 hover:border-primary/50"
                          )}
                        >
                          <span className="font-medium">{day.label}</span>
                          <span className="text-sm">{day.date}</span>
                        </Button>
                      ))}
                    </div>

                    {/* Time Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          variant="outline"
                          onClick={() => toggleTime(slot.id)}
                          className={cn(
                            "h-auto p-4 flex flex-col items-center gap-1 transition-all",
                            formData.selectedTimes.includes(slot.id)
                              ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                              : "bg-background border-border hover:bg-muted/50 hover:border-primary/50"
                          )}
                        >
                          <span className="font-medium text-lg">{slot.label}</span>
                          <span className="text-sm">{slot.time}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Edit Button */}
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={handleSubmit}
                      className="px-8 py-2 text-base"
                      disabled={!formData.unit || !formData.reason || !formData.inspector || formData.selectedDays.length === 0 || formData.selectedTimes.length === 0}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RenovationInspectionEdit;