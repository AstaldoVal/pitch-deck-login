import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PropertySidebar } from "@/components/PropertySidebar";
import { AppHeader } from "@/components/AppHeader";
import { PropertyComments } from "@/components/PropertyComments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Calendar, 
  Users, 
  DollarSign, 
  FileText,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  BarChart3,
  Home,
  Briefcase
} from "lucide-react";
import { format } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  totalBudget?: number;
  status?: 'accepted' | 'pending' | 'rejected';
  unitsIncluded?: Unit[];
  notes?: string;
}

interface Unit {
  id: string;
  unitNumber: string;
  floorPlan: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  totalBid: number;
  totalBudget: number;
  totalInvoiced: number;
  percentComplete: number;
  preRenovationRent: number;
  postRenovationRent: number;
  jobs: UnitJob[];
}

interface UnitJob {
  id: string;
  jobNumber: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  jobName: string;
  startDate: Date;
  endDate: Date;
  contractor: string;
  totalBudget: number;
  totalBid: number;
  totalInvoiced: number;
}

// Mock data for demonstration
const mockUnits: Unit[] = [
  {
    id: "unit-1",
    unitNumber: "101",
    floorPlan: "1 BR / 1 BA",
    status: "In Progress",
    totalBid: 15000,
    totalBudget: 14500,
    totalInvoiced: 8000,
    percentComplete: 60,
    preRenovationRent: 1200,
    postRenovationRent: 1450,
    jobs: [
      {
        id: "job-1",
        jobNumber: "J-001",
        status: "Completed",
        jobName: "Kitchen Renovation",
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-01'),
        contractor: "ABC Construction",
        totalBudget: 8000,
        totalBid: 8200,
        totalInvoiced: 8000,
      },
      {
        id: "job-2",
        jobNumber: "J-002", 
        status: "In Progress",
        jobName: "Bathroom Renovation",
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-15'),
        contractor: "XYZ Contractors",
        totalBudget: 6500,
        totalBid: 6800,
        totalInvoiced: 0,
      }
    ]
  },
  {
    id: "unit-2",
    unitNumber: "102",
    floorPlan: "2 BR / 2 BA",
    status: "Not Started",
    totalBid: 25000,
    totalBudget: 24000,
    totalInvoiced: 0,
    percentComplete: 0,
    preRenovationRent: 1800,
    postRenovationRent: 2200,
    jobs: []
  }
];

export default function PropertyJobs() {
  const [jobs, setJobs] = useState<BidData[]>([]);
  const [selectedJob, setSelectedJob] = useState<BidData | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    // Load accepted bids as jobs from localStorage
    const savedBids = JSON.parse(localStorage.getItem('propertyBids') || '[]');
    const acceptedJobs = savedBids
      .filter((bid: BidData) => bid.status === 'accepted')
      .map((bid: BidData) => ({
        ...bid,
        unitsIncluded: mockUnits, // In real app, this would be filtered by the bid
      }));
    setJobs(acceptedJobs);
  }, []);

  const createTestData = () => {
    const testBids: BidData[] = [
      {
        id: "BID-001",
        generatedBy: "John Smith",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        companyName: "Premier Construction LLC",
        property: { name: "Sunset Apartments" },
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-03-30'),
        scopeType: "Unit-based",
        jobCategories: [
          { name: "Kitchen Renovation" },
          { name: "Bathroom Renovation" },
          { name: "Flooring" }
        ],
        contractors: [
          { 
            firstName: "Mike", 
            lastName: "Johnson", 
            email: "mike@contractors.com",
            hasSubmitted: true
          }
        ],
        createdAt: new Date().toISOString(),
        totalBudget: 40000,
        status: 'accepted' as const,
        unitsIncluded: mockUnits,
        notes: "Complete renovation of units 101-102 including kitchen, bathroom, and flooring updates to modernize the property and increase rental value."
      },
      {
        id: "BID-002", 
        generatedBy: "Sarah Davis",
        email: "sarah@example.com",
        phone: "+1 (555) 987-6543",
        companyName: "Elite Renovations Inc",
        property: { name: "Sunset Apartments" },
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-04-15'),
        scopeType: "Job-type",
        jobCategories: [
          { name: "HVAC Systems" },
          { name: "Electrical Work" }
        ],
        contractors: [
          {
            firstName: "Tom",
            lastName: "Wilson", 
            email: "tom@elite.com",
            hasSubmitted: true
          }
        ],
        createdAt: new Date().toISOString(),
        totalBudget: 25000,
        status: 'accepted' as const,
        unitsIncluded: mockUnits.slice(0, 1), // Only first unit
        notes: "HVAC and electrical system upgrades for improved efficiency and code compliance."
      }
    ];

    // Save test bids to localStorage
    localStorage.setItem('propertyBids', JSON.stringify(testBids));
    
    // Update jobs state
    setJobs(testBids);
  };

  const getDaysToComplete = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getJobStatus = (job: BidData) => {
    const now = new Date();
    const start = new Date(job.startDate);
    const end = new Date(job.endDate);
    
    if (now < start) return "Not Started";
    if (now >= start && now <= end) return "In Progress";
    return "Completed";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started": return "bg-yellow-100 text-yellow-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "On Hold": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const toggleUnitExpansion = (unitId: string) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  const calculateRenovationPremium = (preRent: number, postRent: number) => {
    const dollarAmount = postRent - preRent;
    const percentage = ((dollarAmount / preRent) * 100);
    return { dollarAmount, percentage };
  };

  const calculateOverUnder = (budget: number, invoiced: number) => {
    const dollarAmount = invoiced - budget;
    const percentage = budget > 0 ? ((dollarAmount / budget) * 100) : 0;
    return { dollarAmount, percentage };
  };

  if (jobs.length === 0) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <PropertySidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Jobs</h1>
                <p className="text-muted-foreground mt-1">
                  Track and manage active renovation jobs
                </p>
              </div>
              
              <Card className="p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No active jobs</h3>
                <p className="text-muted-foreground mb-4">
                  Jobs will appear here when renovation bids are accepted
                </p>
                <Button onClick={createTestData} variant="outline">
                  Create Test Data (Demo)
                </Button>
              </Card>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (selectedJob) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <PropertySidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedJob(null)}
                    className="mb-4"
                  >
                    ← Back to Jobs
                  </Button>
                  <h1 className="text-3xl font-bold text-foreground">Job #{selectedJob.id}</h1>
                  <p className="text-muted-foreground mt-1">
                    {selectedJob.property?.name || 'Property Name'} • {selectedJob.companyName}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {showComments ? 'Hide' : 'Show'} Comments
                </Button>
              </div>

              {/* Unit Listings with Tabs - Full Width */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Units ({selectedJob.unitsIncluded?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="interior" className="w-full">
                    <div className="px-6 pb-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="interior">Interior</TabsTrigger>
                        <TabsTrigger value="exterior">Exterior</TabsTrigger>
                        <TabsTrigger value="general">General</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="interior" className="mt-0 w-full overflow-x-auto">
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead></TableHead>
                            <TableHead>Unit #</TableHead>
                            <TableHead>Floor Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total Bid</TableHead>
                            <TableHead>Total Budget</TableHead>
                            <TableHead>Total Invoiced</TableHead>
                            <TableHead>% Complete</TableHead>
                            <TableHead>Pre-Reno Rent</TableHead>
                            <TableHead>Post-Reno Rent</TableHead>
                            <TableHead>Premium ($)</TableHead>
                            <TableHead>Premium (%)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedJob.unitsIncluded?.map((unit) => {
                            const premium = calculateRenovationPremium(unit.preRenovationRent, unit.postRenovationRent);
                            return (
                              <>
                                <TableRow key={unit.id} className="cursor-pointer hover:bg-muted/50">
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleUnitExpansion(unit.id)}
                                      className="p-0 h-auto"
                                    >
                                      {expandedUnits.has(unit.id) ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TableCell>
                                  <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                                  <TableCell>{unit.floorPlan}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(unit.status)}>
                                      {unit.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{formatCurrency(unit.totalBid)}</TableCell>
                                  <TableCell>{formatCurrency(unit.totalBudget)}</TableCell>
                                  <TableCell>{formatCurrency(unit.totalInvoiced)}</TableCell>
                                  <TableCell>{unit.percentComplete}%</TableCell>
                                  <TableCell>{formatCurrency(unit.preRenovationRent)}</TableCell>
                                  <TableCell>{formatCurrency(unit.postRenovationRent)}</TableCell>
                                  <TableCell className="text-green-600">
                                    {formatCurrency(premium.dollarAmount)}
                                  </TableCell>
                                  <TableCell className="text-green-600">
                                    {premium.percentage.toFixed(1)}%
                                  </TableCell>
                                </TableRow>
                                
                                {/* Expanded unit jobs */}
                                {expandedUnits.has(unit.id) && unit.jobs.map((job) => {
                                  const overUnder = calculateOverUnder(job.totalBudget, job.totalInvoiced);
                                  return (
                                    <TableRow key={job.id} className="bg-muted/30">
                                      <TableCell></TableCell>
                                      <TableCell className="pl-8 text-sm text-muted-foreground">
                                        {job.jobNumber}
                                      </TableCell>
                                      <TableCell className="text-sm">{job.jobName}</TableCell>
                                      <TableCell>
                                        <Badge variant="outline" className={getStatusColor(job.status)}>
                                          {job.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-sm">{formatCurrency(job.totalBid)}</TableCell>
                                      <TableCell className="text-sm">{formatCurrency(job.totalBudget)}</TableCell>
                                      <TableCell className="text-sm">{formatCurrency(job.totalInvoiced)}</TableCell>
                                      <TableCell className="text-sm">
                                        {formatDate(job.startDate)} - {formatDate(job.endDate)}
                                      </TableCell>
                                      <TableCell className="text-sm">{job.contractor}</TableCell>
                                      <TableCell className="text-sm">
                                        <span className={overUnder.dollarAmount >= 0 ? 'text-red-600' : 'text-green-600'}>
                                          {overUnder.dollarAmount >= 0 ? '+' : ''}{formatCurrency(overUnder.dollarAmount)}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        <span className={overUnder.percentage >= 0 ? 'text-red-600' : 'text-green-600'}>
                                          {overUnder.percentage >= 0 ? '+' : ''}{overUnder.percentage.toFixed(1)}%
                                        </span>
                                      </TableCell>
                                      <TableCell></TableCell>
                                    </TableRow>
                                  );
                                })}
                              </>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    
                    <TabsContent value="exterior" className="mt-0 w-full overflow-x-auto">
                      <div className="p-6 text-center text-muted-foreground">
                        No exterior units available for this job
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="general" className="mt-0 w-full overflow-x-auto">
                      <div className="p-6 text-center text-muted-foreground">
                        No general units available for this job
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Comments Sidebar */}
              {showComments && (
                <Card className="w-full mt-6">
                  <PropertyComments />
                </Card>
              )}
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
            <div>
              <h1 className="text-3xl font-bold text-foreground">Jobs</h1>
              <p className="text-muted-foreground mt-1">
                Track and manage active renovation jobs
              </p>
            </div>

            <div className="grid gap-6">
              {jobs.map((job) => {
                const status = getJobStatus(job);
                const daysToComplete = getDaysToComplete(job.startDate, job.endDate);
                const totalInvoiced = job.unitsIncluded?.reduce((sum, unit) => sum + unit.totalInvoiced, 0) || 0;
                const totalPaid = totalInvoiced * 0.8; // Mock data: assume 80% of invoiced is paid

                return (
                  <Card 
                    key={job.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">Job #{job.id}</CardTitle>
                          <p className="text-muted-foreground">
                            {job.property?.name || 'Property Name'} • Generated by {job.generatedBy}
                          </p>
                        </div>
                        <Badge className={getStatusColor(status)}>
                          {status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Job Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                          <p className="text-sm font-medium">{job.companyName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Job Start</label>
                          <p className="text-sm font-medium">{formatDate(job.startDate)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Job End</label>
                          <p className="text-sm font-medium">{formatDate(job.endDate)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Days to Complete</label>
                          <p className="text-sm font-medium">{daysToComplete} days</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                          <p className="text-sm font-medium">{formatDate(job.createdAt)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Contractor</label>
                          <p className="text-sm font-medium">
                            {job.contractors.length > 0 ? job.contractors[0].firstName + ' ' + job.contractors[0].lastName : 'Not assigned'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Units Included</label>
                          <p className="text-sm font-medium">{job.unitsIncluded?.length || 0} units</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Job Category</label>
                          <p className="text-sm font-medium">
                            {job.jobCategories.length > 0 ? job.jobCategories[0].name : 'General'}
                          </p>
                        </div>
                      </div>

                      {/* Financial Summary */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-muted/30 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Total Bid Amount</label>
                          <p className="text-lg font-bold text-foreground">
                            {formatCurrency(job.totalBudget || 0)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Total Invoiced</label>
                          <p className="text-lg font-bold text-blue-600">
                            {formatCurrency(totalInvoiced)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Total Budget</label>
                          <p className="text-lg font-bold text-orange-600">
                            {formatCurrency((job.totalBudget || 0) * 0.95)} {/* Mock: Budget is 95% of bid */}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Total Paid</label>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(totalPaid)}
                          </p>
                        </div>
                      </div>

                      {/* Scope of Work */}
                      {job.notes && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Scope of Work</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{job.notes}</p>
                        </div>
                      )}

                      {/* Job Categories */}
                      {job.jobCategories.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Job Categories ({job.jobCategories.length})</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {job.jobCategories.map((category, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}