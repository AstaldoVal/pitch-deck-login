import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PropertySidebar } from "@/components/PropertySidebar";
import { AppHeader } from "@/components/AppHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Calendar, Users, DollarSign, FileText, ChevronDown, ChevronRight, MessageCircle, BarChart3, Home, Briefcase, List, Kanban, TrendingUp, Calculator, Clock, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy,
  useSortable 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

interface DraggableJobCardProps {
  job: UnitJob & { unitId: string; unitNumber: string };
}

function DraggableJobCard({ job }: DraggableJobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "On Hold":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`p-3 cursor-grab select-none transition-all duration-200 ${
        isDragging 
          ? 'opacity-50 scale-105 shadow-lg' 
          : 'shadow-md hover:shadow-lg border-2 border-border/50 hover:border-border bg-card'
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm leading-tight">{job.jobName}</h4>
            <p className="text-xs text-muted-foreground">{job.jobNumber}</p>
          </div>
          <Badge className={`text-xs px-2 py-1 ${getStatusColor(job.status)}`} variant="outline">
            {job.status}
          </Badge>
        </div>
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Budget:</span>
            <span className="font-medium">{formatCurrency(job.totalBudget)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Contractor:</span>
            <span className="font-medium truncate max-w-[100px]">{job.contractor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Due:</span>
            <span className="font-medium">{formatDate(job.endDate)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface SwimLaneProps {
  unit: Unit;
  statuses: string[];
  isCollapsed: boolean;
  onToggleCollapse: (unitId: string) => void;
  getJobsByStatusForUnit: (unitId: string) => Record<string, (UnitJob & { unitId: string; unitNumber: string })[]>;
}

function SwimLane({ unit, statuses, isCollapsed, onToggleCollapse, getJobsByStatusForUnit }: SwimLaneProps) {
  const jobsByStatus = getJobsByStatusForUnit(unit.id);

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* Swim Lane Header */}
      <div className="bg-muted/50 border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleCollapse(unit.id)}
              className="h-6 w-6 p-0"
            >
              <ChevronRight className={`h-3 w-3 transition-transform ${!isCollapsed ? 'rotate-90' : ''}`} />
            </Button>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Unit {unit.unitNumber}</h3>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{unit.floorPlan}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs h-5">
              {unit.jobs.length} jobs
            </Badge>
            <div className="text-xs text-muted-foreground">
              {unit.percentComplete}% complete
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {!isCollapsed && (
        <div className="grid grid-cols-4 gap-0 min-h-[200px]">
          {statuses.map((status) => (
            <DroppableColumn 
              key={`${unit.id}-${status}`}
              status={status}
              unitId={unit.id}
              jobs={jobsByStatus[status] || []}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DroppableColumnProps {
  status: string;
  unitId: string;
  jobs: (UnitJob & { unitId: string; unitNumber: string })[];
}

function DroppableColumn({ status, unitId, jobs }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${unitId}-${status}`,
  });

  return (
    <div className="border-r last:border-r-0 border-border">
      <div className="bg-muted/30 p-2 border-b border-border/30">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-foreground">{status}</h4>
          <Badge variant="secondary" className="text-xs h-5">
            {jobs.length}
          </Badge>
        </div>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`p-2 min-h-[150px] transition-all duration-200 ${
          isOver ? 'bg-primary/10 border-2 border-dashed border-primary' : 'bg-background'
        }`}
      >
        {isOver && (
          <div className="border-2 border-dashed border-primary rounded-lg bg-primary/5 h-16 flex items-center justify-center mb-2">
            <div className="text-primary font-medium text-xs">Drop here</div>
          </div>
        )}
        <SortableContext items={jobs.map(job => job.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {jobs.map(job => (
              <DraggableJobCard
                key={job.id}
                job={job}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default function PropertyProjectDetail() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState<BidData | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [collapsedUnits, setCollapsedUnits] = useState<Set<string>>(new Set());
  const [activeJob, setActiveJob] = useState<(UnitJob & { unitId: string; unitNumber: string }) | null>(null);
  const [jobPositions, setJobPositions] = useState<Record<string, (UnitJob & { unitId: string; unitNumber: string })[]>>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    // Load specific project from localStorage
    const savedBids = JSON.parse(localStorage.getItem('propertyBids') || '[]');
    const foundProject = savedBids.find((bid: BidData) => bid.id === projectId && bid.status === 'accepted');
    if (foundProject) {
      setProject({
        ...foundProject,
        unitsIncluded: mockUnits // In real app, this would be filtered by the bid
      });
    }
  }, [projectId]);

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

  const getAllJobs = () => {
    if (!project?.unitsIncluded) return [];
    const allJobs: (UnitJob & { unitId: string; unitNumber: string })[] = [];
    project.unitsIncluded.forEach(unit => {
      unit.jobs.forEach(job => {
        allJobs.push({
          ...job,
          unitId: unit.id,
          unitNumber: unit.unitNumber
        });
      });
    });
    return allJobs;
  };

  const getJobsByStatus = () => {
    const allJobs = getAllJobs();
    const statuses = ['Not Started', 'In Progress', 'Completed', 'On Hold'];
    const jobsByStatus: Record<string, (UnitJob & { unitId: string; unitNumber: string })[]> = {};
    
    statuses.forEach(status => {
      jobsByStatus[status] = allJobs.filter(job => job.status === status);
    });
    
    return jobsByStatus;
  };

  const toggleUnitCollapse = (unitId: string) => {
    const newCollapsed = new Set(collapsedUnits);
    if (newCollapsed.has(unitId)) {
      newCollapsed.delete(unitId);
    } else {
      newCollapsed.add(unitId);
    }
    setCollapsedUnits(newCollapsed);
  };

  useEffect(() => {
    if (project?.unitsIncluded) {
      const initialPositions = getJobsByStatus();
      setJobPositions(initialPositions);
    }
  }, [project]);

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event);
    const { active } = event;
    const job = getAllJobs().find(j => j.id === active.id);
    console.log('Active job:', job);
    setActiveJob(job || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic for visual feedback
  };

  const getJobsByStatusForUnit = (unitId: string) => {
    const unit = project?.unitsIncluded?.find(u => u.id === unitId);
    if (!unit) return {};
    
    const statuses = ['Not Started', 'In Progress', 'Completed', 'On Hold'];
    const jobsByStatus: Record<string, (UnitJob & { unitId: string; unitNumber: string })[]> = {};
    
    statuses.forEach(status => {
      jobsByStatus[status] = unit.jobs
        .filter(job => job.status === status)
        .map(job => ({
          ...job,
          unitId: unit.id,
          unitNumber: unit.unitNumber
        }));
    });
    
    return jobsByStatus;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveJob(null);
      return;
    }

    const activeJobId = active.id as string;
    const overId = over.id as string;

    // Find the job being dragged
    const allJobs = getAllJobs();
    const activeJob = allJobs.find(job => job.id === activeJobId);
    
    if (!activeJob) {
      setActiveJob(null);
      return;
    }

    // Parse overId to get unitId and status (format: "unitId-status")
    let targetStatus: string;
    let targetUnitId: string | null = null;
    
    if (overId.includes('-')) {
      const parts = overId.split('-');
      if (parts.length >= 2) {
        targetUnitId = parts[0];
        targetStatus = parts.slice(1).join('-'); // In case status has hyphens
      } else {
        targetStatus = activeJob.status;
      }
    } else {
      targetStatus = activeJob.status;
    }

    // Update job status in mock data and project state
    if (targetStatus !== activeJob.status) {
      setProject(prev => {
        if (!prev?.unitsIncluded) return prev;
        
        const updatedUnits = prev.unitsIncluded.map(unit => ({
          ...unit,
          jobs: unit.jobs.map(job => 
            job.id === activeJobId 
              ? { ...job, status: targetStatus as any }
              : job
          )
        }));
        
        return {
          ...prev,
          unitsIncluded: updatedUnits
        };
      });
    }

    setActiveJob(null);
  };

  const KanbanView = () => {
    const statuses = ['Not Started', 'In Progress', 'Completed', 'On Hold'];
    const units = project?.unitsIncluded || [];

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4">
          {/* Status Headers */}
          <div className="grid grid-cols-4 gap-0 bg-card border rounded-lg p-4">
            {statuses.map(status => (
              <div key={status} className="text-center border-r last:border-r-0 border-border/30">
                <h3 className="font-semibold text-lg text-foreground">{status}</h3>
              </div>
            ))}
          </div>

          {/* Swim Lanes for each Unit */}
          {units.map(unit => (
            <SwimLane
              key={unit.id}
              unit={unit}
              statuses={statuses}
              isCollapsed={collapsedUnits.has(unit.id)}
              onToggleCollapse={toggleUnitCollapse}
              getJobsByStatusForUnit={getJobsByStatusForUnit}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeJob && (
            <DraggableJobCard
              job={activeJob}
            />
          )}
        </DragOverlay>
      </DndContext>
    );
  };

  if (!project) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <PropertySidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 p-6 space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground">Project Not Found</h1>
                <p className="text-muted-foreground mt-2">The requested project could not be found.</p>
                <Button onClick={() => navigate('/property/projects')} className="mt-4">
                  Back to Projects
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
            <div className="flex items-center justify-between">
              <div>
                <Button variant="outline" onClick={() => navigate('/property/projects')} className="mb-4">
                  ← Back to Projects
                </Button>
                <h1 className="text-3xl font-bold text-foreground">Project #{project.id}</h1>
                <p className="text-muted-foreground mt-1">
                  {project.property?.name || 'Property Name'} • {project.companyName}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Generated from Bid #{project.id} – 
                  <button className="underline ml-1 hover:text-blue-800" onClick={() => navigate(`/property/bid/${project.id}`)}>
                    View Bid
                  </button>
                </p>
              </div>
              
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'list' | 'kanban')}>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                  <span className="ml-2">List</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="kanban" aria-label="Kanban view">
                  <Kanban className="h-4 w-4" />
                  <span className="ml-2">Kanban</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <Tabs defaultValue="units" className="w-full">
              <TabsList className="w-auto">
                <TabsTrigger value="units">Units</TabsTrigger>
                <TabsTrigger value="impact">Project Impact Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="units" className="space-y-6">
                {viewMode === 'kanban' ? (
              <KanbanView />
            ) : (
              /* ListView - Unit Listings with Tabs - Full Width */
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Units ({project.unitsIncluded?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 border-b-2">
                          <TableHead className="font-bold text-foreground text-sm">Unit</TableHead>
                          <TableHead className="font-bold text-foreground text-sm">Floor Plan</TableHead>
                          <TableHead className="font-bold text-foreground text-sm">Status</TableHead>
                          <TableHead className="text-right font-bold text-foreground text-sm">Budget</TableHead>
                          <TableHead className="text-right font-bold text-foreground text-sm">Invoiced</TableHead>
                          <TableHead className="text-right font-bold text-foreground text-sm">% Complete</TableHead>
                          <TableHead className="text-right font-bold text-foreground text-sm">Pre-Rent</TableHead>
                          <TableHead className="text-right font-bold text-foreground text-sm">Post-Rent</TableHead>
                          <TableHead className="font-bold text-foreground text-sm"></TableHead>
                        </TableRow>
                      </TableHeader>
                    <TableBody>
                      {project.unitsIncluded?.map(unit => {
                        const { dollarAmount, percentage } = calculateRenovationPremium(unit.preRenovationRent, unit.postRenovationRent);
                        return (
                          <React.Fragment key={unit.id}>
                            <TableRow>
                              <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                              <TableCell>{unit.floorPlan}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(unit.status)}>
                                  {unit.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">{formatCurrency(unit.totalBudget)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(unit.totalInvoiced)}</TableCell>
                              <TableCell className="text-right">{unit.percentComplete}%</TableCell>
                              <TableCell className="text-right">{formatCurrency(unit.preRenovationRent)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(unit.postRenovationRent)}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => toggleUnitExpansion(unit.id)}>
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={9} className="p-0">
                                <Collapsible className="w-full" open={expandedUnits.has(unit.id)}>
                                   <CollapsibleContent className="border-t bg-muted/20 p-6 m-4 rounded-lg">
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                       <Card className="border-l-4 border-l-primary shadow-sm">
                                         <CardContent className="p-4">
                                           <div className="flex items-center gap-2 mb-2">
                                             <TrendingUp className="h-4 w-4 text-primary" />
                                             <h4 className="text-sm font-semibold text-foreground">Renovation Impact</h4>
                                           </div>
                                           <p className="text-muted-foreground text-sm">
                                             Rent Increase: <span className="font-medium text-green-600">{formatCurrency(dollarAmount)} ({percentage.toFixed(0)}%)</span>
                                           </p>
                                         </CardContent>
                                       </Card>
                                       <Card className="border-l-4 border-l-secondary shadow-sm">
                                         <CardContent className="p-4">
                                           <div className="flex items-center gap-2 mb-2">
                                             <Calculator className="h-4 w-4 text-secondary" />
                                             <h4 className="text-sm font-semibold text-foreground">Budget vs. Actual</h4>
                                           </div>
                                           {(() => {
                                             const { dollarAmount: overUnderAmount, percentage: overUnderPercentage } = calculateOverUnder(unit.totalBudget, unit.totalInvoiced);
                                             const isOverBudget = overUnderAmount > 0;
                                             const textColorClass = isOverBudget ? "text-red-600" : "text-green-600";
                                             return (
                                               <p className={`text-sm ${textColorClass} font-medium`}>
                                                 {isOverBudget ? "Over Budget" : "Under Budget"}: {formatCurrency(overUnderAmount)} ({overUnderPercentage.toFixed(0)}%)
                                               </p>
                                             );
                                           })()}
                                         </CardContent>
                                       </Card>
                                     </div>
                                     <div className="border-t pt-6">
                                       <div className="flex items-center gap-2 mb-4">
                                         <Briefcase className="h-4 w-4 text-muted-foreground" />
                                         <h4 className="text-base font-semibold text-foreground">Jobs</h4>
                                       </div>
                                     <Card className="shadow-sm">
                                       <CardContent className="p-0">
                                         <Table>
                                           <TableHeader>
                                             <TableRow className="bg-muted/30">
                                               <TableHead className="font-semibold text-foreground">Job #</TableHead>
                                               <TableHead className="font-semibold text-foreground">Job Name</TableHead>
                                               <TableHead className="font-semibold text-foreground">Status</TableHead>
                                               <TableHead className="font-semibold text-foreground">Contractor</TableHead>
                                               <TableHead className="text-right font-semibold text-foreground">Budget</TableHead>
                                               <TableHead className="text-right font-semibold text-foreground">Invoiced</TableHead>
                                             </TableRow>
                                           </TableHeader>
                                      <TableBody>
                                        {unit.jobs.map(job => (
                                          <TableRow key={job.id}>
                                            <TableCell className="font-medium">{job.jobNumber}</TableCell>
                                            <TableCell>{job.jobName}</TableCell>
                                            <TableCell>
                                              <Badge className={getStatusColor(job.status)}>
                                                {job.status}
                                              </Badge>
                                            </TableCell>
                                            <TableCell>{job.contractor}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(job.totalBudget)}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(job.totalInvoiced)}</TableCell>
                                          </TableRow>
                                        ))}
                                         </TableBody>
                                       </Table>
                                       </CardContent>
                                     </Card>
                              </div>
                            </CollapsibleContent>
                           </Collapsible>
                          </TableCell>
                         </TableRow>
                       </React.Fragment>
                     );
                   })}
                 </TableBody>
               </Table>
             </div>
           </CardContent>
         </Card>
       )}
     </TabsContent>

     <TabsContent value="impact" className="space-y-6">
       <div className="space-y-6">
         {/* Impact Metrics Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="border-l-4 border-l-red-500">
             <CardHeader className="pb-3">
               <CardTitle className="flex items-center gap-2 text-sm">
                 <div className="p-2 rounded-lg bg-red-100">
                   <DollarSign className="h-4 w-4 text-red-600" />
                 </div>
                 Cost Impact
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-2">
                 <p className="text-2xl font-bold text-red-600">+$8,000</p>
                 <p className="text-sm text-muted-foreground">12% over original budget</p>
                 <div className="text-xs text-muted-foreground">
                   <p>Original Budget: $65,000</p>
                   <p>Current Projection: $73,000</p>
                 </div>
               </div>
             </CardContent>
           </Card>

           <Card className="border-l-4 border-l-orange-500">
             <CardHeader className="pb-3">
               <CardTitle className="flex items-center gap-2 text-sm">
                 <div className="p-2 rounded-lg bg-orange-100">
                   <Clock className="h-4 w-4 text-orange-600" />
                 </div>
                 Schedule Impact
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-2">
                 <p className="text-2xl font-bold text-orange-600">+4 days</p>
                 <p className="text-sm text-muted-foreground">8% delay from original timeline</p>
                 <div className="text-xs text-muted-foreground">
                   <p>Original End: Feb 15, 2024</p>
                   <p>New Projection: Feb 19, 2024</p>
                 </div>
               </div>
             </CardContent>
           </Card>

           <Card className="border-l-4 border-l-amber-500">
             <CardHeader className="pb-3">
               <CardTitle className="flex items-center gap-2 text-sm">
                 <div className="p-2 rounded-lg bg-amber-100">
                   <TrendingDown className="h-4 w-4 text-amber-600" />
                 </div>
                 Quality Impact
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-2">
                 <p className="text-2xl font-bold text-amber-600">Medium Risk</p>
                 <p className="text-sm text-muted-foreground">Scope changes affecting quality</p>
                 <div className="text-xs text-muted-foreground">
                   <p>Material substitutions: 2</p>
                   <p>Process modifications: 1</p>
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>

          {/* Active Change Orders */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-4 w-4" />
                Active Change Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-1">
                  <button
                    onClick={() => navigate('/property/change-orders/CO-001')}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline text-sm"
                  >
                    CO-001: Kitchen Upgrade
                  </button>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                    +$5,200
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Upgrade from standard to premium finishes</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Impact: +3 days • Status: Approved</span>
                  <span>Jan 20 → Jan 22, 2024</span>
                </div>
              </div>

              <div className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-1">
                  <button
                    onClick={() => navigate('/property/change-orders/CO-002')}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline text-sm"
                  >
                    CO-002: Flooring Upgrade
                  </button>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                    +$2,800
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Switch from vinyl to hardwood flooring</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Impact: +1 day • Status: Approved</span>
                  <span>Jan 25 → Jan 26, 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

         {/* Project Timeline Impact */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Calendar className="h-5 w-5" />
                 Timeline Impact Analysis
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 <div className="border-l-4 border-l-blue-500 pl-4">
                   <h4 className="font-semibold text-sm">Critical Path Changes</h4>
                   <p className="text-sm text-muted-foreground">Kitchen renovation extended due to CO-001</p>
                   <p className="text-xs text-blue-600">+3 days to overall timeline</p>
                 </div>
                 <div className="border-l-4 border-l-green-500 pl-4">
                   <h4 className="font-semibold text-sm">Resource Optimization</h4>
                   <p className="text-sm text-muted-foreground">Bathroom work can proceed in parallel</p>
                   <p className="text-xs text-green-600">No additional delay</p>
                 </div>
                 <div className="border-l-4 border-l-orange-500 pl-4">
                   <h4 className="font-semibold text-sm">Dependency Impact</h4>
                   <p className="text-sm text-muted-foreground">Flooring work dependent on kitchen completion</p>
                   <p className="text-xs text-orange-600">+1 day buffer required</p>
                 </div>
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Calculator className="h-5 w-5" />
                 Contract Value Analysis
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                     <p className="text-muted-foreground">Original Contract</p>
                     <p className="font-semibold text-lg">$65,000</p>
                   </div>
                   <div>
                     <p className="text-muted-foreground">Change Orders</p>
                     <p className="font-semibold text-lg text-red-600">+$8,000</p>
                   </div>
                   <div>
                     <p className="text-muted-foreground">Revised Total</p>
                     <p className="font-semibold text-lg">$73,000</p>
                   </div>
                   <div>
                     <p className="text-muted-foreground">% Increase</p>
                     <p className="font-semibold text-lg text-red-600">+12.3%</p>
                   </div>
                 </div>
                 <div className="pt-4 border-t">
                   <h4 className="font-semibold text-sm mb-2">Budget Breakdown</h4>
                   <div className="space-y-2 text-xs">
                     <div className="flex justify-between">
                       <span>Labor Costs</span>
                       <span>$45,000 (+$3,200)</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Materials</span>
                       <span>$23,000 (+$4,800)</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Equipment</span>
                       <span>$5,000 (+$0)</span>
                     </div>
                   </div>
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>
       </div>
     </TabsContent>
   </Tabs>
 </main>
</div>
</div>
</SidebarProvider>
);
}