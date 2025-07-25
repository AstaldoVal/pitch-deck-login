import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarProvider } from "@/components/ui/sidebar";
import { 
  Settings as SettingsIcon, 
  Plus, 
  Edit2, 
  Trash2,
  Check,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";

interface JobType {
  id: string;
  name: string;
  category: 'Interior' | 'Exterior';
}

const defaultJobTypes: JobType[] = [
  // Interior
  { id: "1", name: "Appliances", category: "Interior" },
  { id: "2", name: "Cabinets", category: "Interior" },
  { id: "3", name: "Countertops", category: "Interior" },
  { id: "4", name: "Electrical", category: "Interior" },
  { id: "5", name: "Flooring", category: "Interior" },
  { id: "6", name: "Make Ready", category: "Interior" },
  { id: "7", name: "Miscellaneous", category: "Interior" },
  { id: "8", name: "Plumbing", category: "Interior" },
  { id: "9", name: "Smart Tech", category: "Interior" },
  { id: "10", name: "Paint", category: "Interior" },
  { id: "11", name: "Rough Close Doors", category: "Interior" },
  { id: "12", name: "HVAC", category: "Interior" },
  
  // Exterior  
  { id: "13", name: "Balcony", category: "Exterior" },
  { id: "14", name: "Landscaping", category: "Exterior" },
  { id: "15", name: "Exterior Paint", category: "Exterior" },
  { id: "16", name: "Roofing", category: "Exterior" }
];

const Settings = () => {
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newJobType, setNewJobType] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load job types from localStorage or use defaults
    const savedJobTypes = localStorage.getItem('jobTypes');
    if (savedJobTypes) {
      try {
        const parsed = JSON.parse(savedJobTypes);
        // Check if the saved data has the new structure with categories
        if (parsed.length > 0 && parsed[0].category) {
          setJobTypes(parsed);
        } else {
          // Old format without categories, use defaults
          setJobTypes(defaultJobTypes);
          localStorage.setItem('jobTypes', JSON.stringify(defaultJobTypes));
        }
      } catch (error) {
        // Invalid JSON, use defaults
        setJobTypes(defaultJobTypes);
        localStorage.setItem('jobTypes', JSON.stringify(defaultJobTypes));
      }
    } else {
      setJobTypes(defaultJobTypes);
      localStorage.setItem('jobTypes', JSON.stringify(defaultJobTypes));
    }
  }, []);

  const saveJobTypes = (types: JobType[]) => {
    setJobTypes(types);
    localStorage.setItem('jobTypes', JSON.stringify(types));
  };

  const handleEdit = (jobType: JobType) => {
    setEditingId(jobType.id);
    setEditingName(jobType.name);
  };

  const handleSaveEdit = () => {
    if (!editingName.trim()) {
      toast({
        title: "Error",
        description: "Job type name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const updatedJobTypes = jobTypes.map(jt => 
      jt.id === editingId ? { ...jt, name: editingName.trim() } : jt
    );
    saveJobTypes(updatedJobTypes);
    setEditingId(null);
    setEditingName("");
    
    toast({
      title: "Success",
      description: "Job type updated successfully"
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = (id: string) => {
    const updatedJobTypes = jobTypes.filter(jt => jt.id !== id);
    saveJobTypes(updatedJobTypes);
    
    toast({
      title: "Success",
      description: "Job type deleted successfully"
    });
  };

  const handleAddNew = () => {
    if (!newJobType.trim()) {
      toast({
        title: "Error",
        description: "Job type name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const newId = Date.now().toString();
    const updatedJobTypes = [...jobTypes, { id: newId, name: newJobType.trim(), category: "Interior" as const }];
    saveJobTypes(updatedJobTypes);
    setNewJobType("");
    setIsAddingNew(false);
    
    toast({
      title: "Success",
      description: "New job type added successfully"
    });
  };

  const handleCancelAdd = () => {
    setNewJobType("");
    setIsAddingNew(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <SettingsIcon className="w-8 h-8 text-blue-600" />
                  <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                </div>
                <p className="text-gray-600">Manage your property management settings</p>
              </div>

              {/* Job Types Management */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Job Types</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage the types of jobs available for your properties
                    </p>
                  </div>
                  <Button 
                    onClick={() => setIsAddingNew(true)}
                    disabled={isAddingNew}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Job Type
                  </Button>
                </div>

                <div className="space-y-3">
                  {/* Add New Job Type Row */}
                  {isAddingNew && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Input
                        value={newJobType}
                        onChange={(e) => setNewJobType(e.target.value)}
                        placeholder="Enter job type name"
                        className="flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddNew();
                          if (e.key === 'Escape') handleCancelAdd();
                        }}
                      />
                      <Button onClick={handleAddNew} size="sm" variant="default">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button onClick={handleCancelAdd} size="sm" variant="outline">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Job Types List - Grouped by Category */}
                  {['Interior', 'Exterior'].map((category) => {
                    const categoryJobs = jobTypes.filter(job => job.category === category);
                    
                    if (categoryJobs.length === 0) return null;
                    
                    return (
                      <div key={category} className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 pt-4 first:pt-0">
                          {category}
                        </h3>
                        <div className="space-y-2 pl-4">
                          {categoryJobs.map((jobType) => (
                            <div key={jobType.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                              {editingId === jobType.id ? (
                                <>
                                  <Input
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="flex-1"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveEdit();
                                      if (e.key === 'Escape') handleCancelEdit();
                                    }}
                                  />
                                  <Button onClick={handleSaveEdit} size="sm" variant="default">
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button onClick={handleCancelEdit} size="sm" variant="outline">
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <span className="flex-1 font-medium text-gray-900">
                                    {jobType.name}
                                  </span>
                                  <Button 
                                    onClick={() => handleEdit(jobType)} 
                                    size="sm" 
                                    variant="outline"
                                    disabled={editingId !== null || isAddingNew}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    onClick={() => handleDelete(jobType.id)} 
                                    size="sm" 
                                    variant="outline"
                                    disabled={editingId !== null || isAddingNew}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {jobTypes.length === 0 && !isAddingNew && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-lg font-medium mb-2">No job types configured</p>
                      <p className="text-sm">Add your first job type to get started</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;