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
import { Progress } from "@/components/ui/progress";

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
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredDraws = mockDraws.filter(draw => 
    filterStatus === "all" || draw.status === filterStatus
  );

  const totalPending = mockDraws.filter(d => d.status === "pending").length;
  const totalApproved = mockDraws.filter(d => d.status === "approved").length;
  const pendingAmount = mockDraws
    .filter(d => d.status === "pending")
    .reduce((sum, d) => sum + d.currentRequestedAmount, 0);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PropertySidebar />
        
        <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Renovation Draws</h1>
              <p className="text-muted-foreground">Manage payment requests for contracted work</p>
            </div>
            <Button 
              onClick={() => navigate("/property/renovation-draws/new")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              New Draw Request
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                    <p className="text-2xl font-bold">{totalPending}</p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    ${pendingAmount.toLocaleString()}
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
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
                    <TableRow key={draw.id}>
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
        </div>
      </main>
      </div>
    </SidebarProvider>
  );
}