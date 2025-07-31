import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';

export interface GanttJob extends Record<string, unknown> {
  id: string;
  jobNumber: string;
  jobName: string;
  contractor: string;
  jobType: 'Interior' | 'Exterior' | 'General';
  jobCategory: string;
  floorPlan?: string;
  startDate: Date;
  endDate: Date;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  unitNumber: string;
  totalBudget: number;
}

interface GanttChartProps {
  jobs: GanttJob[];
}

const JobNode = ({ data }: { data: GanttJob }) => {
  const duration = differenceInDays(data.endDate, data.startDate);
  const today = new Date();
  
  let statusColor = 'bg-blue-500';
  let displayText: string = data.status;
  
  // Determine visual status
  if (data.status === 'Completed') {
    if (isBefore(new Date(), data.endDate)) {
      statusColor = 'bg-green-500';
      displayText = 'Completed Early';
    } else {
      statusColor = 'bg-green-600';
      displayText = 'Completed';
    }
  } else if (data.status === 'In Progress') {
    if (isAfter(today, data.endDate)) {
      statusColor = 'bg-red-500';
      displayText = 'Overdue';
    } else {
      statusColor = 'bg-blue-500';
      displayText = 'In Progress';
    }
  } else if (data.status === 'Not Started' && isAfter(today, data.startDate)) {
    statusColor = 'bg-red-500';
    displayText = 'Overdue';
  }

  return (
    <div className="bg-background border rounded-lg p-3 min-w-[280px] shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-sm">{data.jobName}</div>
        <Badge className={`${statusColor} text-white text-xs`}>
          {displayText}
        </Badge>
      </div>
      
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{format(data.startDate, 'MMM dd')} - {format(data.endDate, 'MMM dd')}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{duration} days</span>
        </div>
        
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{data.contractor}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>Unit {data.unitNumber}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">{data.jobNumber}</span>
          <span className="font-medium">${data.totalBudget.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  job: JobNode,
};

export function GanttChart({ jobs }: GanttChartProps) {
  const [contractorFilter, setContractorFilter] = useState<string>('all');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('all');
  const [jobCategoryFilter, setJobCategoryFilter] = useState<string>('all');
  const [floorPlanFilter, setFloorPlanFilter] = useState<string>('all');

  // Filter jobs based on selected filters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (contractorFilter !== 'all' && job.contractor !== contractorFilter) return false;
      if (jobTypeFilter !== 'all' && job.jobType !== jobTypeFilter) return false;
      if (jobCategoryFilter !== 'all' && job.jobCategory !== jobCategoryFilter) return false;
      if (floorPlanFilter !== 'all' && job.floorPlan !== floorPlanFilter) return false;
      return true;
    });
  }, [jobs, contractorFilter, jobTypeFilter, jobCategoryFilter, floorPlanFilter]);

  // Generate nodes from filtered jobs
  const initialNodes: Node[] = useMemo(() => {
    return filteredJobs.map((job, index) => ({
      id: job.id,
      type: 'job',
      position: { x: index * 320, y: 100 },
      data: job,
    }));
  }, [filteredJobs]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes when filtered jobs change
  React.useEffect(() => {
    const newNodes = filteredJobs.map((job, index) => ({
      id: job.id,
      type: 'job',
      position: { x: index * 320, y: 100 },
      data: job,
    }));
    setNodes(newNodes);
  }, [filteredJobs, setNodes]);

  // Get unique values for filters
  const contractors = useMemo(() => [...new Set(jobs.map(job => job.contractor))], [jobs]);
  const jobTypes = useMemo(() => [...new Set(jobs.map(job => job.jobType))], [jobs]);
  const jobCategories = useMemo(() => [...new Set(jobs.map(job => job.jobCategory))], [jobs]);
  const floorPlans = useMemo(() => [...new Set(jobs.map(job => job.floorPlan).filter(Boolean))], [jobs]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Gantt Chart - Project Timeline
        </CardTitle>
        
        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Contractor</label>
            <Select value={contractorFilter} onValueChange={setContractorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Contractors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contractors</SelectItem>
                {contractors.map(contractor => (
                  <SelectItem key={contractor} value={contractor}>
                    {contractor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Job Type</label>
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {jobTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Job Category</label>
            <Select value={jobCategoryFilter} onValueChange={setJobCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {jobCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Floor Plan</label>
            <Select value={floorPlanFilter} onValueChange={setFloorPlanFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Floor Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floor Plans</SelectItem>
                {floorPlans.map(plan => (
                  <SelectItem key={plan} value={plan!}>
                    {plan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[600px] w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
            className="bg-gray-50"
          >
            <Background />
            <Controls />
            <MiniMap 
              className="bg-background"
              nodeStrokeWidth={3}
              nodeColor={(node) => {
                const job = node.data as GanttJob;
                const today = new Date();
                
                if (job.status === 'Completed') {
                  return isBefore(new Date(), job.endDate) ? '#10b981' : '#059669';
                } else if (job.status === 'In Progress') {
                  return isAfter(today, job.endDate) ? '#ef4444' : '#3b82f6';
                } else if (job.status === 'Not Started' && isAfter(today, job.startDate)) {
                  return '#ef4444';
                }
                return '#6b7280';
              }}
            />
          </ReactFlow>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Completed Early</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Overdue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>Not Started</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}