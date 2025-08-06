import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PropertySidebar } from "@/components/PropertySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for renovation draws
const mockDraws = [
  {
    id: "RD-001",
    unitNumber: "Unit 1A",
    contractedCost: 50000,
    previouslyRequested: 15000,
    remainingBalance: 35000,
    currentRequestedPercent: 30,
    currentRequestedAmount: 15000,
    status: "pending",
    contractor: "Elite Construction",
    dateSubmitted: "2024-01-15",
    approver: "John Smith",
    lienWaiverStatus: "approved",
    attachments: 3
  },
  {
    id: "RD-002",
    unitNumber: "Unit 2B",
    contractedCost: 75000,
    previouslyRequested: 37500,
    remainingBalance: 37500,
    currentRequestedPercent: 25,
    currentRequestedAmount: 18750,
    status: "approved",
    contractor: "ProBuild Solutions",
    dateSubmitted: "2024-01-12",
    approver: "Sarah Johnson",
    lienWaiverStatus: "submitted",
    attachments: 5
  },
  {
    id: "RD-003",
    unitNumber: "Building Exterior",
    contractedCost: 120000,
    previouslyRequested: 60000,
    remainingBalance: 60000,
    currentRequestedPercent: 20,
    currentRequestedAmount: 24000,
    status: "rejected",
    contractor: "Facade Masters",
    dateSubmitted: "2024-01-10",
    approver: "Mike Davis",
    lienWaiverStatus: "rejected",
    attachments: 2,
    rejectionReason: "Missing lien waiver documentation"
  },
  {
    id: "RD-004",
    unitNumber: "Unit 3C",
    contractedCost: 45000,
    previouslyRequested: 0,
    remainingBalance: 45000,
    currentRequestedPercent: 25,
    currentRequestedAmount: 11250,
    status: "pending",
    contractor: "Metro Renovations",
    dateSubmitted: "2024-01-18",
    approver: "Lisa Wong",
    lienWaiverStatus: "not_provided",
    attachments: 1
  },
  {
    id: "RD-005",
    unitNumber: "Unit 4D",
    contractedCost: 65000,
    previouslyRequested: 19500,
    remainingBalance: 45500,
    currentRequestedPercent: 30,
    currentRequestedAmount: 19500,
    status: "pending",
    contractor: "Quality Builders",
    dateSubmitted: "2024-01-20",
    approver: "John Smith",
    lienWaiverStatus: "submitted",
    attachments: 4
  },
  {
    id: "RD-006",
    unitNumber: "Common Areas",
    contractedCost: 85000,
    previouslyRequested: 25500,
    remainingBalance: 59500,
    currentRequestedPercent: 35,
    currentRequestedAmount: 29750,
    status: "approved",
    contractor: "Premium Interiors",
    dateSubmitted: "2024-01-08",
    approver: "Sarah Johnson",
    lienWaiverStatus: "approved",
    attachments: 6
  }
];

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
    case "pending":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
    case "approved":
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
    case "rejected":
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getLienWaiverBadge = (status: string) => {
  switch (status) {
    case "not_provided":
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Not Provided</Badge>;
    case "submitted":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Submitted</Badge>;
    case "approved":
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function RenovationDraws() {
  const navigate = useNavigate();
  const location = useLocation();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Set initial tab based on current route
  const getInitialTab = () => {
    if (location.pathname.includes("/change-orders")) {
      return "change-orders";
    }
    return "draws";
  };
  
  const [activeTab, setActiveTab] = useState<string>(getInitialTab());
  
  // Update tab when route changes
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);

  const filteredDraws = mockDraws.filter(draw => 
    filterStatus === "all" || draw.status === filterStatus
  );

  const filteredChangeOrders = mockChangeOrders.filter(co => 
    filterStatus === "all" || co.status === filterStatus
  );

  const totalPending = mockDraws.filter(d => d.status === "pending").length;
  const totalApproved = mockDraws.filter(d => d.status === "approved").length;
  const pendingAmount = mockDraws
    .filter(d => d.status === "pending")
    .reduce((sum, d) => sum + d.currentRequestedAmount, 0);

  const totalPendingCOs = mockChangeOrders.filter(co => co.status === "pending").length;
  const totalApprovedCOs = mockChangeOrders.filter(co => co.status === "approved").length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PropertySidebar />
        
        <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Draws</h1>
              <p className="text-muted-foreground">Manage payment requests and change orders for contracted work</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate("/property/change-orders/new")}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                New Change Order
              </Button>
              <Button 
                onClick={() => navigate("/property/renovation-draws/new")}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                New Draw Request
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="draws">Draws</TabsTrigger>
              <TabsTrigger value="change-orders">Change Orders</TabsTrigger>
            </TabsList>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {activeTab === "change-orders" ? "Pending Change Orders" : "Pending Requests"}
                      </p>
                      <p className="text-2xl font-bold">
                        {activeTab === "change-orders" ? totalPendingCOs : totalPending}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {activeTab === "change-orders" ? "Pending" : `$${pendingAmount.toLocaleString()}`}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {activeTab === "change-orders" ? "Approved This Month" : "Approved This Month"}
                      </p>
                      <p className="text-2xl font-bold">
                        {activeTab === "change-orders" ? totalApprovedCOs : totalApproved}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Disbursed</p>
                      <p className="text-2xl font-bold">$92,250</p>
                    </div>
                    <Badge variant="outline">YTD</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Remaining Budget</p>
                      <p className="text-2xl font-bold">$132,500</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Available
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-6">
              {/* Combined view showing both draws and change orders */}
              <Card>
                <CardHeader>
                  <CardTitle>All Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Unit/Building</TableHead>
                        <TableHead>Contractor</TableHead>
                        <TableHead>Amount/Impact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Draws */}
                      {filteredDraws.map((draw) => (
                        <TableRow 
                          key={draw.id} 
                          className="cursor-pointer hover:bg-muted/70"
                          onClick={() => navigate(`/property/renovation-draws/${draw.id}`)}
                        >
                          <TableCell className="font-medium">{draw.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">Draw Request</Badge>
                          </TableCell>
                          <TableCell>{draw.unitNumber}</TableCell>
                          <TableCell>{draw.contractor}</TableCell>
                          <TableCell>${draw.currentRequestedAmount.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(draw.status)}</TableCell>
                          <TableCell>{new Date(draw.dateSubmitted).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                      {/* Change Orders */}
                      {filteredChangeOrders.map((co) => (
                        <TableRow 
                          key={co.id} 
                          className="cursor-pointer hover:bg-muted/70"
                          onClick={() => navigate(`/property/change-orders/${co.id}`)}
                        >
                          <TableCell className="font-medium">{co.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700">Change Order</Badge>
                          </TableCell>
                          <TableCell>{co.unitNumber}</TableCell>
                          <TableCell>{co.contractor}</TableCell>
                          <TableCell>
                            <span className={co.costImpact >= 0 ? "text-red-600" : "text-green-600"}>
                              {co.costImpact >= 0 ? "+" : ""}${Math.abs(co.costImpact).toLocaleString()}
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
            </TabsContent>

            <TabsContent value="draws" className="space-y-6">
              {/* Draws Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Draw Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Unit/Building</TableHead>
                        <TableHead>Contractor</TableHead>
                        <TableHead>Requested Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Submitted</TableHead>
                        <TableHead>Lien Waiver</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDraws.map((draw) => (
                        <TableRow 
                          key={draw.id} 
                          className="cursor-pointer hover:bg-muted/70"
                          onClick={() => navigate(`/property/renovation-draws/${draw.id}`)}
                        >
                          <TableCell className="font-medium">{draw.id}</TableCell>
                          <TableCell>{draw.unitNumber}</TableCell>
                          <TableCell>{draw.contractor}</TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">${draw.currentRequestedAmount.toLocaleString()}</span>
                                <span className="text-sm text-muted-foreground">of ${draw.contractedCost.toLocaleString()}</span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>${draw.previouslyRequested.toLocaleString()} to pay</span>
                                  <span>{Math.round((draw.previouslyRequested / draw.contractedCost) * 100)}%</span>
                                </div>
                                <Progress 
                                  value={(draw.previouslyRequested / draw.contractedCost) * 100} 
                                  className="h-2"
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(draw.status)}</TableCell>
                          <TableCell>{new Date(draw.dateSubmitted).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {getLienWaiverBadge(draw.lienWaiverStatus)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="change-orders" className="space-y-6">
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
      </div>
    </SidebarProvider>
  );
}