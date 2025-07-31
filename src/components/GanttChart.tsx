import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { format, differenceInDays, isAfter, isBefore, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay } from 'date-fns';

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

  // Calculate timeline range
  const timelineRange = useMemo(() => {
    if (filteredJobs.length === 0) return { start: new Date(), end: addDays(new Date(), 30), days: [] };
    
    const allDates = filteredJobs.flatMap(job => [job.startDate, job.endDate]);
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    // Extend range a bit for better visualization
    const start = startOfWeek(addDays(minDate, -7));
    const end = endOfWeek(addDays(maxDate, 7));
    
    const days = eachDayOfInterval({ start, end });
    
    return { start, end, days };
  }, [filteredJobs]);

  // Get unique values for filters
  const contractors = useMemo(() => [...new Set(jobs.map(job => job.contractor))], [jobs]);
  const jobTypes = useMemo(() => [...new Set(jobs.map(job => job.jobType))], [jobs]);
  const jobCategories = useMemo(() => [...new Set(jobs.map(job => job.jobCategory))], [jobs]);
  const floorPlans = useMemo(() => [...new Set(jobs.map(job => job.floorPlan).filter(Boolean))], [jobs]);

  const getStatusColor = (job: GanttJob) => {
    const today = new Date();
    
    if (job.status === 'Completed') {
      return isBefore(new Date(), job.endDate) ? 'bg-green-500' : 'bg-green-600';
    } else if (job.status === 'In Progress') {
      return isAfter(today, job.endDate) ? 'bg-red-500' : 'bg-blue-500';
    } else if (job.status === 'Not Started' && isAfter(today, job.startDate)) {
      return 'bg-red-500';
    }
    return 'bg-gray-400';
  };

  const getStatusText = (job: GanttJob) => {
    const today = new Date();
    
    if (job.status === 'Completed') {
      return isBefore(new Date(), job.endDate) ? 'Completed Early' : 'Completed';
    } else if (job.status === 'In Progress') {
      return isAfter(today, job.endDate) ? 'Overdue' : 'In Progress';
    } else if (job.status === 'Not Started' && isAfter(today, job.startDate)) {
      return 'Overdue';
    }
    return job.status;
  };

  const calculateJobPosition = (job: GanttJob) => {
    const totalDays = timelineRange.days.length;
    const jobStartIndex = timelineRange.days.findIndex(day => isSameDay(day, job.startDate));
    const jobEndIndex = timelineRange.days.findIndex(day => isSameDay(day, job.endDate));
    
    if (jobStartIndex === -1 || jobEndIndex === -1) return { left: '0%', width: '0%' };
    
    const left = (jobStartIndex / totalDays) * 100;
    const width = ((jobEndIndex - jobStartIndex + 1) / totalDays) * 100;
    
    return { left: `${left}%`, width: `${Math.max(width, 1)}%` };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Gantt Chart - Project Timeline
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="border rounded-lg overflow-hidden bg-background">
          {/* Header with timeline */}
          <div className="grid grid-cols-[300px_1fr] border-b bg-muted/50">
            <div className="p-3 border-r font-semibold">
              Jobs
            </div>
            <div className="flex border-r">
              {timelineRange.days.map((day, index) => (
                <div
                  key={day.toISOString()}
                  className="flex-1 min-w-[30px] p-1 text-xs text-center border-r last:border-r-0"
                  style={{ minWidth: '30px' }}
                >
                  <div className="font-medium">{format(day, 'dd')}</div>
                  <div className="text-muted-foreground">{format(day, 'MMM')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs with timeline bars */}
          <div className="max-h-[500px] overflow-y-auto">
            {filteredJobs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No jobs match the selected filters
              </div>
            ) : (
              filteredJobs.map((job) => {
                const position = calculateJobPosition(job);
                const duration = differenceInDays(job.endDate, job.startDate) + 1;
                
                return (
                  <div key={job.id} className="grid grid-cols-[300px_1fr] border-b hover:bg-muted/30">
                    {/* Job info */}
                    <div className="p-3 border-r">
                      <div className="font-medium text-sm mb-1">{job.jobName}</div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>Unit {job.unitNumber}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{job.contractor}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{duration} days</span>
                        </div>
                        <div className="font-medium">{formatCurrency(job.totalBudget)}</div>
                      </div>
                    </div>
                    
                    {/* Timeline bar */}
                    <div className="relative h-16 border-r flex items-center">
                      <div 
                        className={`absolute h-6 rounded-sm ${getStatusColor(job)} flex items-center justify-center text-white text-xs font-medium shadow-sm`}
                        style={{
                          left: position.left,
                          width: position.width,
                          minWidth: '60px'
                        }}
                      >
                        <span className="truncate px-2">
                          {getStatusText(job)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
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
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span>Not Started</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}