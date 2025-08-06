import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PropertySidebar } from "@/components/PropertySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, Check, X, Download, FileText, Image, Eye, Calendar, User, DollarSign, Building, ChevronDown } from "lucide-react";
import { toast } from "sonner";

// Mock data for draw details
const mockDrawData = {
  "RD-001": {
    id: "RD-001",
    unitNumber: "Unit 1A",
    contractedCost: 50000,
    previouslyRequested: 15000,
    remainingBalance: 35000,
    currentRequestedPercent: 30,
    currentRequestedAmount: 15000,
    finalRequestedAmount: 50000,
    status: "pending",
    contractor: "Elite Construction",
    contractorEmail: "contact@eliteconstruction.com",
    dateSubmitted: "2024-01-15",
    approver: "John Smith",
    hasLienWaiver: true,
    notes: "Second draw request for kitchen renovation. All electrical work completed as per contract specifications. Plumbing rough-in is 90% complete. Ready for inspection.",
    attachments: [
      { id: 1, name: "Invoice_Kitchen_Electrical.pdf", type: "invoice", size: "245 KB" },
      { id: 2, name: "Progress_Photos_Jan15.zip", type: "photos", size: "2.3 MB" },
      { id: 3, name: "Lien_Waiver_EliteConstruction.pdf", type: "lien-waiver", size: "156 KB" }
    ],
    timeline: [
      { date: "2024-01-15", action: "Draw request submitted", user: "Elite Construction", status: "submitted" },
      { date: "2024-01-14", action: "Lien waiver uploaded", user: "Elite Construction", status: "completed" },
      { date: "2024-01-12", action: "Work progress documented", user: "Elite Construction", status: "completed" }
    ]
  }
};

export default function RenovationDrawDetails() {
  const { drawId } = useParams();
  const navigate = useNavigate();
  const [approvalNotes, setApprovalNotes] = useState("");
  const [lienWaiverStatus, setLienWaiverStatus] = useState("submitted");
  
  const draw = mockDrawData[drawId as keyof typeof mockDrawData];

  if (!draw) {
    return (
      <div className="min-h-screen flex w-full">
        <PropertySidebar />
        <main className="flex-1 p-6">
          <div className="text-center mt-20">
            <h2 className="text-2xl font-bold">Draw Request Not Found</h2>
            <Button onClick={() => navigate("/property/renovation-draws")} className="mt-4">
              Back to Draws
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleApprove = () => {
    toast.success("Draw request approved successfully");
    navigate("/property/renovation-draws");
  };

  const handleReject = () => {
    toast.error("Draw request rejected");
    navigate("/property/renovation-draws");
  };

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
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Not Provided</Badge>;
      case "submitted":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Submitted</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleLienWaiverStatusChange = (newStatus: string) => {
    setLienWaiverStatus(newStatus);
    toast.success(`Lien waiver status updated to ${newStatus}`);
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
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">Draw Request {draw.id}</h1>
              <p className="text-muted-foreground">{draw.unitNumber} - {draw.contractor}</p>
            </div>
            {getStatusBadge(draw.status)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Financial Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contract Total</p>
                      <p className="text-xl font-bold">${draw.contractedCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Previously Requested</p>
                      <p className="text-xl font-bold">${draw.previouslyRequested.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Request</p>
                      <p className="text-xl font-bold text-primary">${draw.currentRequestedAmount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{draw.currentRequestedPercent}% of contract</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Remaining Balance</p>
                      <p className="text-xl font-bold">${draw.remainingBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Progress</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${((draw.previouslyRequested + draw.currentRequestedAmount) / draw.contractedCost) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">
                          {Math.round(((draw.previouslyRequested + draw.currentRequestedAmount) / draw.contractedCost) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes and Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Work Progress Notes</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{draw.notes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Supporting Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Supporting Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {draw.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getFileIcon(attachment.type)}
                          <div>
                            <p className="font-medium">{attachment.name}</p>
                            <p className="text-sm text-muted-foreground">{attachment.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {draw.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium">{event.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.user} • {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Request Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Submitted</p>
                      <p className="text-sm text-muted-foreground">{new Date(draw.dateSubmitted).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Contractor</p>
                      <p className="text-sm text-muted-foreground">{draw.contractor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Approver</p>
                      <p className="text-sm text-muted-foreground">{draw.approver}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lien Waiver Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Lien Waiver</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            {getLienWaiverBadge(lienWaiverStatus)}
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleLienWaiverStatusChange("not_provided")}>
                            Not Provided
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLienWaiverStatusChange("submitted")}>
                            Submitted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLienWaiverStatusChange("approved")}>
                            Approved
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLienWaiverStatusChange("rejected")}>
                            Rejected
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {(lienWaiverStatus === "submitted" || lienWaiverStatus === "approved") && (
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Waiver
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              {draw.status === "pending" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Approval Notes</label>
                      <Textarea
                        placeholder="Add notes for approval/rejection..."
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="w-full gap-2" disabled={!draw.hasLienWaiver}>
                            <Check className="w-4 h-4" />
                            Approve Draw
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Approve Draw Request</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to approve this draw request for ${draw.currentRequestedAmount.toLocaleString()}? 
                              This action will initiate the payment process.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleApprove}>
                              Approve
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full gap-2">
                            <X className="w-4 h-4" />
                            Reject Draw
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Draw Request</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject this draw request? 
                              Please make sure you've added notes explaining the reason for rejection.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleReject} className="bg-destructive text-destructive-foreground">
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {!draw.hasLienWaiver && (
                      <p className="text-sm text-red-600">
                        ⚠️ Lien waiver must be submitted before approval
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      </div>
    </SidebarProvider>
  );
}