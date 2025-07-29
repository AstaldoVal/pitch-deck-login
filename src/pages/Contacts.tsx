import { useState } from "react";
import { Users, Plus, Search, Filter, Mail, Phone, Building2, MapPin, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock contractor data
const contractors = [
  {
    id: 1,
    companyName: "Electrical Solutions Inc",
    businessAddress: "123 Main St, New York, NY 10001",
    phoneNumber: "(555) 123-4567",
    emailAddress: "contact@electrical.com",
    status: "active",
    dateAdded: "2024-01-15"
  },
  {
    id: 2,
    companyName: "Premier Flooring Co",
    businessAddress: "456 Oak Ave, Los Angeles, CA 90210",
    phoneNumber: "(555) 234-5678",
    emailAddress: "info@flooring.com",
    status: "active",
    dateAdded: "2023-11-22"
  },
  {
    id: 3,
    companyName: "Reliable Plumbing",
    businessAddress: "789 Pine St, Chicago, IL 60601",
    phoneNumber: "(555) 345-6789",
    emailAddress: "contact@plumbing.com",
    status: "pending",
    dateAdded: "2024-02-10"
  },
  {
    id: 4,
    companyName: "ABC Construction",
    businessAddress: "321 Elm St, Houston, TX 77001",
    phoneNumber: "(555) 456-7890",
    emailAddress: "info@abcconstruction.com",
    status: "active",
    dateAdded: "2023-09-05"
  },
  {
    id: 5,
    companyName: "Tech Services Ltd",
    businessAddress: "654 Cedar Ave, Phoenix, AZ 85001",
    phoneNumber: "(555) 567-8901",
    emailAddress: "contact@techservices.com",
    status: "inactive",
    dateAdded: "2024-03-01"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "pending":
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    case "inactive":
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
    case "pending":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case "inactive":
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Inactive</Badge>;
    default:
      return null;
  }
};

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter contractors based on search term
  const filteredContractors = contractors.filter(contractor =>
    contractor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.businessAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredContractors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContractors = filteredContractors.slice(startIndex, endIndex);

  const handleInviteContractor = () => {
    // TODO: Implement invite functionality
    console.log("Invite contractor clicked");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">Contractors</h1>
                </div>
              </div>
              
              <Button onClick={handleInviteContractor} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Invite Contractor
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow">
              {/* Search and Filter Bar */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search contractors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Total {filteredContractors.length} contractors
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead>Email Address</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Business Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentContractors.map((contractor) => (
                      <TableRow key={contractor.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{contractor.companyName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            Added {new Date(contractor.dateAdded).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <a href={`mailto:${contractor.emailAddress}`} className="text-blue-600 hover:underline">
                              {contractor.emailAddress}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{contractor.phoneNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{contractor.businessAddress}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(contractor.status)}
                            {getStatusBadge(contractor.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-gray-200">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}