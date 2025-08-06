import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PropertySidebar } from "@/components/PropertySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, FileText, Image, CheckCircle, XCircle, Clock, User, Calendar, DollarSign, Timer } from "lucide-react";
import { toast } from "sonner";

// Mock data for change order details
const mockChangeOrder = {
  id: "CO-001",
  unitNumber: "Unit 1A",
  contractor: "Elite Construction",
  requestedBy: "Mike Stevens",
  dateRequested: "2024-01-20",
  reason: "Material specifications changed",
  customReason: "",
  description: "Upgrade kitchen countertops from laminate to quartz per owner request. This change will provide better durability and aesthetics but requires additional time for material ordering and installation.",
  costImpact: 2500,
  timeImpact: 3,
  status: "pending",
  originalContract: "Kitchen Renovation - Phase 1",
  contractValue: 50000,
  approver: "",
  dateApproved: "",
  digitalSignature: "",
  attachments: [
    {
      id: 1,
      name: "Quartz_Samples.pdf",
      type: "documentation",
      size: "2.1 MB",
      uploadedBy: "Mike Stevens",
      uploadedDate: "2024-01-20"
    },
    {
      id: 2,
      name: "Kitchen_Photos.zip",
      type: "photos",
      size: "5.8 MB",
      uploadedBy: "Mike Stevens",
      uploadedDate: "2024-01-20"
    }
  ],
  history: [
    {
      id: 1,
      action: "Created",
      user: "Mike Stevens",
      date: "2024-01-20T10:30:00Z",
      description: "Change order created and submitted for review"
    },
    {
      id: 2,
      action: "Under Review",
      user: "Sarah Johnson",
      date: "2024-01-20T14:15:00Z",
      description: "Change order assigned for review"
    }
  ]
};

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

export default function ChangeOrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [changeOrder] = useState(mockChangeOrder);

  const handleApprove = () => {
    toast.success("Change order approved successfully");
    // In real app, this would update the status
  };

  const handleReject = () => {
    toast.error("Change order rejected");
    // In real app, this would update the status
  };

  const handleDownload = (filename: string) => {
    toast.success(`Downloading ${filename}`);
    // In real app, this would trigger file download
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
                <h1 className="text-3xl font-bold tracking-tight">Change Order {changeOrder.id}</h1>
                <p className="text-muted-foreground">{changeOrder.originalContract}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                {changeOrder.status === "pending" && (
                  <>
                    <Button variant="outline" onClick={handleReject} className="gap-2">
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button onClick={handleApprove} className="gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Change Order Details
                      {getStatusBadge(changeOrder.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Requested By</p>
                            <p className="font-semibold">{changeOrder.requestedBy}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Date Requested</p>
                            <p className="font-semibold">{new Date(changeOrder.dateRequested).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Unit/Building</p>
                          <p className="font-semibold">{changeOrder.unitNumber}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Contractor</p>
                          <p className="font-semibold">{changeOrder.contractor}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Reason for Change</p>
                          <p className="font-semibold">{changeOrder.reason}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Original Contract</p>
                          <p className="font-semibold">{changeOrder.originalContract}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Description of Change</p>
                      <p className="text-sm leading-relaxed">{changeOrder.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Impact Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle>Impact Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4 p-4 border rounded-lg">
                        <DollarSign className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Cost Impact</p>
                          <p className={`text-2xl font-bold ${changeOrder.costImpact >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {changeOrder.costImpact >= 0 ? '+' : ''}${Math.abs(changeOrder.costImpact).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 border rounded-lg">
                        <Timer className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Time Impact</p>
                          <p className={`text-2xl font-bold ${changeOrder.timeImpact >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {changeOrder.timeImpact >= 0 ? '+' : ''}{changeOrder.timeImpact} days
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-3">Contract Impact Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Original Contract Value:</span>
                          <span className="font-medium">${changeOrder.contractValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Change Order Amount:</span>
                          <span className={`font-medium ${changeOrder.costImpact >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {changeOrder.costImpact >= 0 ? '+' : ''}${Math.abs(changeOrder.costImpact).toLocaleString()}
                          </span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between">
                          <span className="font-medium">Adjusted Contract Value:</span>
                          <span className="font-bold">${(changeOrder.contractValue + changeOrder.costImpact).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Supporting Documentation */}
                <Card>
                  <CardHeader>
                    <CardTitle>Supporting Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {changeOrder.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getFileIcon(attachment.type)}
                            <div>
                              <p className="font-medium">{attachment.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {attachment.size} • Uploaded by {attachment.uploadedBy} on {new Date(attachment.uploadedDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(attachment.name)}
                            className="gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Activity History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {changeOrder.history.map((activity, index) => (
                        <div key={activity.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {activity.action === "Created" ? (
                                <Clock className="w-4 h-4 text-primary" />
                              ) : (
                                <User className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            {index < changeOrder.history.length - 1 && (
                              <div className="w-px h-12 bg-border mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{activity.action}</p>
                              <span className="text-sm text-muted-foreground">•</span>
                              <p className="text-sm text-muted-foreground">{activity.user}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(activity.date).toLocaleString()}
                            </p>
                            <p className="text-sm mt-1">{activity.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6 sticky top-6">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Change Order #:</span>
                      <span className="font-medium">{changeOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      {getStatusBadge(changeOrder.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cost Impact:</span>
                      <span className={`font-medium ${changeOrder.costImpact >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {changeOrder.costImpact >= 0 ? '+' : ''}${Math.abs(changeOrder.costImpact).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Time Impact:</span>
                      <span className={`font-medium ${changeOrder.timeImpact >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {changeOrder.timeImpact >= 0 ? '+' : ''}{changeOrder.timeImpact} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Attachments:</span>
                      <span className="font-medium">{changeOrder.attachments.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}