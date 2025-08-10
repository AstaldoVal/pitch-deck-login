import { useEffect, useMemo } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Download, FileText, ChevronRight, ChevronDown } from "lucide-react";

interface JobRow {
  name: string;
  budget: number;
  incurred: number;
}

interface FloorPlanRow {
  name: string;
  units: number;
  budget: number;
  incurred: number;
  jobs: JobRow[];
}

interface PropertyBudgetRow {
  property: string;
  name: string;
  start: string;
  end: string;
  budget: number;
  incurred: number;
  floorPlans: FloorPlanRow[];
}

const currency = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function BudgetsContent() {
  const { open } = useSidebar();

  const data: PropertyBudgetRow[] = useMemo(() => [
    {
      property: "Berkley Landing",
      name: "Berkley Landing Budget",
      start: "03/05/2025",
      end: "05/05/2025",
      budget: 4000,
      incurred: 0,
      floorPlans: [
        {
          name: ".14280.",
          units: 20,
          budget: 4000,
          incurred: 0,
          jobs: [
            { name: "Appliances", budget: 1500, incurred: 0 },
            { name: "Countertops", budget: 1250, incurred: 0 },
            { name: "Flooring", budget: 1000, incurred: 0 },
            { name: "Make ready", budget: 250, incurred: 0 },
          ],
        },
      ],
    },
    {
      property: "0606 Property",
      name: "0606-2 Property",
      start: "03/05/2025",
      end: "03/29/2025",
      budget: 8820,
      incurred: 1800,
      floorPlans: [],
    },
  ], []);

  useEffect(() => {
    document.title = "Budgets – Renovation Management";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Budgets overview with interior, exterior, and general categories.');
  }, []);

  return (
    <div className="flex-1 relative">
      <div className={`fixed top-0 right-0 z-20 bg-white transition-all duration-200 ${open ? 'left-[240px]' : 'left-[56px]'}`}>
        <AppHeader />
      </div>
      <div className="pt-16 h-screen overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Budgets</h1>
              <p className="text-muted-foreground mt-1">Track budgets, incurred costs, and differences</p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" /> Add New
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" /> CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" /> PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tabs */}
          <Card className="p-4">
            <Tabs defaultValue="interior">
              <TabsList className="mb-4">
                <TabsTrigger value="interior">Interior</TabsTrigger>
                <TabsTrigger value="exterior">Exterior</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>

              {/* Interior Tab Content */}
              <TabsContent value="interior" className="space-y-4">
                {/* Table header */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[320px]">Property</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="whitespace-nowrap">Start - end date</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Budget ($)</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Total Cost Incurred ($)</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Difference ($)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row, idx) => {
                        const diff = row.budget - row.incurred;
                        return (
                          <Accordion key={idx} type="single" collapsible className="w-full">
                            <AccordionItem value={`item-${idx}`}>
                              <TableRow>
                                <TableCell className="font-medium">
                                  <AccordionTrigger className="flex items-center gap-2 p-0 hover:no-underline">
                                    <ChevronRight className="h-4 w-4 data-[state=open]:hidden" />
                                    <ChevronDown className="h-4 w-4 hidden data-[state=open]:block" />
                                    {row.property}
                                  </AccordionTrigger>
                                </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.start} - {row.end}</TableCell>
                                <TableCell className="text-right">{currency(row.budget)}</TableCell>
                                <TableCell className="text-right">{currency(row.incurred)}</TableCell>
                                <TableCell className={`text-right ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>{currency(diff)}</TableCell>
                              </TableRow>
                              <AccordionContent>
                                {/* Floor plans */}
                                {row.floorPlans.length > 0 && (
                                  <div className="bg-muted/30 rounded-md p-3 mx-3 mb-3">
                                    <Table>
                                      <TableBody>
                                        {row.floorPlans.map((fp, fIdx) => {
                                          const fpDiff = fp.budget - fp.incurred;
                                          return (
                                            <Accordion key={fIdx} type="single" collapsible className="w-full">
                                              <AccordionItem value={`fp-${idx}-${fIdx}`}>
                                                <TableRow>
                                                  <TableCell className="pl-6 text-muted-foreground">Floor Plan</TableCell>
                                                  <TableCell className="font-medium">
                                                    <AccordionTrigger className="flex items-center gap-2 p-0 hover:no-underline">
                                                      <ChevronRight className="h-4 w-4 data-[state=open]:hidden" />
                                                      <ChevronDown className="h-4 w-4 hidden data-[state=open]:block" />
                                                      {fp.name}
                                                    </AccordionTrigger>
                                                  </TableCell>
                                                  <TableCell className="whitespace-nowrap">
                                                    <Badge variant="secondary">Units: {fp.units}</Badge>
                                                  </TableCell>
                                                  <TableCell className="text-right">{currency(fp.budget)}</TableCell>
                                                  <TableCell className="text-right">{currency(fp.incurred)}</TableCell>
                                                  <TableCell className={`text-right ${fpDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>{currency(fpDiff)}</TableCell>
                                                </TableRow>
                                                <AccordionContent>
                                                  {/* Jobs */}
                                                  <div className="bg-background rounded-md p-3 mx-3">
                                                    <Table>
                                                      <TableHeader>
                                                        <TableRow>
                                                          <TableHead className="pl-14">Job</TableHead>
                                                          <TableHead className="text-right">Budget ($)</TableHead>
                                                          <TableHead className="text-right">Total Cost Incurred ($)</TableHead>
                                                          <TableHead className="text-right">Difference ($)</TableHead>
                                                        </TableRow>
                                                      </TableHeader>
                                                      <TableBody>
                                                        {fp.jobs.map((job, jIdx) => {
                                                          const jDiff = job.budget - job.incurred;
                                                          return (
                                                            <TableRow key={jIdx}>
                                                              <TableCell className="pl-14">{job.name}</TableCell>
                                                              <TableCell className="text-right">{currency(job.budget)}</TableCell>
                                                              <TableCell className="text-right">{currency(job.incurred)}</TableCell>
                                                              <TableCell className={`text-right ${jDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>{currency(jDiff)}</TableCell>
                                                            </TableRow>
                                                          );
                                                        })}
                                                      </TableBody>
                                                    </Table>
                                                  </div>
                                                </AccordionContent>
                                              </AccordionItem>
                                            </Accordion>
                                          );
                                        })}
                                      </TableBody>
                                    </Table>
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Placeholder content for other tabs */}
              <TabsContent value="exterior">
                <div className="text-muted-foreground text-sm">No exterior budgets yet.</div>
              </TabsContent>
              <TabsContent value="general">
                <div className="text-muted-foreground text-sm">No general budgets yet.</div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Budgets() {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar />
        <BudgetsContent />
      </div>
    </SidebarProvider>
  );
}
