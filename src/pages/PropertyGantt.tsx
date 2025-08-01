import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PropertySidebar } from '@/components/PropertySidebar';
import { AppHeader } from '@/components/AppHeader';
import { GanttChart, GanttJob } from '@/components/GanttChart';

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

// Mock data identical to PropertyJobs
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
    jobs: [
      {
        id: "job-3",
        jobNumber: "J-003",
        status: "Not Started",
        jobName: "Full Kitchen Renovation",
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-20'),
        contractor: "Elite Renovations",
        totalBudget: 12000,
        totalBid: 12500,
        totalInvoiced: 0,
      },
      {
        id: "job-4",
        jobNumber: "J-004",
        status: "Not Started", 
        jobName: "Bathroom Upgrade",
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-04-01'),
        contractor: "Premium Contractors",
        totalBudget: 8000,
        totalBid: 8300,
        totalInvoiced: 0,
      }
    ]
  }
];

export default function PropertyGantt() {
  const [jobs, setJobs] = useState<BidData[]>([]);

  useEffect(() => {
    // Load accepted bids as jobs from localStorage - same logic as PropertyJobs
    const savedBids = JSON.parse(localStorage.getItem('propertyBids') || '[]');
    const acceptedJobs = savedBids
      .filter((bid: BidData) => bid.status === 'accepted')
      .map((bid: BidData) => ({
        ...bid,
        unitsIncluded: mockUnits, // In real app, this would be filtered by the bid
      }));
    setJobs(acceptedJobs);
  }, []);

  // Convert job data to Gantt format - same logic as PropertyJobs
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
            jobType: 'Interior' as const, // Default to Interior, could be determined from job categories
            jobCategory: job.jobCategories?.[0]?.name || 'General',
            floorPlan: unit.floorPlan,
            startDate: unitJob.startDate,
            endDate: unitJob.endDate,
            status: unitJob.status === 'On Hold' ? 'Overdue' : unitJob.status,
            unitNumber: unit.unitNumber,
            totalBudget: unitJob.totalBudget,
          });
        });
      });
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
              <h1 className="text-3xl font-bold">Gantt Chart</h1>
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