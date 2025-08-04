import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PropertySidebar } from "@/components/PropertySidebar";
import { AppHeader } from "@/components/AppHeader";
import { Building, Calendar, Users, DollarSign, FileText, ChevronDown, ChevronRight, MessageCircle, BarChart3, Home, Briefcase, List, Kanban, GripVertical } from "lucide-react";
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
  unit?: Unit;
  isUnitCollapsed: boolean;
  onToggleCollapse: (unitId: string) => void;
}

function DraggableJobCard({ job, unit, isUnitCollapsed, onToggleCollapse }: DraggableJobCardProps) {
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

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`p-4 transition-all duration-200 border-2 ${
        isDragging 
          ? 'opacity-50 scale-105 border-primary shadow-lg z-50' 
          : 'border-transparent hover:border-border hover:shadow-md'
      } cursor-grab active:cursor-grabbing bg-background`}
      {...attributes}
      {...listeners}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <div>
                <h4 className="font-medium text-sm">{job.jobName}</h4>
                <p className="text-xs text-muted-foreground">{job.jobNumber}</p>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(job.status)} variant="secondary">
            {job.status}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Unit:</span>
            <div className="flex items-center gap-1">
              <span className="font-medium">{job.unitNumber}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCollapse(job.unitId);
                }}
              >
                <ChevronDown className={`h-3 w-3 transition-transform ${isUnitCollapsed ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
          
          {!isUnitCollapsed && unit && (
            <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 p-2 rounded">
              <div className="flex justify-between">
                <span>Floor Plan:</span>
                <span>{unit.floorPlan}</span>
              </div>
              <div className="flex justify-between">
                <span>Budget:</span>
                <span>{formatCurrency(job.totalBudget)}</span>
              </div>
              <div className="flex justify-between">
                <span>Contractor:</span>
                <span className="truncate max-w-[80px]">{job.contractor}</span>
              </div>
              <div className="flex justify-between">
                <span>End Date:</span>
                <span>{formatDate(job.endDate)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

interface DroppableColumnProps {
  status: string;
  jobs: (UnitJob & { unitId: string; unitNumber: string })[];
  units: Unit[];
  collapsedUnits: Set<string>;
  onToggleCollapse: (unitId: string) => void;
}

function DroppableColumn({ status, jobs, units, collapsedUnits, onToggleCollapse }: DroppableColumnProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-card border rounded-t-lg p-4 border-b-2 border-primary/20">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-foreground">{status}</h3>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {jobs.length}
          </Badge>
        </div>
      </div>
      
      <div className="flex-1 bg-muted/30 border border-t-0 rounded-b-lg p-4 min-h-[400px]">
        <SortableContext items={jobs.map(job => job.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {jobs.map(job => {
              const unit = units.find(u => u.id === job.unitId);
              const isUnitCollapsed = collapsedUnits.has(job.unitId);
              
              return (
                <DraggableJobCard
                  key={job.id}
                  job={job}
                  unit={unit}
                  isUnitCollapsed={isUnitCollapsed}
                  onToggleCollapse={onToggleCollapse}
                />
              );
            })}
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
    const { active } = event;
    const job = getAllJobs().find(j => j.id === active.id);
    setActiveJob(job || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic for visual feedback
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

    // Determine target status - could be a status column or another job
    let targetStatus: string;
    const statusColumns = ['Not Started', 'In Progress', 'Completed', 'On Hold'];
    
    if (statusColumns.includes(overId)) {
      targetStatus = overId;
    } else {
      // Find the status of the job we're dropping over
      const targetJob = allJobs.find(job => job.id === overId);
      targetStatus = targetJob?.status || activeJob.status;
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
    const jobsByStatus = getJobsByStatus();
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
        <div className="grid grid-cols-4 gap-6 h-full">
          {statuses.map(status => (
            <DroppableColumn
              key={status}
              status={status}
              jobs={jobsByStatus[status]}
              units={units}
              collapsedUnits={collapsedUnits}
              onToggleCollapse={toggleUnitCollapse}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeJob && (
            <DraggableJobCard
              job={activeJob}
              unit={units.find(u => u.id === activeJob.unitId)}
              isUnitCollapsed={collapsedUnits.has(activeJob.unitId)}
              onToggleCollapse={toggleUnitCollapse}
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Unit</TableHead>
                        <TableHead>Floor Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Budget</TableHead>
                        <TableHead className="text-right">Invoiced</TableHead>
                        <TableHead className="text-right">% Complete</TableHead>
                        <TableHead className="text-right">Pre-Rent</TableHead>
                        <TableHead className="text-right">Post-Rent</TableHead>
                        <TableHead></TableHead>
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
                                  <CollapsibleContent className="pl-8 pb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-semibold">Renovation Impact</h4>
                                        <p className="text-muted-foreground text-sm">
                                          Rent Increase: {formatCurrency(dollarAmount)} ({percentage.toFixed(0)}%)
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-semibold">Budget vs. Actual</h4>
                                        {(() => {
                                          const { dollarAmount: overUnderAmount, percentage: overUnderPercentage } = calculateOverUnder(unit.totalBudget, unit.totalInvoiced);
                                          const isOverBudget = overUnderAmount > 0;
                                          const textColorClass = isOverBudget ? "text-red-500" : "text-green-500";
                                          return (
                                            <p className={`text-sm text-muted-foreground ${textColorClass}`}>
                                              {isOverBudget ? "Over Budget" : "Under Budget"}: {formatCurrency(overUnderAmount)} ({overUnderPercentage.toFixed(0)}%)
                                            </p>
                                          );
                                        })()}
                                      </div>
                                    </div>
                                    <h4 className="text-sm font-semibold mt-4">Jobs</h4>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Job #</TableHead>
                                          <TableHead>Job Name</TableHead>
                                          <TableHead>Status</TableHead>
                                          <TableHead>Contractor</TableHead>
                                          <TableHead className="text-right">Budget</TableHead>
                                          <TableHead className="text-right">Invoiced</TableHead>
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
                                  </CollapsibleContent>
                                </Collapsible>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}