import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PropertySidebar } from '@/components/PropertySidebar';
import { AppHeader } from '@/components/AppHeader';
import { GanttChart, GanttJob } from '@/components/GanttChart';

interface BidData {
  id: string;
  generatedBy: string;
  companyName: string;
  units: any[];
  totalBudget: number;
  submittedDate: string;
  startDate: string;
  endDate: string;
  status: string;
  jobs?: any[];
}

export default function PropertyGantt() {
  const [jobs, setJobs] = useState<BidData[]>([]);

  useEffect(() => {
    const savedBids = localStorage.getItem('acceptedBids');
    if (savedBids) {
      try {
        const bids = JSON.parse(savedBids);
        setJobs(bids);
      } catch (error) {
        console.error('Error parsing saved bids:', error);
      }
    }
  }, []);

  const convertToGanttJobs = (bids: BidData[]): GanttJob[] => {
    const ganttJobs: GanttJob[] = [];
    
    bids.forEach(bid => {
      if (bid.jobs && bid.jobs.length > 0) {
        bid.jobs.forEach(job => {
          ganttJobs.push({
            id: `${bid.id}-${job.jobName}`,
            jobNumber: job.jobNumber || `JOB-${Math.random().toString(36).substr(2, 9)}`,
            jobName: job.jobName,
            contractor: bid.companyName,
            jobType: job.jobType || 'General',
            jobCategory: job.jobCategory || 'Renovation',
            floorPlan: job.floorPlan,
            startDate: new Date(job.startDate || bid.startDate),
            endDate: new Date(job.endDate || bid.endDate),
            status: (job.status as 'Not Started' | 'In Progress' | 'Completed' | 'Overdue') || (bid.status as 'Not Started' | 'In Progress' | 'Completed' | 'Overdue') || 'Not Started',
            unitNumber: job.unitNumber || 'N/A',
            totalBudget: job.budget || 0,
          });
        });
      } else {
        // Fallback for bids without jobs
        ganttJobs.push({
          id: bid.id,
          jobNumber: `BID-${bid.id.slice(0, 8)}`,
          jobName: `Work for ${bid.companyName}`,
          contractor: bid.companyName,
          jobType: 'General',
          jobCategory: 'Renovation',
          startDate: new Date(bid.startDate),
          endDate: new Date(bid.endDate),
          status: (bid.status as 'Not Started' | 'In Progress' | 'Completed' | 'Overdue') || 'Not Started',
          unitNumber: 'Multiple',
          totalBudget: bid.totalBudget,
        });
      }
    });
    
    return ganttJobs;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PropertySidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Project Timeline</h1>
              <p className="text-muted-foreground">
                View project jobs and timelines in Gantt chart format.
              </p>
            </div>

            <GanttChart jobs={convertToGanttJobs(jobs)} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}