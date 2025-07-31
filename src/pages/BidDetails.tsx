import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PropertySidebar } from "@/components/PropertySidebar";
import { AppHeader } from "@/components/AppHeader";
import { ArrowLeft, Calendar, Users, Briefcase, User, Mail } from "lucide-react";
import { format } from "date-fns";

interface BidData {
  id: string;
  generatedBy: string;
  email: string;
  phone: string;
  companyName: string;
  property: any;
  startDate: Date;
  endDate: Date;
  scopeType: string;
  jobCategories: any[];
  contractors: any[];
  createdAt: string;
}

export default function BidDetails() {
  const { bidId } = useParams();
  const navigate = useNavigate();
  const [bid, setBid] = useState<BidData | null>(null);

  useEffect(() => {
    // Load specific bid from localStorage
    const savedBids = JSON.parse(localStorage.getItem('propertyBids') || '[]');
    const foundBid = savedBids.find((b: BidData) => b.id === bidId);
    setBid(foundBid || null);
  }, [bidId]);

  const handleBackToBids = () => {
    navigate('/property/bids-list');
  };

  const formatBidDate = (date: Date | string | undefined): string => {
    if (!date) return "Not set";
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Invalid date";
    return format(dateObj, 'MMM dd, yyyy');
  };

  const getBidStatus = (bid: BidData) => {
    const now = new Date();
    const startDate = bid.startDate ? new Date(bid.startDate) : null;
    const endDate = bid.endDate ? new Date(bid.endDate) : null;
    
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return "Unknown";
    }
    
    if (now < startDate) return "Pending";
    if (now >= startDate && now <= endDate) return "Active";
    return "Completed";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Active": return "bg-green-100 text-green-800";
      case "Completed": return "bg-gray-100 text-gray-800";
      case "Unknown": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!bid) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <PropertySidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 p-6">
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-foreground mb-4">Bid Not Found</h1>
                <p className="text-muted-foreground mb-6">The requested bid could not be found.</p>
                <Button onClick={handleBackToBids}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Bids List
                </Button>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <PropertySidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6 space-y-6">
            {/* Draft Design Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                  DRAFT DESIGN
                </Badge>
                <span className="text-amber-700 text-sm font-medium">
                  This bid details page is currently in draft mode
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleBackToBids}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Bids
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-foreground">Bid Details #{bid.id}</h1>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(getBidStatus(bid))}>
                      {getBidStatus(bid)}
                    </Badge>
                    {getBidStatus(bid) === "Completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          localStorage.setItem('openJobId', bid.id);
                          navigate('/property/jobs');
                        }}
                        className="flex items-center gap-1"
                      >
                        🔗 View Job
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground mt-1">
                  Generated by {bid.generatedBy} • {bid.companyName}
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {/* Project Dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Project Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Start Date</h4>
                      <p className="text-lg text-muted-foreground">{formatBidDate(bid.startDate)}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">End Date</h4>
                      <p className="text-lg text-muted-foreground">{formatBidDate(bid.endDate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contractors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Contractors ({bid.contractors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bid.contractors.length > 0 ? (
                    <div className="grid gap-4">
                      {bid.contractors.map((contractor, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{contractor.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{contractor.email}</span>
                            </div>
                          </div>
                          {contractor.company && (
                            <Badge variant="secondary">{contractor.company}</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No contractors selected for this bid
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Job Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Job Types ({bid.jobCategories.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bid.jobCategories.length > 0 ? (
                    <div className="grid gap-4">
                      {bid.jobCategories.map((category, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h4 className="font-semibold text-foreground mb-2">{category.name}</h4>
                          {category.description && (
                            <p className="text-muted-foreground mb-3">{category.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Category {index + 1}</Badge>
                            {category.priority && (
                              <Badge variant="secondary">Priority: {category.priority}</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No job categories defined for this bid
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Scope Type</h4>
                      <p className="text-muted-foreground">{bid.scopeType}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Created</h4>
                      <p className="text-muted-foreground">
                        {formatBidDate(bid.createdAt)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Contact Phone</h4>
                      <p className="text-muted-foreground">{bid.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Contact Email</h4>
                      <p className="text-muted-foreground">{bid.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}