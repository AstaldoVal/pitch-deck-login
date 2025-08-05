import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Phone, Mail, MapPin, Calendar, Award, Building, Wrench } from "lucide-react";
import { PropertySidebar } from "@/components/PropertySidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Mock contractor data (expanded from the contractors list)
const contractorData = {
  1: {
    id: 1,
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@contractors.com",
    phone: "+1 (555) 123-4567",
    specialty: "Plumbing",
    status: "active",
    rating: 4.8,
    projectsCompleted: 15,
    avatar: null,
    address: "1234 Main St, City, State 12345",
    joinedDate: "2022-03-15",
    bio: "Experienced plumber with over 10 years in residential and commercial plumbing. Specializes in emergency repairs and new installations.",
    certifications: ["Licensed Plumber", "Gas Line Certified", "Water Heater Specialist"],
    services: ["Emergency Repairs", "Pipe Installation", "Water Heater Service", "Drain Cleaning"],
    hourlyRate: "$85-120",
    availability: "Available",
    recentProjects: [
      { id: 1, name: "Apartment Complex Renovation", date: "2024-01-15", status: "Completed" },
      { id: 2, name: "Office Building Repair", date: "2024-02-20", status: "In Progress" },
      { id: 3, name: "Residential Bathroom Upgrade", date: "2024-03-10", status: "Completed" }
    ]
  },
  2: {
    id: 2,
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@electricians.com",
    phone: "+1 (555) 234-5678",
    specialty: "Electrical",
    status: "active",
    rating: 4.9,
    projectsCompleted: 22,
    avatar: null,
    address: "5678 Oak Ave, City, State 12345",
    joinedDate: "2021-08-20",
    bio: "Master electrician with expertise in both residential and commercial electrical systems. Known for quality work and safety standards.",
    certifications: ["Master Electrician", "Code Compliance Certified", "Solar Installation Certified"],
    services: ["Electrical Repairs", "Panel Upgrades", "Lighting Installation", "Solar Systems"],
    hourlyRate: "$95-130",
    availability: "Available",
    recentProjects: [
      { id: 1, name: "Shopping Center Lighting", date: "2024-01-05", status: "Completed" },
      { id: 2, name: "Residential Solar Installation", date: "2024-02-15", status: "Completed" },
      { id: 3, name: "Office Electrical Upgrade", date: "2024-03-25", status: "In Progress" }
    ]
  }
  // Add more contractors as needed
};

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

export default function ContractorDetails() {
  const { contractorId } = useParams<{ contractorId: string }>();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState<any>(null);

  useEffect(() => {
    if (contractorId) {
      const id = parseInt(contractorId, 10);
      const contractorInfo = contractorData[id as keyof typeof contractorData];
      setContractor(contractorInfo || null);
    }
  }, [contractorId]);

  const handleBack = () => {
    navigate("/contractors");
  };

  if (!contractor) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <PropertySidebar />
          <div className="flex-1 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold text-gray-900">Contractor Not Found</h1>
              </div>
            </header>
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Contractor not found</h2>
                <Button onClick={handleBack}>Back to Contractors</Button>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <PropertySidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Contractors
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {contractor.firstName} {contractor.lastName}
                </h1>
              </div>
              
              <div className="flex items-center gap-3">
                {getStatusBadge(contractor.status)}
                {renderRating(contractor.rating)}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column - Profile & Contact */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Profile Card */}
                <Card>
                  <CardHeader className="text-center pb-4">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={contractor.avatar} />
                      <AvatarFallback className="text-2xl">
                        {contractor.firstName[0]}{contractor.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl">
                      {contractor.firstName} {contractor.lastName}
                    </CardTitle>
                    <p className="text-muted-foreground">{contractor.specialty}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{contractor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{contractor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{contractor.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Joined {new Date(contractor.joinedDate).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Projects Completed</span>
                      <span className="font-semibold">{contractor.projectsCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{contractor.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Hourly Rate</span>
                      <span className="font-semibold">{contractor.hourlyRate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Availability</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {contractor.availability}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Bio Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {contractor.bio}
                    </p>
                  </CardContent>
                </Card>

                {/* Services & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Services */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Wrench className="w-5 h-5" />
                        Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {contractor.services.map((service: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Certifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {contractor.certifications.map((cert: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Recent Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contractor.recentProjects.map((project: any) => (
                        <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm">{project.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(project.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge 
                            variant={project.status === "Completed" ? "default" : "secondary"}
                            className={project.status === "Completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button className="flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Contractor
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}