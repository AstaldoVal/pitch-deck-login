import { useState } from "react";
import { Users, Plus, CheckCircle, RotateCcw } from "lucide-react";
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

// Mock users data based on the screenshot
const users = [
  {
    id: 1,
    firstName: "Kathryn",
    lastName: "Murphy",
    email: "rosaliemuuk+murphy@gloriumtech.com",
    role: "Asset manager",
    inviteStatus: "invited"
  },
  {
    id: 2,
    firstName: "Darrell",
    lastName: "Steward",
    email: "dsteward@renoquest.com",
    role: "Asset manager",
    inviteStatus: "invited"
  },
  {
    id: 3,
    firstName: "Floyd",
    lastName: "Miles",
    email: "fmiles@renoquest.com",
    role: "Asset manager",
    inviteStatus: "invited"
  },
  {
    id: 4,
    firstName: "Kristin",
    lastName: "Watson",
    email: "kwatson@renoquest.com",
    role: "Asset manager",
    inviteStatus: "invited"
  },
  {
    id: 5,
    firstName: "Savannah",
    lastName: "Nguyen",
    email: "snguyen@renoquest.com",
    role: "Asset manager",
    inviteStatus: "invited"
  },
  {
    id: 6,
    firstName: "test",
    lastName: "user",
    email: "testuser@dfgh.sd",
    role: "Asset manager",
    inviteStatus: "pending"
  },
  {
    id: 7,
    firstName: "Quality Assurance",
    lastName: "Engineer",
    email: "rosaliemuuk@gmail.com",
    role: "Asset manager",
    inviteStatus: "pending"
  },
  {
    id: 8,
    firstName: "Test",
    lastName: "testTest",
    email: "rosaliemuuk+235@gloriumtech.com",
    role: "Asset manager",
    inviteStatus: "pending"
  },
  {
    id: 9,
    firstName: "Test",
    lastName: "Test 5",
    email: "rosaliemuuk+678@gloriumtech.com",
    role: "Asset manager",
    inviteStatus: "pending"
  },
  {
    id: 10,
    firstName: "Test1",
    lastName: "Test1",
    email: "keter1733@delension.com",
    role: "Asset manager",
    inviteStatus: "pending"
  },
  {
    id: 11,
    firstName: "Test Asset Manager",
    lastName: "Test 02/01",
    email: "rosaliemuuk+787@gloriumtech.com",
    role: "Asset manager",
    inviteStatus: "pending"
  },
  {
    id: 12,
    firstName: "New 03/01",
    lastName: "Asset Manager",
    email: "rosaliemuuk+999@gloriumtech.com",
    role: "Company owner",
    inviteStatus: "pending"
  }
];

const getInviteIcon = (status: string) => {
  switch (status) {
    case "invited":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "pending":
      return <RotateCcw className="w-4 h-4 text-orange-600" />;
    default:
      return null;
  }
};

export default function Contacts() {
  const location = useLocation();
  const isContractorsPage = location.pathname === "/contractors";
  const [userRoles, setUserRoles] = useState<{[key: number]: string}>(
    users.reduce((acc, user) => ({ ...acc, [user.id]: user.role }), {})
  );

  const handleInviteUser = () => {
    // TODO: Implement invite user functionality
    console.log("Invite user clicked");
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    setUserRoles(prev => ({ ...prev, [userId]: newRole }));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {isContractorsPage ? <PropertySidebar /> : <AppSidebar />}
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold text-gray-900">Users list</h1>
              </div>
              
              <Button onClick={handleInviteUser} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Invite user
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
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Invite</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.firstName}</TableCell>
                        <TableCell>{user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select 
                            value={userRoles[user.id]} 
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Asset manager">Asset Manager</SelectItem>
                              <SelectItem value="Property Owner">Property Owner</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {getInviteIcon(user.inviteStatus)}
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