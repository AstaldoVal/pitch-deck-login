import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/AppHeader";
import { PropertySidebar } from "@/components/PropertySidebar";
import { Plus, Calendar, User, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Inspection {
  id: string;
  unit: string;
  reason: string;
  inspector: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "In Progress";
  result?: "Pass" | "Fail" | "Needs Work";
}

const RenovationInspections = () => {
  const navigate = useNavigate();
  
  // Mock data for existing inspections
  const [inspections] = useState<Inspection[]>([
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
      status: "Completed",
      result: "Pass"
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
      status: "Completed",
      result: "Needs Work"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getResultColor = (result?: string) => {
    switch (result) {
      case "Pass": return "bg-green-100 text-green-800";
      case "Fail": return "bg-red-100 text-red-800";
      case "Needs Work": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled": return <Clock className="w-4 h-4" />;
      case "Completed": return <CheckCircle className="w-4 h-4" />;
      case "Cancelled": return <AlertCircle className="w-4 h-4" />;
      case "In Progress": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <PropertySidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <div className="max-w-6xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Renovation Inspections</h1>
                  <p className="text-muted-foreground">
                    Manage and schedule property inspections for renovation milestones
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/property/renovation-inspections/new')}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Schedule Inspection
                </Button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Scheduled</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {inspections.filter(i => i.status === "Scheduled").length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-2xl font-bold text-green-600">
                          {inspections.filter(i => i.status === "Completed").length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {inspections.filter(i => i.status === "In Progress").length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Need Review</p>
                        <p className="text-2xl font-bold text-red-600">
                          {inspections.filter(i => i.result === "Needs Work" || i.result === "Fail").length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Inspections List */}
              <Card>
                <CardHeader>
                  <CardTitle>All Inspections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inspections.map((inspection) => (
                      <div 
                        key={inspection.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(inspection.status)}
                            <div>
                              <h3 className="font-medium text-sm">{inspection.id}</h3>
                              <p className="text-xs text-muted-foreground">ID</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{inspection.unit}</p>
                              <p className="text-xs text-muted-foreground">Unit/Building</p>
                            </div>
                          </div>

                          <div>
                            <p className="font-medium text-sm">{inspection.reason}</p>
                            <p className="text-xs text-muted-foreground">Reason</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{inspection.inspector.split(' - ')[0]}</p>
                              <p className="text-xs text-muted-foreground">{inspection.inspector.split(' - ')[1]}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{inspection.date}</p>
                              <p className="text-xs text-muted-foreground">{inspection.time}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(inspection.status)}>
                            {inspection.status}
                          </Badge>
                          {inspection.result && (
                            <Badge className={getResultColor(inspection.result)}>
                              {inspection.result}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
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

export default RenovationInspections;