import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PropertySidebar } from "@/components/PropertySidebar";
import { AppHeader } from "@/components/AppHeader";
import { PropertyComments } from "@/components/PropertyComments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GanttChart, GanttJob } from "@/components/GanttChart";
import { Building, Calendar, Users, DollarSign, FileText, ChevronDown, ChevronRight, MessageCircle, BarChart3, Home, Briefcase } from "lucide-react";
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
const mockUnits: Unit[] = [{
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
  jobs: [{
    id: "job-1",
    jobNumber: "J-001",
    status: "Completed",
    jobName: "Kitchen Renovation",
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-01'),
    contractor: "ABC Construction",
    totalBudget: 8000,
    totalBid: 8200,
    totalInvoiced: 8000
  }, {
    id: "job-2",
    jobNumber: "J-002",
    status: "In Progress",
    jobName: "Bathroom Renovation",
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-15'),
    contractor: "XYZ Contractors",
    totalBudget: 6500,
    totalBid: 6800,
    totalInvoiced: 0
  }]
}, {
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
  jobs: [{
    id: "job-3",
    jobNumber: "J-003",
    status: "Not Started",
    jobName: "Full Kitchen Renovation",
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-20'),
    contractor: "Elite Renovations",
    totalBudget: 12000,
    totalBid: 12500,
    totalInvoiced: 0
  }, {
    id: "job-4",
    jobNumber: "J-004",
    status: "Not Started",
    jobName: "Bathroom Upgrade",
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-04-01'),
    contractor: "Premium Contractors",
    totalBudget: 8000,
    totalBid: 8300,
    totalInvoiced: 0
  }]
}];
export default function PropertyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<BidData[]>([]);
  const [selectedJob, setSelectedJob] = useState<BidData | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  useEffect(() => {
    // Load accepted bids as jobs from localStorage
    const savedBids = JSON.parse(localStorage.getItem('propertyBids') || '[]');
    const acceptedJobs = savedBids.filter((bid: BidData) => bid.status === 'accepted').map((bid: BidData) => ({
      ...bid,
      unitsIncluded: mockUnits // In real app, this would be filtered by the bid
    }));
    setJobs(acceptedJobs);

    // Check if we need to open a specific job
    const openJobId = localStorage.getItem('openJobId');
    if (openJobId && acceptedJobs.length > 0) {
      const jobToOpen = acceptedJobs.find(job => job.id === openJobId);
      if (jobToOpen) {
        setSelectedJob(jobToOpen);
      }
      localStorage.removeItem('openJobId'); // Clean up
    }
  }, []);
  const createTestData = () => {
    const testBids: BidData[] = [{
      id: "BID-001",
      generatedBy: "John Smith",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      companyName: "Premier Construction LLC",
      property: {
        name: "Sunset Apartments"
      },
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-03-30'),
      scopeType: "Unit-based",
      jobCategories: [{
        name: "Kitchen Renovation"
      }, {
        name: "Bathroom Renovation"
      }, {
        name: "Flooring"
      }],
      contractors: [{
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike@contractors.com",
        hasSubmitted: true
      }],
      createdAt: new Date().toISOString(),
      totalBudget: 40000,
      status: 'accepted' as const,
      unitsIncluded: mockUnits,
      notes: "Complete renovation of units 101-102 including kitchen, bathroom, and flooring updates to modernize the property and increase rental value."
    }, {
      id: "BID-002",
      generatedBy: "Sarah Davis",
      email: "sarah@example.com",
      phone: "+1 (555) 987-6543",
      companyName: "Elite Renovations Inc",
      property: {
        name: "Sunset Apartments"
      },
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-04-15'),
      scopeType: "Job-type",
      jobCategories: [{
        name: "HVAC Systems"
      }, {
        name: "Electrical Work"
      }],
      contractors: [{
        firstName: "Tom",
        lastName: "Wilson",
        email: "tom@elite.com",
        hasSubmitted: true
      }],
      createdAt: new Date().toISOString(),
      totalBudget: 25000,
      status: 'accepted' as const,
      unitsIncluded: mockUnits.slice(0, 1),
      // Only first unit
      notes: "HVAC and electrical system upgrades for improved efficiency and code compliance."
    }];

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
      case "Not Started":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "On Hold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    const percentage = dollarAmount / preRent * 100;
    return {
      dollarAmount,
      percentage
    };
  };
  const calculateOverUnder = (budget: number, invoiced: number) => {
    const dollarAmount = invoiced - budget;
    const percentage = budget > 0 ? dollarAmount / budget * 100 : 0;
    return {
      dollarAmount,
      percentage
    };
  };

  // Convert job data to Gantt format
  const convertToGanttJobs = (jobs: BidData[]): GanttJob[] => {
    const ganttJobs: GanttJob[] = [];
    jobs.forEach(job => {
      job.unitsIncluded?.forEach(unit => {
        unit.jobs.forEach(unitJob => {
          ganttJobs.push({
            id: unitJob.id,
            jobNumber: unitJob.jobNumber,
            jobName: unitJob.jobName,
            contractor: unitJob.contractor,
            jobType: 'Interior' as const,
            // Default to Interior, could be determined from job categories
            jobCategory: job.jobCategories?.[0]?.name || 'General',
            floorPlan: unit.floorPlan,
            startDate: unitJob.startDate,
            endDate: unitJob.endDate,
            status: unitJob.status === 'On Hold' ? 'Overdue' : unitJob.status,
            unitNumber: unit.unitNumber,
            totalBudget: unitJob.totalBudget
          });
        });
      });
    });
    return ganttJobs;
  };
  if (jobs.length === 0) {
    return <SidebarProvider>
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
      </SidebarProvider>;
  }
  if (selectedJob) {
    return <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <PropertySidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Button variant="outline" onClick={() => setSelectedJob(null)} className="mb-4">
                    ← Back to Jobs
                  </Button>
                  <h1 className="text-3xl font-bold text-foreground">Job #{selectedJob.id}</h1>
                  <p className="text-muted-foreground mt-1">
                    {selectedJob.property?.name || 'Property Name'} • {selectedJob.companyName}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Generated from Bid #{selectedJob.id} – 
                    <button className="underline ml-1 hover:text-blue-800" onClick={() => navigate(`/property/bid/${selectedJob.id}`)}>
                      View Bid
                    </button>
                  </p>
                </div>
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
                          <TabsList className="inline-flex">
                            <TabsTrigger value="interior">Interior</TabsTrigger>
                            <TabsTrigger value="exterior">Exterior</TabsTrigger>
                            <TabsTrigger value="general">General</TabsTrigger>
                          </TabsList>
                        </div>
                        
                        <TabsContent value="interior" className="mt-0 w-full overflow-x-auto" style={{
                    scrollbarWidth: 'thin'
                  }}>
                          <Table className="w-full">
                            <TableHeader>
                              <TableRow>
                                 <TableHead className="w-8"></TableHead>
                                 <TableHead className="min-w-[60px]">Unit</TableHead>
                                 <TableHead className="hidden lg:table-cell min-w-[80px]">Plan</TableHead>
                                 <TableHead className="min-w-[70px]">Status</TableHead>
                                 <TableHead className="hidden xl:table-cell min-w-[80px]">Bid</TableHead>
                                 <TableHead className="min-w-[80px]">Budget</TableHead>
                                 <TableHead className="hidden lg:table-cell min-w-[80px]">PaiChand</TableHead>
                                 <TableHead className="hidden xl:table-cell min-w-[50px]">%</TableHead>
                                 <TableHead className="hidden 2xl:table-cell min-w-[70px]">Pre</TableHead>
                                 <TableHead className="hidden 2xl:table-cell min-w-[70px]">Post</TableHead>
                              </TableRow>
                            </TableHeader>
                        <TableBody>
                          {selectedJob.unitsIncluded?.map(unit => {
                          const premium = calculateRenovationPremium(unit.preRenovationRent, unit.postRenovationRent);
                          return <React.Fragment key={unit.id}>
                                <TableRow className="cursor-pointer hover:bg-muted/50">
                                  <TableCell>
                                    <Button variant="ghost" size="sm" onClick={() => toggleUnitExpansion(unit.id)} className="p-0 h-auto">
                                      {expandedUnits.has(unit.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </Button>
                                  </TableCell>
                                   <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                                   <TableCell className="hidden lg:table-cell">{unit.floorPlan}</TableCell>
                                   <TableCell>
                                     <Badge className={getStatusColor(unit.status)}>
                                       {unit.status}
                                     </Badge>
                                   </TableCell>
                                   <TableCell className="hidden xl:table-cell">{formatCurrency(unit.totalBid)}</TableCell>
                                   <TableCell>{formatCurrency(unit.totalBudget)}</TableCell>
                                   <TableCell className="hidden lg:table-cell">{formatCurrency(unit.totalInvoiced)}</TableCell>
                                   <TableCell className="hidden xl:table-cell">{unit.percentComplete}%</TableCell>
                                   <TableCell className="hidden 2xl:table-cell">{formatCurrency(unit.preRenovationRent)}</TableCell>
                                   <TableCell className="hidden 2xl:table-cell">{formatCurrency(unit.postRenovationRent)}</TableCell>
                                </TableRow>
                                
                                {/* Expanded unit jobs - отдельный блок */}
                                {expandedUnits.has(unit.id) && <TableRow>
                                    <TableCell colSpan={10} className="p-0">
                                      <div className="bg-muted/20 p-4 border-l-4 border-primary/20">
                                        <h4 className="font-medium text-sm mb-3 text-muted-foreground">
                                          Jobs for Unit {unit.unitNumber}
                                        </h4>
                                        <div className="space-y-2">
                                          {unit.jobs.map(job => {
                                      const isPaid = job.totalInvoiced >= job.totalBudget;
                                      return <div key={job.id} className="bg-background rounded-lg p-3 border">
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-sm">
                                                  <div>
                                                    <p className="text-muted-foreground text-xs">Job #</p>
                                                    <p className="font-medium">{job.jobNumber}</p>
                                                  </div>
                                                  <div>
                                                    <p className="text-muted-foreground text-xs">Name</p>
                                                    <p className="font-medium">{job.jobName}</p>
                                                  </div>
                                                  <div>
                                                    <p className="text-muted-foreground text-xs">Status</p>
                                                    <Badge variant="outline" className={getStatusColor(job.status)}>
                                                      {job.status}
                                                    </Badge>
                                                  </div>
                                                  <div>
                                                    <p className="text-muted-foreground text-xs">Budget</p>
                                                    <p className="font-medium">{formatCurrency(job.totalBudget)}</p>
                                                  </div>
                                                  <div>
                                                    <p className="text-muted-foreground text-xs">Payment</p>
                                                    <Badge variant={isPaid ? "default" : "secondary"} className={isPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                                      {isPaid ? "Paid" : "Pending"}
                                                    </Badge>
                                                  </div>
                                                  <div>
                                                    <p className="text-muted-foreground text-xs">Contractor</p>
                                                    <p className="font-medium">{job.contractor}</p>
                                                  </div>
                                                  <div className="col-span-2">
                                                    <p className="text-muted-foreground text-xs">Duration</p>
                                                    <p>{formatDate(job.startDate)} - {formatDate(job.endDate)}</p>
                                                  </div>
                                                </div>
                                              </div>;
                                    })}
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>}
                              </React.Fragment>;
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

            </main>
          </div>
        </div>
      </SidebarProvider>;
  }
  return <SidebarProvider>
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

            <Tabs defaultValue="gantt" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
                <TabsTrigger value="list">Jobs List</TabsTrigger>
              </TabsList>
              
              <TabsContent value="gantt" className="mt-6">
                <GanttChart jobs={convertToGanttJobs(jobs)} />
              </TabsContent>
              
              <TabsContent value="list" className="mt-6">
                  {jobs.map(job => {
                const status = getJobStatus(job);
                const daysToComplete = getDaysToComplete(job.startDate, job.endDate);
                const totalInvoiced = job.unitsIncluded?.reduce((sum, unit) => sum + unit.totalInvoiced, 0) || 0;
                const totalBid = job.unitsIncluded?.reduce((sum, unit) => sum + unit.totalBid, 0) || 0;
                const totalPaid = totalInvoiced * 0.8; // Mock data: assume 80% of invoiced is paid

                return <Collapsible key={job.id}>
                        <Card className="overflow-hidden">
                          {/* Первый уровень - основная информация */}
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-xl">
                                  {job.property?.name || 'Property Name'}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-sm text-muted-foreground">
                                    Bid #{job.id}
                                  </p>
                                  <span className="text-muted-foreground">•</span>
                                  <p className="text-sm text-muted-foreground">
                                    {job.companyName}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(status)}>
                                  {status === "In Progress" ? "In Progress" : status === "Completed" ? "Completed" : "Not Started"}
                                </Badge>
                                <CollapsibleTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <ChevronDown className="h-4 w-4" />
                                    Expand details
                                  </Button>
                                </CollapsibleTrigger>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            {/* Основные метрики - обобщённая информация */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Start Date</p>
                                <p className="text-sm font-medium">{formatDate(job.startDate)}</p>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">End Date</p>
                                <p className="text-sm font-medium">{formatDate(job.endDate)}</p>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Units Included</p>
                                <p className="text-sm font-medium">{job.unitsIncluded?.length || 0} units</p>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Total Bid</p>
                                <p className="text-sm font-medium text-primary">{formatCurrency(totalBid)}</p>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Budget</p>
                                <p className="text-sm font-medium">{formatCurrency(job.totalBudget || 0)}</p>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Paid</p>
                                <p className="text-sm font-medium text-green-600">{formatCurrency(totalPaid)}</p>
                              </div>
                            </div>
                            
                            {/* Job Categories краткий список */}
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">Job Category</p>
                              <div className="flex flex-wrap gap-1">
                                {job.jobCategories?.slice(0, 3).map((category, index) => <Badge key={index} variant="secondary" className="text-xs">
                                    {category.name}
                                  </Badge>)}
                                {job.jobCategories?.length > 3 && <Badge variant="outline" className="text-xs">
                                    +{job.jobCategories.length - 3} more
                                  </Badge>}
                              </div>
                            </div>
                            
                            {/* Кнопки действий - всегда видны */}
                            <div className="flex gap-2 pt-4 justify-end">
                              <Button variant="default" onClick={() => setSelectedJob(job)}>
                                View Full Details
                              </Button>
                              <Button variant="outline" onClick={() => navigate(`/property/bid/${job.id}`)}>
                                View Original Bid
                              </Button>
                            </div>
                            
                            {/* Второй уровень - детальная информация */}
                            <CollapsibleContent className="space-y-6 pt-4 border-t">
                              {/* Scope of Work */}
                              {job.notes && <div className="space-y-2">
                                  <h3 className="font-semibold flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Scope of Work
                                  </h3>
                                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                    {job.notes}
                                  </p>
                                </div>}
                              
                              
                              {/* Контакты */}
                              <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  Contacts
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="bg-muted/50 p-3 rounded-lg">
                                    <p className="text-sm font-medium">Project Manager</p>
                                    <p className="text-sm">{job.generatedBy}</p>
                                    <p className="text-xs text-muted-foreground">{job.email}</p>
                                    <p className="text-xs text-muted-foreground">{job.phone}</p>
                                  </div>
                                  {job.contractors?.map((contractor, index) => <div key={index} className="bg-muted/50 p-3 rounded-lg">
                                      <p className="text-sm font-medium">Contractor</p>
                                      <p className="text-sm">{contractor.firstName} {contractor.lastName}</p>
                                      <p className="text-xs text-muted-foreground">{contractor.email}</p>
                                      <p className="text-xs text-muted-foreground">
                                        Status: {contractor.hasSubmitted ? 'Submitted' : 'Pending'}
                                      </p>
                                    </div>)}
                                </div>
                              </div>
                            </CollapsibleContent>
                          </CardContent>
                        </Card>
                      </Collapsible>;
              })}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>;
}