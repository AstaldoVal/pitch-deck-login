import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PropertySidebar } from "@/components/PropertySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for change orders
const mockChangeOrders = [
  {
    id: "CO-001",
    unitNumber: "Unit 1A",
    contractor: "Elite Construction",
    requestedBy: "Mike Stevens",
    dateRequested: "2024-01-20",
    reason: "Material specifications changed",
    description: "Upgrade kitchen countertops from laminate to quartz",
    costImpact: 2500,
    timeImpact: 3,
    status: "pending",
    attachments: 2,
    originalContract: "Kitchen Renovation - Phase 1"
  },
  {
    id: "CO-002",
    unitNumber: "Unit 2B",
    contractor: "ProBuild Solutions",
    requestedBy: "Sarah Chen",
    dateRequested: "2024-01-18",
    reason: "Owner request",
    description: "Add additional electrical outlets in living room",
    costImpact: 850,
    timeImpact: 1,
    status: "approved",
    attachments: 3,
    originalContract: "Bathroom Upgrades - Building A"
  },
  {
    id: "CO-003",
    unitNumber: "Building Exterior",
    contractor: "Facade Masters",
    requestedBy: "David Kim",
    dateRequested: "2024-01-15",
    reason: "Building condition discovery",
    description: "Additional structural repairs discovered during inspection",
    costImpact: -1200,
    timeImpact: -2,
    status: "rejected",
    attachments: 5,
    originalContract: "Exterior Facade Restoration"
  },
  {
    id: "CO-004",
    unitNumber: "Common Areas",
    contractor: "Luxury Interiors",
    requestedBy: "Lisa Park",
    dateRequested: "2024-01-22",
    reason: "Material delay",
    description: "Substitute flooring material due to supply chain delay",
    costImpact: 0,
    timeImpact: 5,
    status: "under-review",
    attachments: 1,
    originalContract: "Common Area Modernization"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "draft":
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Draft</Badge>;
    case "pending":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
    case "under-review":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Under Review</Badge>;
    case "approved":
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
    case "rejected":
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
    case "voided":
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Voided</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function ChangeOrders() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredChangeOrders = mockChangeOrders.filter(co => 
    filterStatus === "all" || co.status === filterStatus
  );

  const totalPending = mockChangeOrders.filter(co => co.status === "pending").length;
  const totalApproved = mockChangeOrders.filter(co => co.status === "approved").length;
  const totalUnderReview = mockChangeOrders.filter(co => co.status === "under-review").length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PropertySidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Change Orders</h1>
                <p className="text-muted-foreground">Manage change orders for contracted work</p>
              </div>
              <Button 
                onClick={() => navigate("/property/change-orders/new")}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                New Change Order
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                      <p className="text-2xl font-bold">{totalPending}</p>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Pending
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                      <p className="text-2xl font-bold">{totalUnderReview}</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      In Progress
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Approved This Month</p>
                      <p className="text-2xl font-bold">{totalApproved}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Approved
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Cost Impact</p>
                      <p className="text-2xl font-bold">+$2,150</p>
                    </div>
                    <Badge variant="outline">YTD</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="voided">Voided</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Change Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>Change Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Change Order #</TableHead>
                      <TableHead>Unit/Building</TableHead>
                      <TableHead>Contractor</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Cost Impact</TableHead>
                      <TableHead>Time Impact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Requested</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChangeOrders.map((co) => (
                      <TableRow 
                        key={co.id} 
                        className="cursor-pointer hover:bg-muted/70"
                        onClick={() => navigate(`/property/change-orders/${co.id}`)}
                      >
                        <TableCell className="font-medium">{co.id}</TableCell>
                        <TableCell>{co.unitNumber}</TableCell>
                        <TableCell>{co.contractor}</TableCell>
                        <TableCell>{co.requestedBy}</TableCell>
                        <TableCell>
                          <span className={co.costImpact >= 0 ? "text-red-600" : "text-green-600"}>
                            {co.costImpact >= 0 ? "+" : ""}${Math.abs(co.costImpact).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={co.timeImpact >= 0 ? "text-red-600" : "text-green-600"}>
                            {co.timeImpact >= 0 ? "+" : ""}{co.timeImpact} days
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(co.status)}</TableCell>
                        <TableCell>{new Date(co.dateRequested).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}