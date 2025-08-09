import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { cn } from "@/lib/utils";

const RenovationInspections = () => {
  const [formData, setFormData] = useState({
    unit: "",
    reason: "",
    inspector: "",
    selectedDays: [] as string[],
    selectedTimes: [] as string[]
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
    { id: "thu-19", label: "Jan 16", date: "Jan 19" },
    { id: "fri-20", label: "Jan 20", date: "Jan 20" }
  ];

  const timeSlots = [
    { id: "morning", label: "Morning", time: "8am-12pm" },
    { id: "afternoon", label: "Afternoon", time: "12pm-4pm" },
    { id: "evening", label: "Evening", time: "4pm-8pm" }
  ];

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
    console.log("Inspection scheduled:", formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 md:ml-64">
        <AppHeader />
        <main className="p-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Schedule Renovation Inspection</CardTitle>
                <p className="text-muted-foreground">
                  Schedule an inspection for milestone scope of work verification
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Unit/Building */}
                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-lg font-medium">Unit / Building</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="Enter unit or building number"
                    className="text-base"
                  />
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

                {/* Continue Button */}
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleSubmit}
                    className="px-8 py-2 text-base"
                    disabled={!formData.unit || !formData.reason || !formData.inspector || formData.selectedDays.length === 0 || formData.selectedTimes.length === 0}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RenovationInspections;