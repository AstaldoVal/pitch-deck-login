import { useState } from "react";
import { HardHat, Plus, CheckCircle, RotateCcw, Star } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { PropertySidebar } from "@/components/PropertySidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock contractors data
const contractors = [
  {
    id: 1,
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@contractors.com",
    specialty: "Plumbing",
    status: "active",
    rating: 4.8,
    projectsCompleted: 15
  },
  {
    id: 2,
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@electricians.com",
    specialty: "Electrical",
    status: "active",
    rating: 4.9,
    projectsCompleted: 22
  },
  {
    id: 3,
    firstName: "Carlos",
    lastName: "Rodriguez",
    email: "carlos.rodriguez@painting.com",
    specialty: "Painting",
    status: "active",
    rating: 4.7,
    projectsCompleted: 18
  },
  {
    id: 4,
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@flooring.com",
    specialty: "Flooring",
    status: "pending",
    rating: 4.6,
    projectsCompleted: 12
  },
  {
    id: 5,
    firstName: "Jennifer",
    lastName: "Davis",
    email: "jennifer.davis@hvac.com",
    specialty: "HVAC",
    status: "active",
    rating: 4.9,
    projectsCompleted: 25
  },
  {
    id: 6,
    firstName: "Robert",
    lastName: "Wilson",
    email: "robert.wilson@roofing.com",
    specialty: "Roofing",
    status: "inactive",
    rating: 4.5,
    projectsCompleted: 8
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
    case "pending":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case "inactive":
      return <Badge variant="outline" className="bg-gray-100 text-gray-600">Inactive</Badge>;
    default:
      return null;
  }
};

const renderRating = (rating: number) => {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{rating}</span>
    </div>
  );
};

export default function Contractors() {
  const location = useLocation();
  const isPropertyContractors = location.pathname === "/contractors";
  const { toast } = useToast();
  const [contractorSpecialties, setContractorSpecialties] = useState<{[key: number]: string}>(
    contractors.reduce((acc, contractor) => ({ ...acc, [contractor.id]: contractor.specialty }), {})
  );

  const handleAddContractor = () => {
    // TODO: Implement add contractor functionality
    console.log("Add contractor clicked");
  };

  const handleSpecialtyChange = (contractorId: number, newSpecialty: string) => {
    setContractorSpecialties(prev => ({ ...prev, [contractorId]: newSpecialty }));
  };

  const handleViewDetails = (contractorId: number) => {
    // TODO: Implement view contractor details functionality
    console.log("View contractor details:", contractorId);
    // Navigate to contractor detail page
    // navigate(`/contractor/${contractorId}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {isPropertyContractors ? <PropertySidebar /> : <AppSidebar />}
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                  <HardHat className="w-6 h-6 text-orange-600" />
                  <h1 className="text-2xl font-bold text-gray-900">Contractors</h1>
                </div>
              </div>
              
              <Button onClick={handleAddContractor} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Contractor
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow">
              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contractors.map((contractor) => (
                      <TableRow key={contractor.id}>
                        <TableCell className="font-medium">
                          {contractor.firstName} {contractor.lastName}
                        </TableCell>
                        <TableCell>{contractor.email}</TableCell>
                        <TableCell>
                          <Select 
                            value={contractorSpecialties[contractor.id]} 
                            onValueChange={(value) => handleSpecialtyChange(contractor.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Plumbing">Plumbing</SelectItem>
                              <SelectItem value="Electrical">Electrical</SelectItem>
                              <SelectItem value="Painting">Painting</SelectItem>
                              <SelectItem value="Flooring">Flooring</SelectItem>
                              <SelectItem value="HVAC">HVAC</SelectItem>
                              <SelectItem value="Roofing">Roofing</SelectItem>
                              <SelectItem value="General">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(contractor.status)}
                        </TableCell>
                        <TableCell>
                          {renderRating(contractor.rating)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {contractor.projectsCompleted} completed
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(contractor.id)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}